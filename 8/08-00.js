const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
let date = new Date();

    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'GMT'
    };

    const formattedDate = date.toLocaleString('en-GB', options).replace(',', '');

let keepAliveTimeout = 5000;
const port = 3000;
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;
    server.keepAliveTimeout = keepAliveTimeout;

    // Задание 01: /connection и /connection?set=set
    if (pathname === '/connection') {
        if (query.set) {
            keepAliveTimeout = parseInt(query.set);
            server.keepAliveTimeout = keepAliveTimeout; // Устанавливаем тайм-аут на сервере
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(`Установлено новое значение KeepAliveTimeout=${keepAliveTimeout}`);
        } else {
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(`Текущее значение KeepAliveTimeout: ${server.keepAliveTimeout}`);
        }
    }

    // Задание 02: /headers
    else if (pathname === '/headers') {
        const customHeaders = {
            'Connection': 'keep-alive',
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
            'Date' :` ${formattedDate + ' GMT'}`,
            'X-Custom-Header': 'CustomHeaderValue',

        };
        res.writeHead(200, customHeaders);
    
        res.write('Заголовки запроса:\n');
        for (const [header, value] of Object.entries(req.headers)) {
            res.write(`${header}: ${value}\n`);
        }
    
        res.write('\nЗаголовки ответа:\n');
        for (const [header, value] of Object.entries(customHeaders)) {
            res.write(`${header}: ${value}\n`);
        }
    
        res.end();
    }    

    // Задание 03: /parameter?x=x&&y=y
    else if (pathname === '/parameter') {
        const x = parseFloat(query.x);
        const y = parseFloat(query.y);
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        if (!isNaN(x) && !isNaN(y)) {
            res.end(`Сумма: ${x + y}\nРазность: ${x - y}\nПроизведение: ${x * y}\nЧастное: ${x / y}`);
        } else {
            res.end('Ошибка: x и y должны быть числовыми значениями');
        }
    }

    // Задание 04: /parameter/x/y 
    else if (pathname.startsWith('/parameter/')) {
        const parts = pathname.split('/');
        const x = parseFloat(parts[2]);
        const y = parseFloat(parts[3]);
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        if (!isNaN(x) && !isNaN(y)) {
            res.end(`Сумма: ${x + y}\nРазность: ${x - y}\nПроизведение: ${x * y}\nЧастное: ${x / y}`);
        } else {
            res.end('Ошибка: x и y должны быть числовыми значениями');
        }
    }

    // Задание 05: /close
    else if (pathname === '/close') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Сервер будет закрыт через 10 секунд');
        setTimeout(() => {
            server.close();
        }, 10000);
    }

    // Задание 06: /socket
    else if (pathname === '/socket') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`IP клиента: ${req.socket.remoteAddress}\nПорт клиента: ${req.socket.remotePort}\nIP сервера: ${req.socket.localAddress}\nПорт сервера: ${req.socket.localPort}`);
    }

    // Задание 07: /req-data
    else if (pathname === '/req-data') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString(); 
            console.log(`Получен фрагмент данных: ${chunk.toString()}`);
            
            res.write(`Получен фрагмент данных: ${chunk.toString()}\n`);
        });

        req.on('end', () => {
            res.end(`Запрос полностью обработан. Все данные: ${body}\n`);
            console.log('Все данные получены: ', body);
        });
    }

    // Задание 08: /resp-status?code=c&mess=m 
    else if (pathname === '/resp-status') {
        const code = parseInt(query.code, 10);
        const message = query.mess || 'Сообщение не указано';
    
        if (!isNaN(code) && code >= 100 && code <= 599) {
          
            const safeStatusMessage = message.replace(/[^ -~]/g, '');
            res.statusMessage = safeStatusMessage || 'OK';
    
            res.writeHead(code, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(`Код состояния: ${code}\nСообщение: ${message}`); 
        } else {
            res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Ошибка: некорректный код состояния.');
        }
    }
    
    // Задание 09: /formparameter
    else if (pathname === '/formparameter') {
        if (req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
                <html>
                    <body>
                        <form action="/formparameter" method="post" enctype="multipart/form-data">
                            <input type="text" name="textInput" placeholder="Text Input" required><br>
                            <input type="number" name="numberInput" placeholder="Number Input" required><br>
                            <input type="date" name="dateInput" required><br>
                            <input type="checkbox" name="checkboxInput" value="checked"> Checkbox<br>
                            <input type="radio" name="radioInput" value="option1" checked> Option 1<br>
                            <input type="radio" name="radioInput" value="option2"> Option 2<br>
                            <textarea name="textareaInput" placeholder="Textarea Input"></textarea><br>
                            <input type="submit" name="submit" value="Submit">
                        </form>
                    </body>
                </html>
            `);
        } else if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                const params = querystring.parse(body);
                res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end(`Полученные параметры:\n${JSON.stringify(params, null, 2)}`);
                console.log('Полученные параметры: ', params);
            });
        }
    }

    // Задание 10: /json
    else if (pathname === '/json') {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                const data = JSON.parse(body);
                const response = {
                    'comment': "Ответ. Лабораторская работа 8/10",
                    'x+y': data.x + data.y,
                    'Concatenation_s_o': "Сообщение: " + data.o.surname + ", " + data.o.name,
                    'Length_m': data.m.length
                };
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(response));
            });
        }
    }

    // Задание 11: /xml
   // Задание 11: /xml
else if (pathname === '/xml') {
    if (req.method === 'POST') {
        let body = '';

        // Сбор данных POST-запроса
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const xml2js = require('xml2js');
            const parser = new xml2js.Parser();

            parser.parseString(body, (err, result) => {
                if (err) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('Ошибка при разборе XML');
                    return;
                }

                try {
                   
                    const requestId = parseInt(result.request.$.id, 10);
                    const xValues = result.request.x.map(x => parseFloat(x.$.value));
                    const mValues = result.request.m.map(m => m.$.value);
                    const sumX = xValues.reduce((acc, curr) => acc + curr, 0);
                    const concatM = mValues.join('');
                    const responseXml = `
                        <response id="${requestId + 5}" request="${requestId}">
                            <sum element="x" result="${sumX}" />
                            <concat element="m" result="${concatM}" />
                        </response>
                    `;

                    res.writeHead(200, { 'Content-Type': 'application/xml' });
                    res.end(responseXml);

                } catch (e) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Ошибка обработки данных XML');
                }
            });
        });

    } else {
        
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Метод не поддерживается');
    }
}

    // Задание 12: /files
    else if (pathname === '/files') {
        fs.readdir('./static', (err, files) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Ошибка при чтении директории');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'X-static-files-count': files.length });
            res.end(`Количество файлов: ${files.length}`);
        });
    }

    // Задание 13: /files/filename
    else if (pathname.startsWith('/files/')) {
        const filename = pathname.replace('/files/', '');
        const filepath = path.join(__dirname, 'static', filename);
    
        fs.access(filepath, fs.constants.F_OK, (err) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Файл не найден');
                return;
            }
    
            const mime = require('mime-types');
            const contentType = mime.lookup(filepath) || 'text/plain';
            res.writeHead(200, { 'Content-Type': contentType });
            const readStream = fs.createReadStream(filepath);
            readStream.pipe(res);
        });
    }
    

    // Задание 14: /upload (загрузка файла)
    else if (pathname === '/upload') {
        if (req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
                <html>
                    <body>
                        <form action="/upload" method="post" enctype="multipart/form-data">
                            <input type="file" name="file" />
                            <button type="submit">Загрузить файл</button>
                        </form>
                    </body>
                </html>
            `);
        } else if (req.method === 'POST') {
            const boundary = req.headers['content-type'].split('; ')[1].replace('boundary=', '');
            let body = '';

            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                // Разбиваем тело запроса на части
                const parts = body.split(`--${boundary}`).filter(part => part.includes('filename='));

                if (parts.length > 0) {
                    const filePart = parts[0];
                    const fileContent = filePart.split('\r\n\r\n')[1].split('\r\n--')[0];
                    const filename = filePart.match(/filename="(.+)"/)[1].replace(/"/g, '');

                    const filePath = path.join(__dirname, 'static', filename);

                    // Записываем файл
                    fs.writeFile(filePath, fileContent, 'binary', err => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                            res.end('Ошибка при сохранении файла');
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                            res.end('Файл успешно загружен');
                        }
                    });
                } else {
                    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('Файл не загружен');
                }
            });
        } else {
            res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Метод не поддерживается');
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Не найдено');
    }
});



server.keepAliveTimeout = keepAliveTimeout;

server.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
