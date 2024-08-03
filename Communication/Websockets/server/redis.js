const { createClient } = require('redis');

const redisClient1 = createClient({
    url: 'redis://localhost:6379'
});

const redisClient2 = createClient({
    url: 'redis://localhost:6379'
});

redisClient1.on('error', (err) => console.error('Redis Client 1 Error:', err));
redisClient1.on('connect', () => console.log('Redis Client 1 Connected'));
redisClient1.on('ready', async () => {
    console.log('Redis Client 1 Ready');
    await redisClient1.subscribe('message', (message, channel) => {
        console.log('Received message:', message, channel);
    });
});
redisClient1.on('end', () => console.log('Redis Client 1 Disconnected'));

redisClient2.on('error', (err) => console.error('Redis Client 2 Error:', err));
redisClient2.on('connect', () => console.log('Redis Client 2 Connected'));
redisClient2.on('ready', () => {
    console.log('Redis Client 2 Ready');
    setInterval(() => {
        redisClient2.publish('message', 'hello')
            .then((count) => console.log(`Message published to ${count} subscribers`))
            .catch((err) => console.error('Publish Error:', err));
    }, 5000);
});
redisClient2.on('end', () => console.log('Redis Client 2 Disconnected'));

(async () => {
    await redisClient1.connect();
    await redisClient2.connect();
})();
