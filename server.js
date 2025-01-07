const http = require ('http');
let times = 1

http.createServer((req, res) => {
    res.writeHead(200, { 
        'Content-Type': 'text/event-stream; charset=UTF-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials': 'true'
    });

    const interval = setInterval(() => {
        res.write("event: message\n");
        res.write("data: " + `测试消息${times},` + "\n\n");
        times++;
    }, 5000);
    
    req.on('close', () => {
        clearInterval(interval);
        console.log('Client disconnected');
    });
}).listen(3003, () => {
    console.log('SSE Server is running on http://localhost:3003');
})
