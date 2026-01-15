const http = require('http');
const url = require('url');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!doctype html>
      <html>
      <head><meta charset="utf-8"><title>01-03</title></head>
      <body>
        <h1>Информация о запросе</h1>
        <p><b>Метод:</b> ${req.method}</p>
        <p><b>URI:</b> ${req.url}</p>
        <p><b>Путь:</b> ${parsedUrl.pathname}</p>
        <p><b>Query:</b> ${JSON.stringify(parsedUrl.query)}</p>
        <h2>Заголовки:</h2>
        <pre>${JSON.stringify(req.headers, null, 2)}</pre>
        <h2>Тело запроса:</h2>
        <pre>${body}</pre>
      </body>
      </html>
    `);
  });
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
