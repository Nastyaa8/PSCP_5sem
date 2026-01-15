const http = require('http');
const fs = require('fs');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/download',
    method: 'GET'
};

const req = http.request(options, (res) => {
    const filePath = 'downloaded_file.txt';
    const fileStream = fs.createWriteStream(filePath);

    res.pipe(fileStream);

    fileStream.on('finish', () => {
        console.log('Файл успешно загружен и сохранен.');
    });
});

req.end();
