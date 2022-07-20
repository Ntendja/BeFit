const express = require("express");
const ejs = require("ejs");
const routes = require("./routen/routes.js");
const bodyParser = require("body-parser");
const session = require('express-session');
const app = express();
const database = require("./database.js");

app.set('view engine', 'ejs');
app.use( express.static( "public" ) );
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
        secret: 'BAh7CEkiD3Nlc3Npb25faWQGO',
        resave: true,
        saveUninitialized: false,
        cookie: { secure: false }
    }) //can only be true if we use https!
);

// index page
app.get('/', routes.index);

// Welcome page
app.get('/welcome', routes.welcome);

// login page
app.get('/login', routes.loginGet);

app.post('/login', routes.loginPost);

// login page
app.get('/register', routes.registerGet);

app.post('/register', routes.registerPost);

// about page
app.get('/exercises', routes.training);

app.post('/exercises', routes.exercisesPost);


app.get('/initDB', routes.initDB);
app.listen(8080);
console.log('Server is listening on port 8080');

