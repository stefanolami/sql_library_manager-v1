var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* Helper Function */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* GET home page. */
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books')
}));

/* GET books */
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('index', {books: books});
}))

/* GET new */
router.get('/books/new', (req, res) => {
  res.render('new', {book: {}})
})

/* POST new */
router.post('/', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books');
  } catch(error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render('new', {book, errors: error.errors})
    } else {
      throw error;
    }
  } 
}))

/* GET book by id */
router.get('/books/:id', asyncHandler(async (req, res) => {
  let book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('update', {book: book})
  } else {
    res.sendStatus(404);
  }
}))

/* POST update book */
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books');
    } else {
      res.sendStatus(404)
    }
  } catch(error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('update', {book: book, errors: error.errors})
    } else {
      throw error
    }
  }
}))

/* POST delete book */
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect('/books');
}))

module.exports = router;