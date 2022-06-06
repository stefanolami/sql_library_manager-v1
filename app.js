var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const db = require('./models/index');
const {sequelize} = db;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/* app.use(express.static('public')) */

app.use('/', indexRouter);
app.use('/users', usersRouter);

/* ERROR HANDLERS */

/* 404 error handler */

app.use((req, res, next) => {
  const err = new Error();
  err.message = "Sorry, page not found";
  err.status = 404;
  next(err);
})

/* global error handler */

app.use((err, req, res, next) => {
  if (err.status === 404) {
      console.log(err.message);
      res.render("page-not-found", err);
  } else {
      if (!err.status) {
          err.status = 500;
      } 
      if (!err.message) {
          err.message = "Oops! An error has occured";
      }
      console.log(err.message);
      res.render("error", {err})
  }
})

module.exports = app;