// Route handler module
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const sanitizeHtml = require('sanitize-html');
const Book = require('../models').models.Book;
const {Op} = require('sequelize');
/* Handler function to wrap each route which does async requests to the db.
Catches any errors and forwards them to the error handler. With high regards to teamtreehouse.com where the
idea for this functionand in parts the code were part of a lecture.*/
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      const err =  createError(500, "Oops! There was an unexpected error on the server")
      next(err)
    }
  }
}

// GET home page, redirecting to the books route where the main action is
router.get('/', function(req, res) {
  res.redirect('/books');
});
/*This route is used for displaying a list of books based on the users query input, defaulting to show every entry found in the librabry.db.
The number of entries shown is based on the users selection which gets stored in the const itemsPerPage.
If more entries are returned from the request, additional pagination buttons are  being rendered so the user can navigate through the list of entries.*/
router.get('/books', asyncHandler(async function(req, res) {
    let noOfPages = 0;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    const currentPage = parseInt(req.query.currentPage) || 1;
    const offset = (currentPage-1)*itemsPerPage;
    const userInput= req.query.searchTerm || "";
    // sanitizeHtml is used on the user inout to prevent that malicious scripts are executed
    const query=  sanitizeHtml(userInput, {allowedTags: [], allowedAttributes: {}}).toLowerCase();
    // Right now, Sequelize will match all fields against the users query and return all partial matches
    const bookList = await Book.findAndCountAll (
      { where:
        { [Op.or]:
          [
            { title:
              { [Op.like]: `%${query}%`.toLowerCase()
              }
            },
            { author:
              { [Op.like]: `%${query}%`.toLowerCase()
              }
            },
            { genre:
              { [Op.like]: `%${query}%`.toLowerCase()
              }
            },
            { year: query
            }
          ]
        },
        offset: offset,
        limit: itemsPerPage
      },
      { order: [["author", "ASC"], ["year", "ASC"]]
      }
    ).then(books => {
        noOfPages = Math.ceil(books.count/itemsPerPage);
        return books.rows.map(book => book.get({plain: true}));
    })
    /*The query value has to be passsed to the view in case the users search returned more entries than itemsPerPage.
    Otherwise navigating to another page would result in unvoluntarily making a new "empty" query which would get back all books.
    Likewise, the value of itemsPerPage has to be passed along to prevent the select menu to jump back to its default value.
    */
    res.render('index', {bookList, query, currentPage, noOfPages, itemsPerPage});
}))
// Leads to the form for creating a new db-entry
router.get('/books/new', function(req, res) {
  res.render('new-book');
});
// Validates the user input and eventually passes the data to the server, creating a new book-entry in the db
router.post('/books/new', asyncHandler(async function(req, res) {
  try {
    await Book.create(req.body);
    res.redirect('/books');
  } catch(error){
      if (error.name === 'SequelizeValidationError'){
        const errors= error.errors
        res.render('new-book', {errors})
      }
    }
}));
// Leads to the form for updating an existing db-entry
router.get('/books/:id', asyncHandler(async function(req, res) {
    const book = await Book.findByPk(req.params.id)
      if (book){
        res.render('update-book', {book});
      } else {
        throw new Error("Invalid ID")
      }
}));
// Validates the user input and eventually passes the data to the server, cupdating an existing book-entry in the db
router.post('/books/:id', asyncHandler(async function(req, res) {
  try {
    const book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.redirect('/books');
  } catch(error){
      if (error.name === 'SequelizeValidationError'){
        const errors= error.errors
        const book =req.body
        res.render('update-book', {book, errors})
      }
    }
}));
// Deletes a book-entry
router.post('/books/delete/:id', asyncHandler(async function(req, res) {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect('/books');
}));


module.exports = router;
