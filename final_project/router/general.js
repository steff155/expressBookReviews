const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(400).json({ message: "User already exists!" });
    }
  }
  return res
    .status(400)
    .json({ message: "Username and password are required" });
});
// Get the book list available in the shop
// Task 10 - Get all books (async/await)
public_users.get("/", async (req, res) => {
  try {
    const allBooks = await new Promise((resolve, reject) => {
      resolve(books);
    });
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11 - Get book details based on ISBN (async/await)
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = await new Promise((resolve, reject) => {
      if (books[isbn]) resolve(books[isbn]);
      else reject("Book not found");
    });
    return res.status(200).json(book);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Task 12 - Get book details based on author (async/await)
public_users.get("/author/:author", async (req, res) => {
  try {
    const author = req.params.author;
    const booksByAuthor = await new Promise((resolve, reject) => {
      let result = [];
      for (let isbn in books) {
        if (books[isbn].author === author) {
          result.push(books[isbn]);
        }
      }
      if (result.length > 0) resolve(result);
      else reject("No books found for this author");
    });
    return res.status(200).json(booksByAuthor);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Task 13 - Get book details based on title (async/await)
public_users.get("/title/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const booksByTitle = await new Promise((resolve, reject) => {
      let result = [];
      for (let isbn in books) {
        if (books[isbn].title === title) {
          result.push(books[isbn]);
        }
      }
      if (result.length > 0) resolve(result);
      else reject("No books found with this title");
    });
    return res.status(200).json(booksByTitle);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

module.exports.general = public_users;
