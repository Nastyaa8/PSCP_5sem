var http = require('http');
var fs = require('fs');
var url = require('url');

let fact = (n) => {
    if (n == 0 || n == 1) return 1;
    return (n * fact(n - 1));
}
function Fact(n, cb) {
    this.fn = n;          
    this.ffact = fact;    
    this.fcb = cb;        
    
    this.calc = () => {
        setImmediate(() => {
            this.fcb(null, this.ffact(this.fn));
        });
    };
}
console.log(fact(5))

http.createServer(function(request, response) {
    if(url.parse(request.url).pathname === '/fact'){
            let k = parseInt(url.parse(request.url, true).query.k);
            if (Number.isInteger(k)) {
                response.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                let factResult = new Fact(k, (err, res) =>{
                    response.end(JSON.stringify({
                        k:k,
                        fact: res
                    }))
                })
                factResult.calc();
    
            }
    } else if(url.parse(request.url).pathname === '/'){

        response.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        });
        const html = fs.readFileSync('./FactorialSteps.html');
        response.end(html)
    }
}).listen(5000)
