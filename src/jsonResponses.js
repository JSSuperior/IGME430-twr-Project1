// additional help from
// https://stackoverflow.com/questions/6623231/remove-all-white-spaces-from-text

// Requirements/files
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
    if (request.method !== 'HEAD' || statusCode !== 204) {
        response.write(content);
    }
    response.end();
};

// Gets all book titles written by specific authors

// Returns book info given title
const getByTitle = (request, response) => {
    let responseJSON = {
        id: 'bookNotFound',
        message: ''
    };
    let statusCode = 404;

    // If missing query return bad request
        if (!request.query.title) {
            responseJSON.id = 'badRequest';
            responseJSON.message = 'Missing valid query parameter.';
            statusCode = 400;
            return respond(request, response, statusCode, responseJSON);
        }

    // Go through data and check
    for (let i = 0; i < data.length; i++) {
        if (data[i]['title'].replace(/\s/g, '') === request.query.title) {
            statusCode = 200;
            responseJSON = data[i];
        }
    }

    return respond(request, response, statusCode, responseJSON);
};

// Returns book titles that have specific genre
const getByGenre = (request, response) => {

};


const getLanguage = (request, response) => {

};

// Gets all entries
const getAllEntries = (request, response) => {
    const responseJSON = { data };
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

    return respond(request, response, statusCode, responseJSON);
};

// const verifyQuery = (request, response, ...queries) => {
//     const valid = {};

//     for (let query of queries) {
//         if (!query) {
//             responseJSON.id = 'badRequest';
//             responseJSON.message = 'Missing valid query parameter.';
//             statusCode = 400;
//             return respond(request, response, statusCode, responseJSON);
//         }
//     }

//     for(){
        
//     }

//     return 
// };

module.exports = {
    loadJSON,
    getByTitle,
    getAllEntries,
    notFound,
};