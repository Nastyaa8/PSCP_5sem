const http = require('http');

// Определение XML в виде строки
const xmlData = `
<request id="28">
  <x value="1"/>
  <x value="2"/>
  <m value="a"/>
  <m value="b"/>
  <m value="c"/>
</request>
`;

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/xml',
    method: 'POST',
    headers: {
        'Content-Type': 'application/xml',
        'Content-Length': Buffer.byteLength(xmlData)
    }
};

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Ответ:', data);
    });
});

req.on('error', (error) => {
    console.error(`Ошибка: ${error.message}`);
});

req.write(xmlData);
req.end();