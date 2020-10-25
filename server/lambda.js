const serverless = require('serverless-http');
const { buildServer } = require('./server');

let server;

exports.handler = async (event, context) => {
    if (!server) {
        server = serverless(await buildServer());
    }
    return server(event, context);
}
