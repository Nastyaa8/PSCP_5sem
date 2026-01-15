const http=require('http');
const path=require('path');
const fs=require('fs');

const PORT=5000;

const server=http.createServer((req,res)=>{
    if(req.method=='GET'&&req.url=='/api/name'){
        res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8'});
        res.end('Соленок Анастасия Александровна');
    }else{
        res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});
        res.end('Ошибка')
    }
})

server.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`);
});