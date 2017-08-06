const home = require("./routes/index");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');

process.env.NODE_ENV = 'production';

//Sets up local cookie (see https://www.npmjs.com/package/client-sessions)
app.use(express.static('public'));
app.use(session({
  cookieName: 'session',
  secret: 'asfasFHDFDHJDFJr5e4rwrsefzawq1',
  duration: 24 * 60 * 60 * 1000
}));

app.set('port', process.env.PORT || process.env.IP );
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



//Sets up links for different sites
app.use("/", home);

//Starts port
var port = process.env.PORT || 3000;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});




