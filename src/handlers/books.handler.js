const { generateBookId } = require('../utils');

const booksRepository = require('../repositories/books.repository');

const addBooksHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const result = {
    status: 'error',
    message: 'Buku gagal ditambahkan',
  };

  if (name === undefined) {
    result.status = 'fail';
    result.message = 'Gagal menambahkan buku. Mohon isi nama buku';

    return h.response(result).code(400);
  }

  if (pageCount === undefined || readPage === undefined) {
    return h.response(result).code(500);
  }

  if (pageCount < readPage) {
    result.status = 'fail';
    result.message = 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount';

    return h.response(result).code(400);
  }

  const book = {
    id: generateBookId(),
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: pageCount === readPage,
    reading,
    insertedAt: new Date().toISOString(),
  };
  book.updatedAt = book.insertedAt;

  booksRepository.push(book);

  if (booksRepository.filter((item) => item.id === book.id).length > 0) {
    result.status = 'success';
    result.message = 'Buku berhasil ditambahkan';
    result.data = {
      bookId: book.id,
    };

    return h.response(result).code(201);
  }

  return h.response(result).code(500);
};

const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  const filter = {
    name,
    reading,
    finished,
  };

  if (name !== undefined) {
    filter.name = name.toLowerCase();
  } else {
    delete filter.name;
  }

  if (reading !== undefined) {
    filter.reading = reading === '1';
  } else {
    delete filter.reading;
  }

  if (finished !== undefined) {
    filter.finished = finished === '1';
  } else {
    delete filter.finished;
  }

  const booksFilter = booksRepository.filter((book) => Object.entries(filter).every(([k, v]) => {
    if (k === 'name') {
      return book[k].toLowerCase().includes(v);
    }

    return book[k] === v;
  }));

  const books = booksFilter.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  const result = {
    status: 'success',
    data: {
      books,
    },
  };

  return h.response(result).code(200);
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const result = {
    status: 'fail',
    message: 'Buku tidak ditemukan',
  };

  const book = booksRepository.filter(({ id }) => id === bookId)[0];

  if (book) {
    result.status = 'success';
    result.data = {
      book,
    };
    delete result.message;

    return h.response(result).code(200);
  }

  return h.response(result).code(404);
};

const updateBookHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const result = {
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  };

  const index = booksRepository.findIndex(({ id }) => id === bookId);

  if (index !== -1) {
    if (name === undefined) {
      result.message = 'Gagal memperbarui buku. Mohon isi nama buku';

      return h.response(result).code(400);
    }

    if (pageCount < readPage) {
      result.message = 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount';

      return h.response(result).code(400);
    }

    booksRepository[index] = {
      ...booksRepository[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    result.status = 'success';
    result.message = 'Buku berhasil diperbarui';

    return h.response(result).code(200);
  }

  return h.response(result).code(404);
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const result = {
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  };

  const index = booksRepository.findIndex(({ id }) => id === bookId);

  if (index !== -1) {
    booksRepository.splice(index, 1);

    result.status = 'success';
    result.message = 'Buku berhasil dihapus';

    return h.response(result).code(200);
  }

  return h.response(result).code(404);
};

module.exports = {
  addBooksHandler,
  getAllBookHandler,
  getBookByIdHandler,
  updateBookHandler,
  deleteBookByIdHandler,
};
