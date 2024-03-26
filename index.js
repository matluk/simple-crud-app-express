const express = require("express");
const booksRoutes = require("./routes/booksRoutes");
const notFound = require("./routes/not-found")

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/books", booksRoutes);

app.use(notFound);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
