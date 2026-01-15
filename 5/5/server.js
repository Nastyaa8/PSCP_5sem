const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const DB = require('./db');
const readline = require('readline');

const app = express();
const db = new DB();

app.use(bodyParser.json());
app.use(express.static(__dirname));

db.on('GET', (rows) => {
    console.log('\nСобытие GET');
    console.table(rows);
});
db.on('POST', (row) => {
    console.log('\nСобытие POST');
    console.table([row]);
});
db.on('PUT', (row) => {
    console.log('\nСобытие PUT');
    console.table([row]);
});
db.on('DELETE', (row) => {
    console.log('\nDELETE');
    console.table([row]);
});
db.on('COMMIT', (info) => {
    console.log('\nСобытие COMMIT');
    console.log('time:', info.timestamp);
});

let stats = {
    active: false,
    start: null,
    end: null,
    requests: 0,
    commits: 0
};

app.use((req, res, next) => {
    if (stats.active) stats.requests++;
    next();
});

db.on('COMMIT', () => {
    if (stats.active) stats.commits++;
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/db', async (req, res) => {
    try {
        const idParam = req.query.id;
        if (idParam) {
            const id = parseInt(idParam, 10);
            const row = await db.getById(id);
            res.json(row);
        } else {
            const rows = await db.select();
            res.json(rows);
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST /api/db
app.post('/api/db', async (req, res) => {
    try {
        const newRow = await db.insert(req.body);
        res.json(newRow);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/db
app.put('/api/db', async (req, res) => {
    try {
        const updatedRow = await db.update(req.body);
        res.json(updatedRow);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/db', async (req, res) => {
    try {
        const id = parseInt(req.query.id, 10);
        if (isNaN(id)) throw new Error('Некорректный id');
        const deletedRow = await db.delete(id);
        res.json(deletedRow);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/ss', (req, res) => {
    res.json({
        start: stats.start ? stats.start.toISOString() : null,
        end: stats.end ? stats.end.toISOString() : null,
        requests: stats.requests,
        commits: stats.commits
    });
});

const server = app.listen(5000, () => console.log('\n Сервер запущен: http://localhost:5000'));

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: '' });

let sdTimeout = null;     
let scInterval = null;     
let ssTimer = null;        

function cancelSd() {
    if (sdTimeout) {
        clearTimeout(sdTimeout);
        sdTimeout = null;
        console.log('sd: отложенная остановка сервера отменена');
    }
}

function cancelSc() {
    if (scInterval) {
        clearInterval(scInterval);
        scInterval = null;
        console.log('sc: периодическая фиксация остановлена');
    }
}

function cancelSs() {
    if (ssTimer) {
        clearTimeout(ssTimer);
        ssTimer = null;
    }
    if (stats.active) {
        stats.active = false;
        stats.end = new Date();
        console.log('ss: сбор статистики остановлен. Результат: start=', stats.start, ' end=', stats.end, ' req=', stats.requests, ' commits=', stats.commits);
    } else {
        console.log('ss: сбор статистики не был активен');
    }
}

function gracefulShutdown() {
    console.log('Остановка сервера...');
    cancelSd();
    cancelSc();
    cancelSs();
    server.close(() => {
        console.log('Сервер остановлен');
        process.exit(0);
    });
    setTimeout(() => {
        console.log('Принудительная остановка');
        process.exit(1);
    }, 5000).unref();
}

rl.on('line', (line) => {
    const raw = line.trim();
    if (!raw) return;
    const parts = raw.split(/\s+/);
    const cmd = parts[0];
    const arg = parts[1] ? parts[1].trim() : undefined;

    switch (cmd) {
        case 'sd': {
            if (!arg) {
                cancelSd();
                break;
            }
            const x = parseInt(arg, 10);
            if (isNaN(x) || x < 0) {
                console.log('sd: неверный параметр. Использование: sd x  или sd (для отмены)');
                break;
            }
            cancelSd();
            sdTimeout = setTimeout(() => {
                console.log(`sd: прошло ${x} секунд — останавливаю сервер`);
                gracefulShutdown();
            }, x * 1000);
            console.log(`sd: сервер будет остановлен через ${x} сек (ввод новой sd отменит предыдущую)`);
            break;
        }
        case 'sc': {
            if (!arg) {
                cancelSc();
                break;
            }
            const x = parseInt(arg, 10);
            if (isNaN(x) || x <= 0) {
                console.log('sc: неверный параметр. Использование: sc x  или sc (для остановки)');
                break;
            }
            cancelSc();
            scInterval = setInterval(() => {
                db.commit();
            }, x * 1000);
            scInterval.unref();
            console.log(`sc: периодическая фиксация запущена каждые ${x} сек`);
            break;
        }
        case 'ss': {
            if (!arg) {
                cancelSs();
                break;
            }
            const x = parseInt(arg, 10);
            if (isNaN(x) || x <= 0) {
                console.log('ss: неверный параметр. Использование: ss x  или ss (для остановки)');
                break;
            }
            cancelSs();

            stats.active = true;
            stats.start = new Date();
            stats.end = null;
            stats.requests = 0;
            stats.commits = 0;
            console.log(`ss: сбор статистики запущен на ${x} сек (start=${stats.start.toISOString()})`);

            ssTimer = setTimeout(() => {
                stats.active = false;
                stats.end = new Date();
                console.log('ss: сбор статистики завершён', {
                    start: stats.start.toISOString(),
                    end: stats.end.toISOString(),
                    requests: stats.requests,
                    commits: stats.commits
                });
                ssTimer = null;
            }, x * 1000);
            ssTimer.unref();
            break;
        }
        default:
            console.log('Неизвестная команда');
    }
});
