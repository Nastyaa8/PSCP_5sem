const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    const queryObject = url.parse(req.url, true).query;

    if (req.method === 'GET' && req.url.startsWith('/sum')) {
        const x = parseInt(queryObject.x, 10);
        const y = parseInt(queryObject.y, 10);
        const sum = x + y;

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Сумма: ${sum}`);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Страница не найдена');
    }
});

server.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});
