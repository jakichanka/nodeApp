const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const redis   = require("redis");
const passport = require("passport")
const flash = require('express-flash')
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const passportLocal = require('./config').passportLocal

const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const docsRouter = require('./routes/docs');

require('dotenv').config()

const app = express();

app.use(flash())

const client  = redis.createClient({
  port: 6379,
  host: '0.0.0.0'
});

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  store: new redisStore({client}),
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 30
  }
}));

passportLocal();
app.use(passport.initialize())
app.use(passport.session())


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

app.use(cookieParser());



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/uikit/dist')));  
app.use(express.static(path.join(__dirname, 'downloads')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/docs',docsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
 // res.render('error');
});

module.exports = app;
