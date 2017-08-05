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
		if(err){
			res.render('error', {
				error: "Incorrect or not existing stock code"
			})
		};
		for(var i = 0; i < quotes.length; i++){
			data.push([Number(moment(quotes[i].date, "MMMM D, YYYY").format("X"))*1000, quotes[i].close]);
		}
		res.json({data});
		data = [];
	});
	
});

router.get("/", function(req, res){
	res.render("index", {
		data: stock
	});
});

router.post('/', function(req, res){
	if(stock.filter(Boolean).indexOf(req.body.stock) === -1){
		stock.filter(Boolean);
		stock.push(req.body.stock);
		stock = stock.filter(function(element){
			return element !== req.body.name;
		});
		res.render('index',{
			error: false,
			data: stock.filter(Boolean),
			message: "The stock you are searching for already exists"
		});
	}
	else{
		stock.filter(Boolean);
		stock = stock.filter(function(element){
			return element !== req.body.name;
		});
		res.render('index',{
			error: true,
			data: stock.filter(Boolean),
			message: "The stock you are searching for already exists"
		});
	}
	console.log(req.body.stock);
	console.log(stock);
	console.log(req.body.name);
});


module.exports = router;