import fs from 'fs'
import path from 'path'
import mime from 'mime'

export default (staticDir) => {
    return (req, res, next) => {
        const urlPath = req.url.replace('/static/','');
        const filePath = path.join(staticDir, urlPath);

        const mimeType = mime.getType(filePath);

        if(mimeType){
            fs.readFile(filePath, (err,data) => {
                if(err) {
                    res.writeHead(404, { 'Content-Type': 'text/plain'});
                    res.end('404 File not found');
                } else {
                    res.writeHead(200, {'Content-Type': mimeType});
                    res.end(data);
                }
            });
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain'})
            res.end('404 Unsupported file type')
        }
    }
}