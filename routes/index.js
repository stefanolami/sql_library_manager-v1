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
  res.render('new')
})

/* POST new */
router.post('/', asyncHandler(async (req, res) => {
  let book = await Book.create(req.body);
  /* console.log(req.body) */
  res.redirect('/books');
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
  let book = await Book.findByPk(req.params.id);
  await book.update(req.body);
  res.redirect('/books');
}))

/* POST delete book */
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect('/books');
}))

module.exports = router;