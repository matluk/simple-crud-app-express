const express = require("express");
let router = express.Router();

const {
  getAllBooks,
  getBookById,
  createBook,
  putBook,
  patchBook,
  deleteBook,
  searchBookTitle,
  searchBookAuthor,
  searchBookGenre
} = require("../controllers/bookControllers");


router.route("/").get(getAllBooks).post(createBook);

router
  .route("/:id")
  .get(getBookById)
  .put(putBook)
  .patch(patchBook)
  .delete(deleteBook);

router.get("/search/title", searchBookTitle);
router.get("/search/author", searchBookAuthor);
router.get("/search/genre", searchBookGenre);


module.exports = router;