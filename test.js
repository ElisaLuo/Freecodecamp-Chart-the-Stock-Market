const StockSymbolLookup = require('stock-symbol-lookup');
var stock = ['AAPL', 'GOOG', 'aa', 'bb'];
var name = [];

StockSymbolLookup.loadData()
    .then((data) => {
        name = stock.filter(function(element){
            for(var i = 0; i < data.securities.length; i++){
                if(data.securities[i].symbol === element){
                    return element;
                }
            }
        });
        stock = stock.filter(function(element){
            return name.indexOf(element) === -1;
        });
    	 console.log(stock);
    	 console.log(name);
    });
    