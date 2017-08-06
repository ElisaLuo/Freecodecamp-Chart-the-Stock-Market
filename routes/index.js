const express = require('express');
const router = express.Router();
const googleFinance = require("google-finance");
const moment = require('moment');
const StockSymbolLookup = require('stock-symbol-lookup');
var data = [];
var stock = ['AAPL', 'GOOG'];
var name = [];

StockSymbolLookup.loadData()
    .then((data) => {
    	name = [];
        for(var i = 0; i < data.securities.length; i++){
        	for(var j = 0; j < stock.filter(Boolean).length; j++){
        		stock = stock.filter(Boolean);
            	if(stock[j] == data.securities[i].symbol){
                	name.push([data.securities[i].symbol, data.securities[i].securityName]);
            	}
            	/*else{
            		stock = stock.filter(function(element){
            			return element !== stock[j];
            		})
            	}*/
        	}
		}
        console.log(name);
        console.log(stock);
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
		StockSymbolLookup.loadData()
    .then((data) => {
    	name = [];
        for(var i = 0; i < data.securities.length; i++){
        	for(var j = 0; j < stock.filter(Boolean).length; j++){
        		stock = stock.filter(Boolean);
            	if(stock[j] == data.securities[i].symbol){
                	name.push([data.securities[i].symbol, data.securities[i].securityName]);
            	}
        	}
		}
        console.log(name);
        console.log(stock);
        res.render('index',{
			error: false,
			data: stock.filter(Boolean),
			names: name,
			message: "The stock you are searching for already exists"
		});
    });
		
	}
	else{
		stock.filter(Boolean);
		stock = stock.filter(function(element){
			return element !== req.body.name;
		});
		StockSymbolLookup.loadData()
    .then((data) => {
    	name = [];
        for(var i = 0; i < data.securities.length; i++){
        	for(var j = 0; j < stock.filter(Boolean).length; j++){
        		stock = stock.filter(Boolean);
            	if(stock[j] == data.securities[i].symbol){
                	name.push([data.securities[i].symbol, data.securities[i].securityName]);
            	}
        	}
		}
        console.log(name);
        console.log(stock);
    });
		res.render('index',{
			error: true,
			data: stock.filter(Boolean),
			names: name,
			message: "The stock you are searching for lalready exists"
		});
	}
});



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
				names: name,
				message: "The stock you are searching for is not found"
			});
		}
		for(var i = 0; i < quotes.length; i++){
			data.push([Number(moment(quotes[i].date, "MMMM D, YYYY").format("X"))*1000, quotes[i].close]);
		}
		res.json({data});
		data = [];
	});
	
});

//Renders initial page
router.get("/", function(req, res){
	StockSymbolLookup.loadData()
    .then((data) => {
    	name = [];
        for(var i = 0; i < data.securities.length; i++){
        	for(var j = 0; j < stock.filter(Boolean).length; j++){
        		stock = stock.filter(Boolean);
            	if(stock[j] == data.securities[i].symbol){
                	name.push([data.securities[i].symbol, data.securities[i].securityName]);
            	}
        	}
		}
        console.log(name);
        console.log(stock);
    });
	res.render("index", {
		error: false,
		data: stock,
		names: name,
		message: "The stock you are searching for already exists"
	});
});

module.exports = router;