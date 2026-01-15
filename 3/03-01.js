var http = require('http');



let state = 'norm';
process.stdin.setEncoding('utf-8');

process.stdout.write(`${state} - `);

process.stdin.on('readable', ()=>{
    let chunk = null;
    while((chunk = process.stdin.read()) != null){
        const input = chunk.trim().toLowerCase();
        if(input == 'exit'){
            console.log('exit')
            process.exit(0);  
        } 
        else if(['norm', 'stop', 'test', 'idle'].includes(input)){
            if(state != input) console.log('состояние поменялось')
            state = input;
            process.stdout.write(input + ' - ');
            
        }else process.stdout.write(input  + '\n' + state + ' - ');
    }
})



http.createServer(function(request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'cache-control': 'no-cache'
    });
    const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>03-01</title>
</head>
<body>
    <h1>${state}</h1>
</body>
</html>
    `;
   


    response.end(html);

}).listen(5000)
