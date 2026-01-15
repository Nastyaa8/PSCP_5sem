var http = require('http');
var url = require('url');

let fact = (n) =>{
    if(n == 0 || n == 1){
        return 1;
    }
    return (n * fact(n - 1))
}
console.log(fact(5))

http.createServer(function(request, response) {
    if(url.parse(request.url).pathname === '/fact'){
        let k = parseInt(url.parse(request.url, true).query.k);
        if (Number.isInteger(k)) {
            response.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            response.end(JSON.stringify({
                k:k,
                fact: fact(k)
            }))

        }
    }
    
}).listen(5000)
