var dbAuth = require('./config.js'); // atlas db credentials
var path = require('path');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var dayRouter = require('./routes/day');
var daysRouter = require('./routes/days');
var systemRouter = require('./routes/system');
var systemsRouter = require('./routes/systems');
var systemCategoryRouter = require('./routes/systemCategory');
var systemCategoriesRouter = require('./routes/systemCategories');
var categoryRouter = require('./routes/category');
var categoriesRouter = require('./routes/categories');
var variableRouter = require('./routes/variable');
var variablesRouter = require('./routes/variables');
var onboardingStepsRouter = require('./routes/onboardingSteps');
var usersRouter = require('./routes/users');

var flash = require('connect-flash');
var passport = require('passport');
var expressSession = require('express-session');
var User = require('./models/User.js');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var app = express();

// allow cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

mongoose.connect('mongodb+srv://' + dbAuth.DB_AUTH + '@cluster0-y9uwh.mongodb.net/' + dbAuth.DB_NAME + '?retryWrites=true&w=majority',
  { useNewUrlParser: true }, function (err) {
    if (err) {
      console.log('error connecting', err);
    } else {
      console.log('connected!');
    }
  });

// authentication 
// sessions resave https://stackoverflow.com/a/51540685
app.use(expressSession({
  secret: 'sessionEncryptionKey',
  resave: true,//false, 
  saveUninitialized: true,
  // cookie: { secure: true }
  key: 'sid'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// facbeook
passport.use(new FacebookStrategy({
  clientID: dbAuth.FACEBOOK_APP_ID,
  clientSecret: dbAuth.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'photos']
}, function (accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    //Assuming user exists
    //console.log(profile.displayName);
    //user = profile.displayName;
    //console.log(profile.photos[0].value);
    done(null, profile);
  });
}));

// local strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/day', dayRouter);
app.use('/days', daysRouter);
app.use('/category', categoryRouter);
app.use('/categories', categoriesRouter);
app.use('/system', systemRouter);
app.use('/systems', systemsRouter);
app.use('/systemCategory', systemCategoryRouter);
app.use('/systemCategories', systemCategoriesRouter);
app.use('/variable', variableRouter);
app.use('/variables', variablesRouter);
app.use('/onboardingSteps', onboardingStepsRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;