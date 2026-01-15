const http = require('http');

const data = JSON.stringify({
    __comment: "Запрос. Лабораторная работа 8/10",
    x: 1,
    y: 2,
    s: "Сообщение",
    w: ["a","b","c","d"],
    o: {
        surname: "Иванов",
        name: "Иван"
    }
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/json',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
    },
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

req.write(data);
req.end();