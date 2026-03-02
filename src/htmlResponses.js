// Requirements/files
const fs = require('fs');
const client = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// Return client page
const getClient = (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(client);
    response.end();
};

// Return css stylesheet
const getCSS = (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/css' });
    response.write(css);
    response.end();
};

module.exports = {
    getClient,
    getCSS,
};