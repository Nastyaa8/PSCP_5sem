const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET',
};

const req = http.request(options, (res) => {
    console.log(`Статус ответа: ${res.statusCode}`);
    console.log(`Сообщение к статусу: ${res.statusMessage}`);
    console.log(`IP-адрес удаленного сервера: ${res.socket.remoteAddress}`);
    console.log(`Порт удаленного сервера: ${res.socket.remotePort}`);

    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`Данные: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`Проблема с запросом: ${e.message}`);
});

req.end();
