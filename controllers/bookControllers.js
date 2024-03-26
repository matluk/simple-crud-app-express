let books = require("../db/books");
const { validateBook, requiredProperties, extraPropertiesCheck } = require("../validators/checkBody");
const { generateSkipValidationObject } = require("../validators/skipValidation");
const { v4: uuidv4 } = require('uuid');

const getAllBooks = (req, res) => {
    res.json({ numberOfItems: books.length, books});
};

const getBookById = (req, res) => {
    const bookId = req.params.id;
    const book = books.find((book) => book.id === bookId);
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }
    res.json({ message: "Book found", book });
};

const createBook = (req, res) => {
    const newBook = req.body;

    if (newBook.id !== undefined || newBook.id === null) {
        return res.status(400).json({ error: "ID cannot be provided in the request body" });
    }

    newBook.id = uuidv4();

    const extraProperties = extraPropertiesCheck(newBook);

    if(extraProperties.length > 0){
        return res.status(400).json({ error: "Extra properties not allowed", details: `The following properties are not allowed: ${extraProperties.join(', ')}`})
    }

    const missingProperties = requiredProperties.filter(prop => !(prop in newBook));
  
    if(missingProperties.length > 0){
      return res.status(400).json({ error: "Missing properties", details:`The following properties are required: ${missingProperties.join(', ')}`})
    }

    const errors = validateBook(newBook);

    if (errors.length > 0) {
        return res
        .status(400)
        .json({ error: "Validation failed", details: errors });
    }

    const responseObject = {
        id: newBook.id,
        ...newBook
    };

    books.push(responseObject);

    res.status(201).json({ message: "Book added successfully", book: responseObject });
};

const putBook = (req, res) => {
    
    let bookId = req.params.id;
    let updatedBook = req.body;

    const bookExists = books.find((book) => book.id === bookId);
    if (!bookExists) {
        return res.status(404).json({ error: "Book doesn't exist" });
    }

    const extraProperties = extraPropertiesCheck(updatedBook);

    if(extraProperties.length > 0){
        return res.status(400).json({ error: "Extra properties not allowed", details: `The following properties are not allowed: ${extraProperties.join(', ')}`})
    }
  
    const missingProperties = requiredProperties.filter(prop => !(prop in updatedBook));
  
    if(missingProperties.length > 0){
      return res.status(400).json({ error: "Missing properties", details:`The following properties are required: ${missingProperties.join(', ')}`})
    }
  
    if('id' in updatedBook && updatedBook.id !== bookId){
      return res.status(400).json({ error: "Invalid id", details: "Cannot change the id of the book"});
    }
  
    const errors = validateBook(updatedBook);
  
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors });
    }
  
    let modifiedBook;
  
    books = books.map((book) => {
      if (book.id === bookId) {
        modifiedBook = {
          ...book,
          ...updatedBook,
        };
        return modifiedBook;
      }
      return book;
    });


    res.status(200).json({ message: "Book updated successfully", modifiedBook });
};

const patchBook = (req, res) => {

    const bookId = req.params.id;
    const updates = req.body;

    const bookExists = books.find((book) => book.id === bookId);
    if (!bookExists) {
        return res.status(404).json({ error: "Book doesn't exist" });
    }

    const extraProperties = extraPropertiesCheck(updates);

    if(extraProperties.length > 0){
        return res.status(400).json({ error: "Extra properties not allowed", details: `The following properties are not allowed: ${extraProperties.join(', ')}`})
    }

    if('id' in updates && updates.id !== bookId){
        return res.status(400).json({ error: "Invalid id", details: "Cannot change the id of the book"});
    }

    const skipValidation = generateSkipValidationObject(updates);
    const errors = validateBook(updates, skipValidation);
    if (errors.length > 0) {
        return res
        .status(400)
        .json({ error: "Validation failed", details: errors });
    }
    let modifiedBook;
    books = books.map((book) => {
        if (book.id === bookId) {
        modifiedBook = {
            ...book,
            ...updates,
        };
        return modifiedBook;
        }
        return book;
    });
    res.status(200).json({ message: "Book updated successfully", modifiedBook });
};

const deleteBook = (req, res) => {

    const bookId = req.params.id;
    const index = books.findIndex((book) => book.id === bookId);
    if (index === -1) {
    return res.status(404).json({ error: "Book not found" });
    }
    books.splice(index, 1);
    res.json({ message: "Book deleted successfully" });
};

const searchBookTitle = (req, res) => {

    const { title } = req.query;

    if(!title){
        return res.status(400).json({ error: "Title parameter is missing"})
    }
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

    if(filteredBooks.length === 0){
        return res.status(404).json({ message: "No books found for the specified title"})
    }

    res.json(filteredBooks);
};

const searchBookAuthor = (req, res) => {

    const { author } = req.query;
    if(!author){
        return res.status(400).json({ error: "Author parameter is missing"})
    }
    const filteredBooks = books.filter(book => book.author.toLowerCase().includes(author.toLowerCase()));

    if(filteredBooks.length === 0){
        return res.status(404).json({ message: "No books found for the specified author"})
    }

    res.json(filteredBooks);
};

const searchBookGenre = (req, res) => {

    const { genre } = req.query;
    if(!genre){
        return res.status(400).json({ error: "Genre parameter is missing"})
    }
    const filteredBooks = books.filter(book => book.genre.toLowerCase().includes(genre.toLowerCase()));

    if(filteredBooks.length === 0){
        return res.status(404).json({ message: "No books found for the specified genre"})
    }

    res.json(filteredBooks);
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  putBook,
  patchBook,
  deleteBook,
  searchBookTitle,
  searchBookAuthor,
  searchBookGenre
};
