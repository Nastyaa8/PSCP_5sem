const url = require('url');
const error = require('./server_error_handler')();
const DB = require('../database/db_module')();

function Put_Handler(req, res) {
    let json = '';
    let pathName = url.parse(req.url, true).pathname;
    console.log('\nPUT:\t ' + pathName);

    switch (pathName) {
        case '/api/faculties': {
            req.on('data', chunk => { json += chunk; });
            req.on('end', () => {
                try {
                    json = JSON.parse(json);
                    DB.updateFaculty(json, json.faculty_name)
                        .then(records => {
                            if (records.value) {
                                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                                res.end(JSON.stringify(records.value, null, 4));
                            } else {
                                error.handler(res, 404, 'Faculty not found');
                            }
                        })
                        .catch(err => error.handler(res, 415, err));
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
                    DB.updatePulpit(json, json.pulpit_name, json.faculty)
                        .then(records => {
                            if (records.value) {
                                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                                res.end(JSON.stringify(records.value, null, 4));
                            } else {
                                error.handler(res, 404, 'Pulpit not found');
                            }
                        })
                        .catch(err => error.handler(res, 416, err));
                } catch (err) {
                    error.handler(res, 400, 'Invalid JSON format');
                }
            });
            break;
        }

        default: 
            error.handler(res, 410, 'Incorrect URL'); 
            break;
    }
}

module.exports = (req, res) => new Put_Handler(req, res);