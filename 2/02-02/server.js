const http= require('http');
const path=require('path');
const fs=require('fs');

const PORT=5000;

const FilePath=path.join(__dirname,'sticker.png');

const server = http.createServer((req, res) => {
    if (req.url === '/png') {
      fs.readFile(FilePath, (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Файл не найден');
        } else {
          res.writeHead(200, { 'Content-Type': 'image/png' });
          res.end(data);
        }
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Неверный путь');
    }
  });

server.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`);
})