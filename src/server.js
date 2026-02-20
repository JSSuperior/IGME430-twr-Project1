// Requirements
const http = require('http');
const jsonHandler = require('./jsonResponses.js');

// Port 
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// URLs
const urlStruct = {
    notFound: jsonHandler.notFound,
};

// Main request handler
const onRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

    request.acceptedTypes = request.headers.accept.split(',');
    request.query = Object.fromEntries(parsedUrl.searchParams);

    return urlStruct.notFound(request, response);
};

// Sub GET handler
const handleGet = (request, response) => {

};

// Sub POST handler
const handlePost = (request, response) => {

};

// Parses body for POST requests
const parseBody = (request, response, handler) => {
    const body = [];
};

// Starts server
http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1${port}`);
});