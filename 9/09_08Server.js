const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/download') {
        const filePath = path.join(__dirname, 'MyFile.txt');

        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                res.writeHead(404);
                res.end('Файл не найден');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            fs.createReadStream(filePath).pipe(res);
        });
    }
});

server.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});
