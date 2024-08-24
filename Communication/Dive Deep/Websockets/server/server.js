const http = require('http');
const crypto = require('crypto');
const { Shyaama, Radha } = require('./data/Shyaama');

const handleRoute = function (req, res) {
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'success',
            message: 'Welcome to Websocket Server',
            data: [...Shyaama, ...Radha],
        }));
    }
}

const server = http.createServer(handleRoute);

const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });



wss.on('connection', (ws) => {
    console.log('Client Connected');
});

server.on('upgrade', (request, socket, head) => {
    const acceptKey = request.headers['sec-websocket-key'];
    const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
    const hash = crypto.createHash('sha1').update(acceptKey + GUID).digest('base64');

    const responseHeaders = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: WebSocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${hash}`
    ];

    socket.write(responseHeaders.join('\r\n') + '\r\n\r\n');

    wss.emit('connection', socket, request);
});

server.listen(8000, () => {
    console.log('Server listening on port 8000');
});