const http=require('http');
const fs=require('fs');
const path=require('path');

const PORT=5000;
const FilePath=path.join(__dirname,'index.html')
const server=http.createServer((req,res)=>{
if(req.url=="/html"){
fs.readFile(FilePath,'utf-8',(err,data)=>{
    if(err){
        res.writeHead(404,{'content-type':'text/plain; charset=utf-8'});
        res.end('файл не найден')
    }
    else{
        res.writeHead(200,{'Content-type':'text/html'});
        res.end(data)
    }
})
}else{
    res.writeHead(404,{'content-type':'text/plain; charset=utf-8'});
    res.end('неверный путь')
}
});

server.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})