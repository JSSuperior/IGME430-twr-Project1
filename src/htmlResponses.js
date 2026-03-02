// Requirements/files
const fs = require('fs');
const client = fs.readFileSync(`${__dirname}/../client/client.html`);
const documentation = fs.readFileSync(`${__dirname}/../client/documentation.html`);

// General response
const respond = (request, response, type, file) => {
    response.writeHead(200, { 'Content-Type': type });
    response.write(file);
    response.end();
}

// Return client page
const getClient = (request, response) => {
    respond(request, response, 'text/html', client);
};

// Return client page
const getDocumentation = (request, response) => {
    respond(request, response, 'text/html', documentation);
};

module.exports = {
    getClient,
    getDocumentation,
};