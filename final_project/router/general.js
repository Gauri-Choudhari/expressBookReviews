const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;


  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
//   const booksList = JSON.stringify(books, null, 2);
//   return res.status(200).send(`List of books available: \n${booksList}`);

try {
    const response = await axios.get('https://api.example.com/books');
    const booksList = JSON.stringify(response.data, null, 2);
    res.status(200).send(`List of books available: \n${booksList}`);
  } catch (error) {
    res.status(500).send('Error fetching the book list');
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {

  let isbn = req.params.isbn;
//   let book = books[isbn];
//   if (book) {
//     res.send(book);
//   } else {
//     res.send(`No book found for ISBN ${isbn}`);}
  try {
    const response = await axios.get(`https://api.example.com/books/${isbn}`); // Replace with actual API URL
    res.status(200).send(response.data);
  } catch (error) {
    res.status(404).send(`No book found for ISBN ${isbn}`);
  }

});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const response = await axios.get(`https://api.example.com/books?author=${author}`); // Replace with actual API URL
        const booksByAuthor = response.data;
        if (booksByAuthor.length === 0) {
          return res.status(404).json({ message: "Author not found" });
        }
        res.status(200).send({ booksByAuthor });
      } catch (error) {
        res.status(500).send('Error fetching books by author');
      }

      
    // let ans = []
    // for(const [key, values] of Object.entries(books)){
    //     const book = Object.entries(values);
    //     for(let i = 0; i < book.length ; i++){
    //         if(book[i][0] == 'author' && book[i][1] == req.params.author){
    //             ans.push(books[key]);
    //         }
    //     }
    // }
    // if(ans.length == 0){
    //     return res.status(300).json({message: "Author not found"});
    // }
    // res.send({"booksByAuthor" : ans});
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    let title = req.params.title;
    try {
      const response = await axios.get(`https://api.example.com/books?title=${title}`);
      const booksByTitle = response.data;
      if (booksByTitle.length === 0) {
        return res.status(404).json({ message: "Title not found" });
      }
      res.status(200).send({ booksByTitle });
    } catch (error) {
      res.status(500).send('Error fetching books by title');
    }

    // let ans = []
    // for(const [key, values] of Object.entries(books)){
    //     const book = Object.entries(values);
    //     for(let i = 0; i < book.length ; i++){
    //         if(book[i][0] == 'title' && book[i][1] == req.params.title){
    //             ans.push(books[key]);
    //         }
    //     }
    // }
    // if(ans.length == 0){
    //     return res.status(300).json({message: "Title not found"});
    // }
    // res.send({"booksByTitle" : ans});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
