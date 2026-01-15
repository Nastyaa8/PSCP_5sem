const http = require('http');
const { Parser } = require('xml2js');

const server = http.createServer((req, res) => {
    const pathname = req.url;

    if (pathname === '/xml' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const parser = new Parser();
            parser.parseString(body, (err, result) => {
                if (err) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('Ошибка при разборе XML');
                    return;
                }

                const requestId = parseInt(result.request.$.id, 10);
                const xValues = result.request.x.map(x => parseFloat(x.$.value));
                const mValues = result.request.m.map(m => m.$.value);

                const sumX = xValues.reduce((acc, curr) => acc + curr, 0);
                const concatM = mValues.join('');

                const responseXml = `
                <response id="${requestId + 5}" request="${requestId}">
                    <sum element="x" result="${sumX}" />
                    <concat element="m" result="${concatM}" />
                </response>`;

                res.writeHead(200, { 'Content-Type': 'application/xml' });
                res.end(responseXml);
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Метод не поддерживается или неверный путь');
    }
});

server.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});