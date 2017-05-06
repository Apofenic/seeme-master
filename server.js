var express = require('express');
var app = express();
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var env = require('dotenv').load();
var exphbs = require('express-handlebars');

var methodOverride = require('method-override');
var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy;

var PORT = process.env.PORT || 3000;
var mainRoutes = require('./routes/mainRoutes.js');


// Serve static content
app.use(express.static("./public"));

// Server body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// config for passport
app.use(session({
    secret: 'seemecatsanddogs',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// For Handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');



// Models
var db = require("./models");

// Auth Routes
var authRoute = require('./routes/auth.js')(app, passport);

// Load Passport strategies
require('./config/passport/passport.js')(passport, db.user);
require('./models/user');

// This was a poor attempt at passport facebook auth - if have time, look into implementing into config/passport/passport.js
// require('./routes/passport')(passport);

// Basically, just the landing page
mainRoutes(app);
app.use('/', mainRoutes);

// Method Override
app.use(methodOverride('_method'));

// Sync Database & Launch Server/App
db.sequelize.sync({ force: true }).then(function() {
    app.listen(PORT, function() {
        console.log("App listening on PORT " + PORT);
    });
});