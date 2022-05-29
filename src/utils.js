const { customAlphabet } = require('nanoid');

const generateBookId = (size = 10) => customAlphabet('0123456789abcdef', 10)(size);

module.exports = {
  generateBookId,
};
