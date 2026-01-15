const url = require('url');
const error = require('./server_error_handler')();
const DB = require('../database/db_module')();

function Post_Handler(req, res) {
    let json = '';
    let pathName = url.parse(req.url, true).pathname;
    console.log('\nPOST:\t ' + pathName);

    switch (pathName) {
        case '/api/faculties': {
            req.on('data', chunk => { json += chunk; });
            req.on('end', () => {
                try {
                    json = JSON.parse(json);
                    DB.insertFaculty(json)
                        .then(records => { 
                            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                            res.end(JSON.stringify(records, null, 4)); 
                        })
                        .catch(err => { error.handler(res, 413, err.message); });
                } catch (err) {
                    error.handler(res, 400, 'Invalid JSON format');
                }
            });
            break;
        }

        case '/api/pulpits': {
            req.on('data', chunk => { json += chunk; });
            req.on('end', () => {
                try {
                    json = JSON.parse(json);
                    DB.insertPulpit(json)
                        .then(records => { 
                            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                            res.end(JSON.stringify(records, null, 4)); 
                        })
                        .catch(err => { error.handler(res, 414, err.message); });
                } catch (err) {
                    error.handler(res, 400, 'Invalid JSON format');
                }
            });
            break;
        }

        case '/transaction': {
            const transactionOptions = {
                readConcern: { level: 'local' },
                writeConcern: { w: 'majority' }
            }
            req.on('data', chunk => { json += chunk; });
            req.on('end', () => {
                try {
                    json = JSON.parse(json);
                    DB.insertPulpits(json, transactionOptions)
                        .then(records => { 
                            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                            res.end(JSON.stringify(records, null, 4)); 
                        })
                        .catch(err => { error.handler(res, 421, err.message); });
                } catch (err) {
                    error.handler(res, 400, 'Invalid JSON format');
                }
            });
            break;
        }

        default: error.handler(res, 410, 'Incorrect URL'); break;
    }
}

module.exports = (req, res) => new Post_Handler(req, res);