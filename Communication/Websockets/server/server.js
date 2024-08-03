const http = require('http');
const express = require('express');
const { WebSocket } = require('ws');
const { createClient } = require('redis');
const { v4: uuidv4 } = require('uuid');


const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const redisPublisher = createClient({ url: 'redis://localhost:6379' });
const redisSubscriber = createClient({ url: 'redis://localhost:6379' });
const redisClient = createClient({ url: 'redis://localhost:6379' });

(async () => {
    await redisPublisher.connect();
    await redisSubscriber.connect();
    await redisClient.connect();
})();

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

const rooms_to_userId = {};

const broadcast = (message, channel) => {
    console.log(message);
    rooms[channel].forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client.id !== message.id) {
            client.send(JSON.stringify(message));
        }
    });
};

wss.on('connection', async (socket, request) => {
    const id = uuidv4();
    socket.id = id;
    socket.on('message', async (message) => {
        message = JSON.parse(message.toString('utf-8'));
        if (message.type === 'message') {
            redisPublisher.publish('takeuforward', JSON.stringify({ ...message, id: socket.id }));
        }
        if (message.type === 'join') {
            const room = message.room;
            console.log('you joined the room', room);
            if (!rooms[room]) {
                rooms[room] = [];
                rooms_to_userId[room] = [];
                redisSubscriber.subscribe(room, (message) => {
                    broadcast(JSON.parse(message), room);
                });
            }
            if (!rooms[room].includes(socket)) {
                let check = false;
                rooms[room].push(socket);
                rooms_to_userId[room].push(socket.id);
                redisClient.set(room, Number(await redisClient.get(room)) + 1);
                redisClient.set('total_users', Number(await redisClient.get('total_users')) + 1);
            }
        }
        if (message.type === 'leave') {
            const room = message.room;
            console.log('you leaved the room', room);
            if (rooms[room]) {
                rooms[room] = rooms[room].filter((client) => client !== socket);
                rooms_to_userId[room] = rooms_to_userId[room].filter((id) => id !== socket.id);
                redisClient.set(room, Number(await redisClient.get(room)) - 1);
                redisClient.set('total_users', Number(await redisClient.get('total_users')) - 1);
                if (rooms[room].length === 0) {
                    delete rooms[room];
                    redisSubscriber.unsubscribe(room);
                }
            }
        }
    });
    socket.on('close', async () => {
        Object.entries(rooms_to_userId).forEach(async ([room, ids]) => {
            if (ids.includes(socket.id)) {
                rooms[room] = rooms[room].filter((client) => client !== socket);
                rooms_to_userId[room] = rooms_to_userId[room].filter((id) => id !== socket.id);
                redisClient.set(room, Number(await redisClient.get(room)) - 1);
            }
        })
        redisClient.set('total_users', Number(await redisClient.get('total_users')) - 1);
    });
});

setInterval(() => {
    Object.entries(rooms).forEach(([room, clients]) => {
        clients.forEach(async (client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: "no_of_users", totalUsersInChannel: await redisClient.get(room), totalUsersInApp: await redisClient.get('total_users') }));
            }
        });
    });
}, 5000);

server.listen(80, () => {
    console.log('Server running at 80');
});