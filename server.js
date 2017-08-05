const home = require("./routes/index");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

process.env.NODE_ENV = 'production';

//Sets up environment
app.use(express.static('public'));
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




