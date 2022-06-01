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
  /* const books = await Book.findAll();
  res.json(books); */
  res.render('index')
}));

router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('index', {books: books});
}))


  /* res.render('index', { title: 'Express' }); */


module.exports = router;
