const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const DB = require('./db');

const app = express();
const db = new DB();

app.use(bodyParser.json());
app.use(express.static(__dirname));

db.on('GET', (rows) => {
    console.log('\n Событие GET ');
    console.table(rows);
});

db.on('POST', (row) => {
    console.log('\n Событие POST (добавление новой записи) ');
    console.table([row]);
});

db.on('PUT', (row) => {
    console.log('\n Событие PUT (обновление записи) ');
    console.table([row]);
});

db.on('DELETE', (row) => {
    console.log('\n Событие DELETE (удаление записи) ');
    console.table([row]);
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



app.post('/api/db', async (req, res) => {
    try {
        const newRow = await db.insert(req.body);
        res.json(newRow);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

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



app.listen(5000, () => console.log('http://localhost:5000'));
