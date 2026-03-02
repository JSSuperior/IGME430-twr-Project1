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
};

// General purpose response
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

// Returns book info given title and Author
const getByTitleAuthor = (request, response) => {
    // If missing query return bad request
    if (!request.query.title || !request.query.author) {
        return badRequest(request, response);
    }

    // Default to not found
    let responseJSON = {
        id: 'bookNotFound',
        message: `No book with title and author: ${request.query.title},${request.query.author}`
    }
    let statusCode = 404;

    // Look for book with specific title and author and return if found
    const desiredBook = data.find((element) => { return element['title'].replace(/\s/g, '').toLowerCase() === request.query.title.toLowerCase() && element['author'].replace(/\s/g, '').toLowerCase() === request.query.author.toLowerCase(); })
    if (desiredBook) {
        statusCode = 200;
        responseJSON = desiredBook;
    }

    return respond(request, response, statusCode, responseJSON);
};

// Returns books from specified genre
const getByGenre = (request, response) => {
    // If missing query return bad request
    if (!request.query.genre) {
        return badRequest(request, response);
    }

    // Default to not found
    let responseJSON = {
        id: 'bookNotFound',
        message: `No book(s) with genre: ${request.query.genre}`
    }
    let statusCode = 404;

    // Go through data and check if books with a certain genre exist and add them to a list
    const booksWithGenre = data.filter((element) => { if (element['genres']) { return element['genres'].find((genre) => { return genre.replace(/\s/g, '').toLowerCase() === request.query.genre.toLowerCase() }) } });

    // If books with specific genre exist, send the titles
    if (booksWithGenre.length > 0) {
        statusCode = 200;
        responseJSON = { booksWithGenre };
    }

    return respond(request, response, statusCode, responseJSON);
};

// Gets book titles in a range of years
const getByYear = (request, response) => {
    // If missing query return bad request
    if (!request.query.yearMin || !request.query.yearMax) {
        return badRequest(request, response);
    }

    // Default to not found
    let responseJSON = {
        id: 'booksNotFound',
        message: `No book(s) within the time range: ${request.query.yearMin}-${request.query.yearMax}`
    }
    let statusCode = 404;

    // Go through data and check if books within time range exist and add their titles to a list
    let booksWithYear = data.filter((element) => { return element['year'] >= request.query.yearMin && element['year'] <= request.query.yearMax }).map((book) => { return book['title'] });

    // If books within specified time range exist, send the titles
    if (booksWithYear.length > 0) {
        statusCode = 200;
        responseJSON = { booksWithYear };
    }

    return respond(request, response, statusCode, responseJSON);
};

// Gets all entries
const getAllEntries = (request, response) => {
    const responseJSON = { data };
    const statusCode = 200;

    return respond(request, response, statusCode, responseJSON);
};

const addBook = (request, response) => {
    // Needs title, author, year and genres
    const responseJSON = {
        message: 'Title, author, year and genre are required.',
    };
    let statusCode = 400;

    // Missing params
    const { title, author, year, genre } = request.body;
    if (!title || !author || !year || !genre) {
        responseJSON.id = 'addBookMissingParams';
        return respond(request, response, statusCode, responseJSON);
    }
    statusCode = 201;

    // If book exists, update it's info
    const existingBook = data.find((element) => {return element['title'].replace(/\s/g, '').toLowerCase() === title.toLowerCase()});
    if(existingBook) {
        statusCode = 204;
        existingBook['title'] = title;
        existingBook['author'] = author;
        existingBook['year'] = parseInt(year);
        existingBook['genres'] = [genre];
    }

    // If book doesn't exist, create a new entry
    if (statusCode === 201) {
        const newBook = {};

        newBook.title = title;
        newBook.author = author;
        newBook.year = parseInt(year);
        newBook.genres = [genre];

        data.push(newBook);
        updateFile();
        responseJSON.message = 'New Book Entry Created';
        return respond(request, response, statusCode, responseJSON);
    }

    updateFile();
    return respond(request, response, statusCode, {});
}

// Adds a new field to book entries
const addRating = (request, response) => {
    // Needs title and rating out of 5
    const responseJSON = {
        message: 'Name and rating is required.',
    };
    let statusCode = 400;

    // Missing params return early
    const { title, rating } = request.body;
    if (!title || !rating) {
        responseJSON.id = 'addRatingMissingParams';
        return respond(request, response, statusCode, responseJSON);
    }
    statusCode = 404;

    // If book exists, add rating to it
    const existingBook = data.find((element) => {return element['title'].replace(/\s/g, '').toLowerCase() === title.toLowerCase()});
    if(existingBook) {
        statusCode = 204;
        existingBook['rating'] = parseInt(rating);
    }

    // If book doesn't exist, return not found
    if (statusCode === 404) {
        responseJSON.id = 'titleNotFound';
        responseJSON.message = 'Title of book was not found.';
        return respond(request, response, statusCode, responseJSON);
    }

    updateFile();
    return respond(request, response, statusCode, responseJSON);
}

// Page not found
const notFound = (request, response) => {
    const responseJSON = {
        id: 'notFound',
        message: 'The page you are looking for was not found.',
    };
    const statusCode = 404;

    return respond(request, response, statusCode, responseJSON);
};

// General Bad Request
const badRequest = (request, response) => {
    const responseJSON = {};
    const statusCode = 400;

    responseJSON.id = 'badRequest';
    responseJSON.message = 'Missing valid query parameter.';
    return respond(request, response, statusCode, responseJSON);
}

// Write to file for data persistance
// https://nodejs.org/en/learn/manipulating-files/writing-files-with-nodejs
const updateFile = () => {
    const formattedData = JSON.stringify(data);

    try {
        fs.writeFileSync(`${__dirname}/../data/books.json`, formattedData);
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    loadJSON,
    getByTitleAuthor,
    getByGenre,
    getByYear,
    getAllEntries,
    addBook,
    addRating,
    notFound,
};