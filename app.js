// Main module
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes are handled in a separate module
app.use(indexRouter);

// error handlers for 404 and other errors
app.use(function (req, res, next) {
  const err =  createError(404, "Sorry, the site you requested wasn't found!")
  next(err)
})

app.use(function (err, req, res, next) {
  console.error(`${err.status}: ${err.stack}`);
  if(err.status ===404){
    res.render("page-not-found", {err});
  } else {
  res.render("error", {err});
  }
})

module.exports = app;
