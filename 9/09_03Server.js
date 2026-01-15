const http = require('http');

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/process') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            const parsedData = JSON.parse(body);
            const result = `x: ${parsedData.x}, y: ${parsedData.y}, s: ${parsedData.s}`;
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(result);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Страница не найдена');
    }
});

server.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});
