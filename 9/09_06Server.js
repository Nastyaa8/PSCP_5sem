const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/upload-txt') {
        const filePath = path.join(__dirname, '.', 'MyNewFile.txt');
        const fileStream = fs.createWriteStream(filePath);

        req.pipe(fileStream);

        req.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Файл успешно загружен' }));
        });
    }
});

server.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});
