// additional help from
// https://stackoverflow.com/questions/6623231/remove-all-white-spaces-from-text
// Need to refactor code later, right now focusing on functionality
// I'll probably 

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

    // Go through data and check if a book with a certain title
    for (let book of data) {
        if (book['title'].replace(/\s/g, '').toLowerCase() === request.query.title
            && book['author'].replace(/\s/g, '').toLowerCase() === request.query.author) {
            statusCode = 200;
            responseJSON = book;
        }
    }

    // for (let i = 0; i < data.length; i++) {
    //     if (data[i]['title'].replace(/\s/g, '') === request.query.title && data[i]['author'].replace(/\s/g, '') === request.query.author) {
    //         statusCode = 200;
    //         responseJSON = data[i];
    //     }
    // }

    return respond(request, response, statusCode, responseJSON);
};

// 
// Returns book titles that have specific genre
// later on, might change to search for multiple at a time
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

    // http://127.0.0.1:3000/getByGenre?genre=Modernism
    // Go through data and check if books with a certain genre exist and add them to a lsit
    let booksWithGenre = [];
    for (let book of data) {
        if (book['genres']) {
            for (let genre of book['genres']) {
                if (genre.replace(/\s/g, '').toLowerCase() === request.query.genre) {
                    let bookStruct = {};

                    bookStruct.title = book['title'];
                    bookStruct.author = book['author'];
                    bookStruct.link = book['link'];

                    booksWithGenre.push(bookStruct);
                }
            }
        }
    }



    // for (let i = 0; i < data.length; i++) {
    //     if (data[i]['genres']) {
    //         for (let j = 0; j < data[i]['genres'].length; j++) {
    //             //console.log(data[i]['genres'][j].replace(/\s/g, ''));
    //             if (data[i]['genres'][j].replace(/\s/g, '') === request.query.genre) {
    //                 let bookStruct = {};

    //                 bookStruct.title = data[i]['title'];
    //                 bookStruct.author = data[i]['author'];
    //                 bookStruct.link = data[i]['link'];

    //                 booksWithGenre.push(bookStruct);
    //             }
    //         }
    //     }
    // }

    // If books with specific genre exist, send the titles
    if (booksWithGenre.length > 0) {
        statusCode = 200;
        responseJSON = { booksWithGenre };
    }

    return respond(request, response, statusCode, responseJSON);
};

// http://127.0.0.1:3000/getByYear?yearMin=1700&yearMax=2000
// Gets books in a range of years
const getByYear = (request, response) => {
    // If missing query return bad request
    if (!request.query.yearMin || !request.query.yearMax) {
        return badRequest(request, response);
    }

    // Default to not found
    let responseJSON = {
        id: 'booksNotFound',
        message: `No book(s) within the time range: ${request.query.yearmin}-${request.query.yearMax}`
    }
    let statusCode = 404;

    // Go through data and check if books with a certain genre exist and add them to a lsit
    let booksWithYear = [];

    for (let book of data) {
        if (book['year'] >= request.query.yearMin
            && book['year'] <= request.query.yearMax) {
            booksWithYear.push(book['title']);
        }
    }

    // for (let i = 0; i < data.length; i++) {
    //     //console.log(data[i]['genres'][j].replace(/\s/g, ''));
    //     if (data[i]['year'] >= request.query.yearMin && data[i]['year'] <= request.query.yearMax) {
    //         booksWithYear.push(data[i]['title']);
    //     }
    // }

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
    // needs title, author, year and genres
    const responseJSON = {
        message: 'Title, author, year and genres are required.',
    };
    let statusCode = 400;

    const { title, author, year, genres } = request.body;
    if (!title || !author || !year || !genres) {
        responseJSON.id = 'addBookMissingParams';
        return respond(request, response, statusCode, responseJSON);
    }

    statusCode = 201;
    // im sure that there is a better ay to search, need to do more research
    for (let book of data) {
        if (book['title'].replace(/\s/g, '').toLowerCase() === title.replace(/\s/g, '').toLowerCase()) {
            statusCode = 204;
            book['title'] = title;
            book['author'] = author;
            book['year'] = year;
            book['genres'] = genres;
        }
    }

    // for (let i = 0; i < data.length; i++) {
    //     if (data[i]['title'].replace(/\s/g, '').toLowerCase === title.replace(/\s/g, '').toLowerCase()) {
    //         statusCode = 204;
    //         data[i]['title'] = title;
    //         data[i]['author'] = author;
    //         data[i]['year'] = year;
    //         data[i]['genres'] = genres;
    //     }
    // }

    if (statusCode === 201) {
        const newBook = {};

        newBook.title = title;
        newBook.author = author;
        newBook.year = year;
        newBook.genres = genres;

        data.push(newBook);
        responseJSON.message = 'New Book Entry Created';
        return respond(request, response, statusCode, responseJSON);
    }
    return respond(request, response, statusCode, {});
}

// Adds a new field to book entries
const addRating = (request, response) => {
    // needs rating out of 5
    const responseJSON = {
        message: 'Name and rating is required.',
    };
    let statusCode = 400;

    const { title, rating } = request.body;
    if (!title || !rating) {
        responseJSON.id = 'addRatingMissingParams';
        return respond(request, response, statusCode, responseJSON);
    }

    statusCode = 404;
    for (let i = 0; i < data.length; i++) {
        if (data[i]['title'].replace(/\s/g, '').toLowerCase === title.replace(/\s/g, '').toLowerCase()) {
            statusCode = 204;
            data[i]['rating'] = rating;
        }
    }

    if (statusCode === 404) {
        responseJSON.id = 'titleNotFound';
        responseJSON.message = 'Title of book was not found.';
        return respond(request, response, statusCode, responseJSON);
    }
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

const badRequest = (request, response) => {
    const responseJSON = {};
    const statusCode = 400;

    responseJSON.id = 'badRequest';
    responseJSON.message = 'Missing valid query parameter.';
    return respond(request, response, statusCode, responseJSON);
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