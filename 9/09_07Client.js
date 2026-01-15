const http = require('http');
const fs = require('fs');
const path = 'MyFile.png';

const stats = fs.statSync(path);

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/upload-png',
    method: 'POST',
    headers: {
        'Content-Type': 'multipart/form-data',
        'Content-Length': stats.size
    }
};

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Ответ сервера:', data);
    });
});

fs.createReadStream(path).pipe(req);
