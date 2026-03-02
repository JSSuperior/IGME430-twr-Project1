// Requirements/files
const http = require('http');
const query = require('querystring');
const jsonHandler = require('./jsonResponses.js');
const htmlHandler = require('./htmlResponses.js');

// Port 
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// URLs
// need to find better names based on what they return
const urlStruct = {
    '/': htmlHandler.getClient,
    '/style.css': htmlHandler.getCSS,
    '/getByTitleAuthor': jsonHandler.getByTitleAuthor,
    '/getByGenre': jsonHandler.getByGenre,
    '/getByYear': jsonHandler.getByYear,
    '/getAllEntries': jsonHandler.getAllEntries,
    '/addBook': jsonHandler.addBook,
    '/addRating': jsonHandler.addRating,
    notFound: jsonHandler.notFound,
};

// Main request handler
const onRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

    // Split queries and accepted types
    //request.acceptedTypes = request.headers.accept.split(',');
    request.query = Object.fromEntries(parsedUrl.searchParams);

    // Url request logic, might be kinda funky but hopefully refined from assignment 2
    if (urlStruct[parsedUrl.pathname]) {
        if (request.method === 'POST') {
            return parseBody(request, response, urlStruct[parsedUrl.pathname]);
        } else if (request.method === 'GET' || request.method === 'HEAD') {
            return urlStruct[parsedUrl.pathname](request, response);
        } 
    }
    return urlStruct.notFound(request, response);
};

// Parses body for POST requests
const parseBody = (request, response, handler) => {
    // Code from body-parse demo
    // https://github.com/IGM-RichMedia-at-RIT/body-parse-example-done/blob/master/src/server.js
    const body = [];

    // If error, respond early
    request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
    });

    // On recieve data add it to array
    request.on('data', (chunk) => {
        body.push(chunk);
    });

    // Once all packets recieved handle data
    request.on('end', () => {
        console.log(body);

        const bodyString = Buffer.concat(body).toString();
        const type = request.headers['content-type'];

        // Handle application type and parse body accordingly
        if (type === 'application/x-www-form-urlencoded') {
            request.body = query.parse(bodyString);
        } else if (type === 'application/json') {
            request.body = JSON.parse(bodyString);
        } else {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify({ error: 'invalid data format' }));
            return response.end();
        }

        handler(request, response);
    });
};

// Starts server
http.createServer(onRequest).listen(port, () => {
    jsonHandler.loadJSON();
    console.log(`Listening on 127.0.0.1${port}`);
});