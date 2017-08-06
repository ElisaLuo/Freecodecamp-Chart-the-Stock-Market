const home = require("./routes/index");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

process.env.NODE_ENV = 'production';

app.use(express.static('public'));
app.use(session({
    secret: 'elktrjosd0983jlwsf08easd90',
    resave: true,
    saveUninitialized: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));// for parsing application/x-www-form-urlencoded
app.use(passport.initialize());//Sets up for passport
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.set('port', process.env.PORT || process.env.IP );
app.set('view engine', 'ejs');


//Sets up links for different sites
app.use("/", home);

//Starts port
var port = process.env.PORT || 3000;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});




