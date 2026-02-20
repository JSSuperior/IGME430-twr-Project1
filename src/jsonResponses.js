const fs = require('fs');
const initialData = fs.readFileSync(`${__dirname}/../data/books.json`);

// Local storage of json data
let data;

// Loads json data into local memory
const loadJSON = () => {
    data = JSON.parse(initialData);
    //console.log(data);
    //console.log(data[0]);
};

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

const getAuthor = (request, response) => {
    const responseJSON = {};
    let statusCode = 200;

    // double check if the second query is needed
    if(!request.query.title || request.query.title === null) {
        responseJSON.id = 'badRequest';
        responseJSON.message = 'Missing valid query parameter.';
        statusCode = 400;
        return respond(request, response, statusCode, responseJSON);
    }

    // need to search for proper entry
    //responseJSON.message = 
        
};

// Gets all entries
const getAllEntries = () => {
    const responseJSON = {data};
    const statusCode = 200;

    return respond(request, response, statusCode, responseJSON);
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
    loadJSON,
    getAllEntries,
    notFound,
};