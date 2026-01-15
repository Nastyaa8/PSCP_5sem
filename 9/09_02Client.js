const http = require('http');

const x = 5;
const y = 10;

const options = {
    hostname: 'localhost',
    port: 3000,
    path: `/sum?x=${x}&y=${y}`,
    method: 'GET',
};

const req = http.request(options, (res) => {
    console.log(`Статус ответа: ${res.statusCode}`);

    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`Данные: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`Проблема с запросом: ${e.message}`);
});

req.end();
