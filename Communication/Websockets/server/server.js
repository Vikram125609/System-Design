const http = require('http');
const express = require('express');
const { WebSocket } = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const middleware = (req, res, next) => {
    next();
};

app.get('/without-middleware', (req, res) => {
    res.json({ message: "This is the not using middleware" });
});
app.use(middleware);
app.get('/with-middleware', (req, res) => {
    res.json({ message: "This is using middleware" });
})

wss.on('connection', (socket, request) => {
    socket.on('message', (message) => {
        console.log(message);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && client !== socket) {
                client.send(message);
            }
        });
    });
});
server.listen(3000, () => {
    console.log('Server running at 3000');
});