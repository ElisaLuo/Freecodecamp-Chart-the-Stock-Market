const express = require('express');
const router = express.Router();
const googleFinance = require("google-finance");
const moment = require('moment');
var data = [];
var stock = ['AAPL', 'GOOG'];
var date = new Date();

router.get('/data/:stock', function(req, res){
	googleFinance.historical({
		symbol: req.params.stock,
		from: '2013-01-01',
		to: new Date()
	}, function (err, quotes) {
		if(err) return err;
		for(var i = 0; i < quotes.length; i++){
			data.push([Number(moment(quotes[i].date, "MMMM D, YYYY").format("X"))*1000, quotes[i].close]);
		}
		res.json({data});
		data = [];
	});
	
});

router.get('/', function(req, res){
	//console.log(stock);
	res.render('index', {
		data: stock
	});
});


module.exports = router;