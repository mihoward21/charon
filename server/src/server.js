const express = require('express');
const cors = require('cors');
const fs = require('fs');

const datasets = require('./datasets');

async function startServer(server) {
    const port = parseInt(process.env.port, 10) || 8080;

    server.listen(port, () => {
      console.log(`Listening at ${port}`)
    });
}

async function buildServer() {
    const app = express();

    app.use(cors());

    const rawData = fs.readFileSync('data.json');
    const data = JSON.parse(rawData);

    app.get('/api/data/:location/:ageGroup?', (req, res) => {
        const location = req.params.location;
        const ageGroup = req.params.ageGroup;

        const filteredData = datasets.getFilteredDataObj(data, location, ageGroup);
        res.json(filteredData);
    });

    return app
};

module.exports = { startServer, buildServer };
