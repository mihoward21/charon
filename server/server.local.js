const { startServer, buildServer } = require('./src/server');

async function startUp() {
    const server = await buildServer();
    await startServer(server);
};

startUp();
