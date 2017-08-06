const express = require('express');
const router = express.Router();
const googleFinance = require("google-finance");
const moment = require('moment');
const StockSymbolLookup = require('stock-symbol-lookup');
var data = []; // data to be graphed
var stocks = []; //invalid data
var stock = ['AAPL', 'GOOG']; //initial data
var name = []; // data with desc
var valid = []; // valid data

function loadData(){ //looks up data
	StockSymbolLookup.loadData()
    .then((data) => {
    	name = []; //resets desc
        for(var i = 0; i < data.securities.length; i++){ //if stock load up has data, pushes it into the name arr
        	for(var j = 0; j < stock.filter(Boolean).length; j++){
        		stock = stock.filter(Boolean);
            	if(stock[j] == data.securities[i].symbol){
                	name.push([data.securities[i].symbol, data.securities[i].securityName]);
            	}
        	}
		}
		valid = stock.filter(function(element){ // sets valid to the valid elements
            for(var i = 0; i < data.securities.length; i++){
                if(data.securities[i].symbol === element){
                    return element;
                }
            }
        });
        stocks = stock.filter(function(element){ //sets stocks to the elements that are not in valid
            return valid.indexOf(element) === -1;
        });
        console.log(name);
        console.log(stocks);
        console.log(stock);
        console.log(valid);
    });
}


//Posts information about the required stock
router.post('/', function(req, res){
	if(stock.filter(Boolean).indexOf(req.body.stock) === -1){ //if stock arr does not have the required stock
		stock.filter(Boolean);
		if(req.body.stock !== "undefined"){ //if stock is not equals to undefined
			stock.push(req.body.stock);
		}
		stock = stock.filter(Boolean).map(function(ele){
			return ele.toUpperCase();
		})
		stock = stock.filter(function(element){ //if x is clicked, delete stock
			return element !== req.body.name;
		});
		StockSymbolLookup.loadData() //looks for data
    	.then((data) => {
    	name = []; //resets desc
        for(var i = 0; i < data.securities.length; i++){ //pushes desc to name
        	for(var j = 0; j < stock.filter(Boolean).length; j++){
        		stock = stock.filter(Boolean);
            	if(stock[j] == data.securities[i].symbol){
                	name.push([data.securities[i].symbol, data.securities[i].securityName]);
            	}
        	}
		}
		valid = stock.filter(function(element){ //filters out names which has desc
            for(var i = 0; i < data.securities.length; i++){
                if(data.securities[i].symbol === element){
                    return element;
                }
            }
        });
        stocks = stock.filter(function(element){ //filters out names that don't have a desc
            return valid.indexOf(element) === -1;
        });
        console.log(name);
        console.log(stocks);
        console.log(valid);
        res.render('index', { //renders info
        	invalid: stocks,
			error: false,
			data: stock,
			names: name,
			message: "The stock you are searching for already exists"
		});
    });
		
	}
	else{ //if stock is not found
		stock.filter(Boolean);
		stock = stock.filter(function(element){
			return element !== req.body.name;
		});
		loadData();
		//needs to use json and express v4 +
		res.render('index', { //render data
			invalid: stocks,
			error: true,
			data: stock,
			names: name,
			message: "The stock you are searching for already exists"
		});
	}
});



//Sends JSON stock data to /data/(stock)
router.get('/data/:stock', function(req, res){
	googleFinance.historical({ //gets google finance
		symbol: req.params.stock,
		from: '2013-01-01',
		to: new Date()
	}, function (err, quotes) {
		if(err){ //if err
			res.render('index',{
				invalid: stocks,
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
	StockSymbolLookup.loadData() //looks for data
    	.then((data) => {
    	name = []; //resets desc
        for(var i = 0; i < data.securities.length; i++){ //pushes desc to name
        	for(var j = 0; j < stock.filter(Boolean).length; j++){
        		stock = stock.filter(Boolean);
            	if(stock[j] == data.securities[i].symbol){
                	name.push([data.securities[i].symbol, data.securities[i].securityName]);
            	}
        	}
		}
		valid = stock.filter(function(element){ //filters out names which has desc
            for(var i = 0; i < data.securities.length; i++){
                if(data.securities[i].symbol === element){
                    return element;
                }
            }
        });
        stocks = stock.filter(function(element){ //filters out names that don't have a desc
            return valid.indexOf(element) === -1;
        });
        console.log(name);
        console.log(stocks);
        console.log(valid);
        res.render('index',{ //renders info
        	invalid: stocks,
			error: false,
			data: stock,
			names: name,
			message: "The stock you are searching for already exists"
		});
    });
});

module.exports = router;