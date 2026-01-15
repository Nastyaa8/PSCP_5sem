const http = require('http');

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/json') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            const parsedData = JSON.parse(body);
            const x_plus_y = parsedData.x + parsedData.y;
            const Concatenation_s_o = `Сообщение: ${parsedData.o.surname}, ${parsedData.o.name}`;
            const Length_m = parsedData.w.length;

            const response = JSON.stringify({
                __comment: "Ответ. Лабораторная работа 8/10",
                x_plus_y,
                Concatenation_s_o,
                Length_m
            });

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(response);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Страница не найдена');
    }
});

server.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});