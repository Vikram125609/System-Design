const cluster = require('cluster');
const os = require('os');
const server = require('./server');

const port = 80;

if (cluster.isMaster) {
    const numCPUs = os.cpus().length - 5;
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    server.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}