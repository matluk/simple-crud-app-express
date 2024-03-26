function validateBook(book, skipValidation = {}) {
  const errors = [];

  if (!skipValidation.title && (!book.title || book.title.length < 2)) {
    errors.push("Title must be at least 2 characters long");
  }
  if (!skipValidation.author && (!book.author || book.author.length < 2)) {
    errors.push("Author must be at least 2 characters long");
  }
  if (!skipValidation.isbn && !book.isbn) {
    errors.push("ISBN is required");
  }
  const isbnRegex = /^ISBN \d{3}-\d{10}$/;
  if (!skipValidation.isbn && !isbnRegex.test(book.isbn)) {
    errors.push("Invalid ISBN format");
  }
  if (!skipValidation.year && (!(typeof book.year !== 'undefined' && book.year !== null) || !/^(0|\d{1,4})$/.test(book.year))) {
    errors.push("Invalid year format");
  }
  if (!skipValidation.price && (isNaN(book.price) || parseFloat(book.price) <= 0)) {
    errors.push("Price must be a number greater or equal than 0");
  }
  if (!skipValidation.genre && (!book.genre || book.genre.length < 2)) {
    errors.push("Genre must be at least 2 characters long");
  }

  return errors;
}

const requiredProperties = [
    "id",
    "title",
    "author",
    "isbn",
    "year",
    "price",
    "genre",
  ];

const extraPropertiesCheck = (Book) => {
  return Object.keys(Book).filter(prop => !requiredProperties.includes(prop))
}

module.exports = {
  validateBook,
  requiredProperties,
  extraPropertiesCheck
};
