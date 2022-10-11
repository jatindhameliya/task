require("dotenv").config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var expressLayouts = require("express-ejs-layouts");
var logger = require('morgan');
let mongoose = require('mongoose');
// app routers
var loginRouterapp = require('./routes/login');
var indexRouterapp = require('./routes/index');
var postsRouterapp = require('./routes/posts');
var registerRouterapp = require('./routes/register');
// api routers
var loginRouter = require('./routes/apis/login');
var registerRouter = require('./routes/apis/register');
var postRouter = require('./routes/apis/posts');
var app = express();
app.use(session({ resave: true, saveUninitialized: true, secret: '11ZADOCSHHHHH', cookie: { maxAge: 8 * 60 * 60 * 1000 } }));
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
mongoose.connection.once('open', () => {
	console.log("Well done! , connected with mongoDB database");
}).on('error', error => {
	console.log("Oops! database connection error:" + error);
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/angular", express.static(__dirname + "/node_modules/angular"));
// app routers
app.use('/', loginRouterapp);
app.use('/register', registerRouterapp);
app.use('/home', indexRouterapp);
app.use('/posts', postsRouterapp);
// api routes
app.use('/apis/register', registerRouter);
app.use('/apis/posts', postRouter);
app.use('/apis/login', loginRouter);
app.get("/logout", async (req, res, next) => {
	req.session.destroy();
	var goto = process.env.DOMAIN_NAME;
	res.writeHead(302, { 'Location': goto });
	res.end();
});
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
