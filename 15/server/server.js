const http = require('http');
const get_handler = require('./get_handler');
const post_handler = require('./post_handler');
const put_handler = require('./put_handler');
const delete_handler = require('./delete_handler');
const error = require('./server_error_handler')();
let server = http.createServer();


process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
   
});

let http_handler = (req, res) => {
    try {
        switch (req.method) {
            case 'GET':     get_handler(req, res);      break;
            case 'POST':    post_handler(req, res);     break;
            case 'PUT':     put_handler(req, res);      break;
            case 'DELETE':  delete_handler(req, res);   break;
            default:        error.handler(res, 409, 'Incorrect request method.'); break;
        }
    } catch (err) {
        console.error('Error in request handler:', err);
        error.handler(res, 500, 'Internal Server Error: ' + err.message);
    }
}

server.listen(5000, () => { console.log('\n[INFO] Server running at localhost:5000/\n'); })
    .on('error', error => { console.log('\n[ERROR] ', error.message); })
    .on('request', http_handler);