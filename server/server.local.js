const { startServer, buildServer } = require('./server');

async function startUp() {
    const server = await buildServer();
    await startServer(server);
};

startUp();
