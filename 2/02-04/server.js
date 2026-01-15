const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const htmlPath = path.join(__dirname, 'xmlhttprequest.html'); 

const server = http.createServer((req, res) => {
 
  if (req.method === 'GET' && req.url === '/xmlhttprequest') {
    fs.readFile(htmlPath, 'utf-8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Файл xmlhttprequest.html не найден');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
      }
    });
  }

 
  else if (req.method === 'GET' && req.url === '/api/name') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Соленок Анастасия Александровна');
  }


  else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Неверный путь');
  }
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/xmlhttprequest`);
});
