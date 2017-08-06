const express = require('express');
const router = express.Router();
const googleFinance = require("google-finance");
const moment = require('moment');
var data = [];
var stock = ['AAPL', 'GOOG'];
var date = new Date();

//Sends JSON stock data to /data/(stock)
router.get('/data/:stock', function(req, res){
	googleFinance.historical({
		symbol: req.params.stock,
		from: '2013-01-01',
		to: new Date()
	}, function (err, quotes) {
		if(err){
			res.render('index',{
				error: true,
				data: stock,
				message: "The stock you are searching for is not found"
			})
		};
		for(var i = 0; i < quotes.length; i++){
			data.push([Number(moment(quotes[i].date, "MMMM D, YYYY").format("X"))*1000, quotes[i].close]);
		}
		res.json({data});
		data = [];
	});
	
});

//Renders initial page
router.get("/", function(req, res){
	res.render("index", {
		error: false,
		data: stock,
		message: "The stock you are searching for already exists"
	});
});

//Posts information about the required stock
router.post('/', function(req, res){
	if(stock.filter(Boolean).indexOf(req.body.stock) === -1){
		stock.filter(Boolean);
		if(req.body.stock !== "undefined"){
			stock.push(req.body.stock);
		}
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
			message: "The stock you are searching for lalready exists"
		});
	}
});


module.exports = router;