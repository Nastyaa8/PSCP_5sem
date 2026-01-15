const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;

const server = http.createServer((req, res) => {
  if (req.url === '/jquery') {

    const filePath = path.join(__dirname, 'jquery.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Ошибка чтения файла');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
      }
    });
  }
  else if (req.url === '/api/name') {
   
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Соленок Анастасия Александровна');
  }
  else {
   
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });}
  })

  server.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
  })