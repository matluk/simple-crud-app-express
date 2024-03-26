function generateSkipValidationObject(body) {
  const skipValidation = {};

  if (!body.title) skipValidation.title = true;
  if (!body.author) skipValidation.author = true;
  if (!body.isbn) skipValidation.isbn = true;
  if (!body.year) skipValidation.year = true;
  if (!body.price) skipValidation.price = true;
  if (!body.genre) skipValidation.genre = true;

  return skipValidation;
}

module.exports = { generateSkipValidationObject };
