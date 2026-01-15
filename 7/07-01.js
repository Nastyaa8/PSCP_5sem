import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url'
import fileHandler from './m07-01.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
const staticDir = path.join(__dirname, 'static');
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/static/')) {
    fileHandler(staticDir)(req, res, () => {});
    return;
  }

  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('405 Method Not Allowed');
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});