const express = require('express');
const router = express.Router();
const googleFinance = require("google-finance");
const moment = require('moment');
const highcharts = require('highcharts');
var data = [];
var data2 =[];
var date = new Date();
googleFinance.historical({
  symbols: ['GOOG', 'AAPL'],
  from: '2017-07-01',
  to: new Date()
}, function (err, result) {
	if(err) return err;
	for(var i = 0; i < result.GOOG.length; i++){
		data.push([Number(moment(result.GOOG[i].date, "MMMM D, YYYY").format("X"))*1000, result.GOOG[i].close]);
	}
	router.get('/', function(req, res){
			res.render('index',{
				data: data
			});
		});
		router.get('/api/:stock', function(req, res){
			res.json({data});
		});
});

module.exports = router;