/*
module used for coin scraping
*/

var axios= require("axios");

var db= require("./../../db/dbMySql").coinsRelated;

var coinDB= new db();


//helper function 



 class coinRelated{

//     //grabs coin name by symbol
  getCoinNameBySymbol(symbol){
    return new Promise((resolve,reject)=>{
        console.log("getting...",symbol)
        axios.get("https://api.coinmarketcap.com/v2/listings/").then((r)=>{
    
            var cryp= r.data.data;
    
            var arr= cryp.filter(e=>{
                if(e.symbol.toLowerCase().startsWith(symbol)){
                    return e;
                }
             })
            if(arr[0]){
                resolve( arr[0].name);
            }else{
                resolve("nah");
            }
      
    
        })
    })
    
}

//grabs symbol by  coin name
  getSymbolByCoinName(coinName){
    return new Promise((resolve,reject)=>{
        console.log("getting...",coinName)
        axios.get("https://api.coinmarketcap.com/v2/listings/").then((r)=>{
    
            var cryp= r.data.data;
    
            var arr= cryp.filter(e=>{
                if(e.name.startsWith(coinName)){
                    return e;
                }
             })
             
             resolve(arr[0])
             
     
    
        })
    })
    
}
    
    getCoinDataForBibox(){
        //helper function within bibox
        var apiLink="https://api.bibox.com/v1/mdata?cmd=marketAll";
        console.log(apiLink);
        axios.get(apiLink).then((r)=>{
            var coinArr=r.data.result;

            function findBoboxPrice(coinSymbol,array){
                var arr= array.filter(e=>{
                    if(e.coin_symbol==coinSymbol && e.currency_symbol=="USDT"){
                        return e
                    }
                })
                return arr;
            }

            var Bitcoin_USD_price= findBoboxPrice("BTC",coinArr)[0].last;
            var Ethereum_USD_price= findBoboxPrice("ETH",coinArr)[0].last;
            var Bix_USD_price= findBoboxPrice("BIX",coinArr)[0].last;
 
 
 
            coinArr.forEach(e=>{
                var coinSymbol=e.coin_symbol;
                var market_symbol= e.currency_symbol;
                var market=null;
                 switch(market_symbol){
                    case "BTC":
                    e.market="bitcoin";
                    e.dollarPrice=e.last*Bitcoin_USD_price;
                    break;
                    case "ETH":
                    e.market="ethereum";
                    e.dollarPrice=e.last*Ethereum_USD_price;
                    break;
                    case "BIX":
                    e.market="bibox coin";
                    e.dollarPrice=e.last*Bix_USD_price;
                    break;
                    case "USDT":
                    e.market="tether"
                    e.dollarPrice=e.last*1;
                    break;
                    default:
                    e.market="pass"
                }
                
                //console.log(e);
            })
            coinArr.forEach(e=>{
                coinDB.addCoinData({
                    price:e.last,
                    market:e.market.toLowerCase(),
                    market_symbol:e.currency_symbol.toLowerCase(),
                    coin_symbol:e.coin_symbol.toLowerCase(),
                    price_dollar:e.dollarPrice,
                    Exchange_name:"bibox",
                })
            })
        })
    }

    getCoinDataFromBittrex(){
        //helper function within bittrex
        var apiLink="https://bittrex.com/api/v1.1/public/getmarketsummaries";

        function search_array(symbol,array){
            return array.filter(e=>{
                if((e.MarketName).includes(symbol)){
                    return e;
                }
            })
        }
        
        axios.get(apiLink).then(function (response) {
            var coinArr= response.data.result;

            var Bitcoin_USD_price=search_array("USDT-BTC",coinArr)[0].Last;
            var Ethereum_USD_price=search_array("USDT-ETH",coinArr)[0].Last;
 
            coinArr.forEach(e=>{
                 var marketSplit= e.MarketName.split("-");
                 e.coinSymbol=marketSplit[1];
                 switch(marketSplit[0]){
                    case "BTC":
                    e.market="bitcoin"
                    e.dollarPrice=e.Last*Bitcoin_USD_price;
                    e.market_symbol="btc";
                    break;
                    case "ETH":
                    e.market="ethereum"
                    e.dollarPrice=e.Last*Ethereum_USD_price;
                    e.market_symbol="eth";
                    break;
                    case "USDT":
                    e.market="Tether"
                    e.dollarPrice=e.Last*1;
                    e.market_symbol="usdt";
                    break;
                    case "USD":
                    e.market="US Dollar"
                    e.dollarPrice=e.Last*1;
                    e.market_symbol="usd"
                    break;
                }
             })
             coinArr.forEach(e=>{
                coinDB.addCoinData({
                    price:e.Last,
                    market:e.market,
                    market_symbol:e.market_symbol,
                    coin_symbol:e.coinSymbol,
                    price_dollar:e.dollarPrice,
                    Exchange_name:"bittrex",
                })
            })
             
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    getCoinDataForBinance(){
        //helper function within binance
        function search_array(what,array){
            var arr= array.filter(e=>{
                if(e.symbol==what){
                    return e;
                }
            })
        
            return arr[0].price;
        }
        //grabs coin data from binance
        var endPoint="https://api.binance.com/api/v1/ticker/allPrices";

       


        axios.get(endPoint).then((r)=>{
            var coinData= r["data"];

            var ETH_Dollar_Price= search_array("ETHUSDT",coinData);
            var BNB_Dollar_Price= search_array("BNBUSDT",coinData);
            var BTC_Dollar_Price= search_array("BTCUSDT",coinData);
            //we need to know the baseline prices of the 4 power currencies to work out all the prices here
             
            
            coinData.forEach(e=>{
                var symbol=e.symbol;

 
                var isEth= symbol.includes("ETH");
                var isBTC= symbol.includes("BTC");
                var isUSDT= symbol.includes("USDT");
                var isBNB= symbol.includes("BNB");

                e.Exchange_name="binance";

                if(isEth){
                    e.market="ethereum";
                    e.marketSymbol="eth";
                    e.coinSymbol= symbol.replace("ETH","").toLowerCase();
                    e.dollarPrice= e.price*ETH_Dollar_Price;
                 }
                if(isBTC){
                    e.market="bitcoin";
                    e.marketSymbol="btc";
                    e.coinSymbol= symbol.replace("BTC","").toLowerCase();
                    e.dollarPrice= e.price*BTC_Dollar_Price;
                }
                if(isUSDT){
                    e.market="tether"
                    e.marketSymbol="usdt"
                    e.coinSymbol= symbol.replace("USDT","").toLowerCase();
                    e.dollarPrice= e.price*1;
                }
                if(isBNB){
                    e.market="binance coin"
                    e.marketSymbol="bnb"
                    e.coinSymbol= symbol.replace("BNB","").toLowerCase();
                    e.dollarPrice= e.price*BNB_Dollar_Price;
                }
            })

        coinData.forEach(e=>{
            coinDB.addCoinData({
                price:e.price,
                market:e.market,
                market_symbol:e.marketSymbol,
                coin_symbol:e.coinSymbol,
                price_dollar:e.dollarPrice,
                Exchange_name:e.Exchange_name,
            })
        })
          
       

        })

        
    }

}


module.exports=new coinRelated();