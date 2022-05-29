const booksHandler = require('../handlers/books.handler');

const apiPath = '/books';

const booksRoute = [
  {
    method: 'POST',
    path: apiPath,
    handler: booksHandler.addBooksHandler,
  },
  {
    method: 'GET',
    path: apiPath,
    handler: booksHandler.getAllBookHandler,
  },
  {
    method: 'GET',
    path: `${apiPath}/{bookId}`,
    handler: booksHandler.getBookByIdHandler,
  },
  {
    method: 'PUT',
    path: `${apiPath}/{bookId}`,
    handler: booksHandler.updateBookHandler,
  },
  {
    method: 'DELETE',
    path: `${apiPath}/{bookId}`,
    handler: booksHandler.deleteBookByIdHandler,
  },
];

module.exports = booksRoute;
