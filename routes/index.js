var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const {Op} = require('sequelize');

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
  res.redirect('/books?page=0')
}));

/* GET books */
router.get('/books', asyncHandler(async (req, res) => {
  let page = req.query.page;
  const allBooks = await Book.findAll();
  const pages = Math.ceil(allBooks.length / 5);
  const books = await Book.findAndCountAll({
    limit: 5,
    offset: page * 5
  });
  res.render('index', {books: books.rows, n: 1, pages: pages, page: page})
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
    res.redirect('/books?page=0');
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
    res.render('page-not-found')
  }
}))

/* POST update book */
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books?page=0');
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
  res.redirect('/books?page=0');
}))

/* POST search book */
router.post('/search', asyncHandler(async (req, res) => {
  const searchQuery = req.body.search;
  /* console.log(searchQuery); */
  res.redirect('/search/' + searchQuery)

}))

/* GET search book */
router.get('/search/:query', asyncHandler(async (req, res) => {
  const searchQuery = req.params.query;
  const books = await Book.findAll({
    where: {
      [Op.or]: [
        {
          title: {
            [Op.substring]: searchQuery
          }
        },
        {
          author: {
            [Op.substring]: searchQuery
          }
        },
        {
          genre: {
            [Op.substring]: searchQuery
          }
        },
        {
          year: {
            [Op.substring]: searchQuery
          }
        }
      ]
    }
  })
  res.render('index', {books: books})
}))

module.exports = router;