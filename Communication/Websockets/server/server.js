const http = require('http');
const express = require('express');
const { WebSocket } = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const middleware = (req, res, next) => {
    next();
};

app.use(express.json());
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})
app.get('/without-middleware', (req, res) => {
    res.json({ message: "This is the not using middleware" });
});
app.use(middleware);
app.get('/with-middleware', (req, res) => {
    res.json({ message: "This is using middleware" });
})

const rooms = {};

wss.on('connection', (socket, request) => {
    socket.on('message', (message) => {
        message = JSON.parse(message.toString('utf-8'));
        if (message.type === 'message') {
            if (rooms[message.room]) {
                rooms[message.room].forEach((client) => {
                    if (client.readyState === WebSocket.OPEN && client !== socket) {
                        client.send(JSON.stringify(message));
                    }
                });
            }
        }
        if (message.type === 'join') {
            const room = message.room;
            if (!rooms[room]) {
                rooms[room] = [];
            }
            if (!rooms[room].includes(socket)) {
                rooms[room].push(socket);
            }
        }
        if (message.type === 'leave') {
            const room = message.room;
            if (rooms[room]) {
                rooms[room] = rooms[room].filter((client) => client !== socket);
                if (rooms[room].length === 0) {
                    delete rooms[room];
                }
            }
        }
    });
    socket.on('close', () => { 
        console.log('client disconnected');
    });
});

setInterval(() => {
    let totalUsersInApp = 0;
    Object.entries(rooms).forEach(([room, clients]) => {
        totalUsersInApp += clients.length;
    })
    Object.entries(rooms).forEach(([room, clients]) => {
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: "no_of_users", totalUsersInChannel: clients.length, totalUsersInApp: totalUsersInApp }));
            }
        });
    });
}, 5000);

server.listen(80, () => {
    console.log('Server running at 80');
});