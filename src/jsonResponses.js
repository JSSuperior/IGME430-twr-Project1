const fs = require('fs');
const initialData = fs.readFileSync(`${__dirname}/../data/books.json`);

// I wonder if I can just straight up stick the loading in the file here
// or if i need to make a method for it and then call it in server.js
// could also be that I can directly read and access initialData
// need to test also im probably too tired to think straight

// Gonna load in data to start, might change later
const data = {};

const respond = (request, response, statusCode, object) => {
    const content = JSON.stringify(object);

    // Write head
    response.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    });

    // If not head or 204 send back body
    if(request.method !== 'HEAD' || statusCode !== 204)
    {
        response.write(content);
    }
    response.end();
};



// Page not found
const notFound = (request, response) => {
    const responseJSON = {
        id: 'notFound',
        message: 'The page you are looking for was not found.',
    };
    const statusCode = 404;
    
    respond(request, response, statusCode, responseJSON);
};

module.exports = {
    notFound,
};