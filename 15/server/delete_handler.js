const url = require('url');
const error = require('./server_error_handler')();
const DB = require('../database/db_module')();



function Delete_Handler(req, res) {

    let pathName = decodeURI(url.parse(req.url).pathname);
    let pathParameters = pathName.split('/');
    let collectionName = pathParameters[2];
    let xyzParameter = pathParameters[3];
    console.log('\nDELETE:\t ' + pathName);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });


    switch ('/api/' + collectionName) {

        case '/api/faculties': {
            DB.deleteFaculty(xyzParameter)
                .then(records => res.end(JSON.stringify(records, null, 4)))
                .catch(err => { error.handler(res, 417, err.message); });
            break;
        }


        case '/api/pulpits': {
            DB.deletePulpit(xyzParameter)
                .then(records => res.end(JSON.stringify(records, null, 4)))
                .catch(err => { error.handler(res, 418, err.message); });
            break;
        }


        default: error.handler(res, 410, 'Incorrect URL'); break;
    }
}



module.exports = (req, res) => new Delete_Handler(req, res);