/*
coins api
*/

const router= require("express").Router()

const coinScraping= require("./modules/coinScraping");

//coinScraping.getCoinDataForBinance();

var db= require("./../db/dbMySql").coinsRelated;

var moment= require("moment");

var coinDB= new db();

 


 //coinScraping.getCoinDataForBibox();
// coinScraping.getCoinDataFromBittrex();
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

router.get("/",(req,res,next)=>{
    res.status(200).json({
        msg:"welcome to the coins api"
    })
})

router.get("/priceOfCoin/:coinSymbol",(req,res,next)=>{

    var coinsAllMarket=[];

    var coinSymbol= req.params.coinSymbol;
 
    var coinMarkets_promise= coinDB.getAllCoinMarkets(req.params.coinSymbol);
    var markets=[]
    var promises=[]
    coinMarkets_promise.then(d=>{
        d.forEach(d=>{
            markets.push(d.market_symbol);
            promises.push(coinDB.priceOfCoinByMarket(coinSymbol,d.market_symbol))

        })

        Promise.all(promises).then(function(value){
            coinDB.priceOfCoin(req.params.coinSymbol).then(d=>{
                var toSend=d;
                var lastUpdated= toSend.lastUpdated= moment(d.timestamp).fromNow();
                var requestTimestamp= moment().format();
                console.log()

                

                if(toSend.length==0){
                    invalid_response_tempalte("invalid coin symbol",res);
                    return;
                }
                exchange= toSend[0].Exchange_name;
                res.status(200).json({
                    meta:{
                        Exchange:exchange,
                        ExchangeWebsite:"Binance.com",
                        requestTimestamp,
                        lastUpdated,
                        allMarkets:value
                    },
                    priceSummary:toSend
                })
            })
        })
 

     })
 
    
})
//does basically what price of coin does but bases it on exchange
router.get("/priceOfCoin/:coinSymbol/:exchange",(req,res,next)=>{

    var coinsAllMarket=[];

    var coinSymbol= req.params.coinSymbol;
 
    var coinMarkets_promise= coinDB.getAllCoinMarketsByExchange(req.params.coinSymbol,req.params.exchange);
    var markets=[]
    var promises=[]
    coinMarkets_promise.then(d=>{
        d.forEach(d=>{
            markets.push(d.market_symbol);
            promises.push(coinDB.priceOfCoinByExchangeAndMarket(coinSymbol,d.market_symbol,req.params.exchange))

        })

        Promise.all(promises).then(function(value){
            coinDB.priceOfCoinByExchange(req.params.coinSymbol,req.params.exchange).then(d=>{
                var toSend=d;
                var lastUpdated= toSend.lastUpdated= moment(d.timestamp).fromNow();
                var requestTimestamp= moment().format();
                console.log()

                

                if(toSend.length==0){
                    invalid_response_tempalte("invalid coin symbol",res);
                    return;
                }
                exchange= toSend[0].Exchange_name;
                res.status(200).json({
                    meta:{
                        Exchange:exchange,
                        ExchangeWebsite:"Binance.com",
                        requestTimestamp,
                        lastUpdated,
                        allMarkets:value
                    },
                    priceSummary:toSend
                })
            })
        })
 

     })
 
    
})

router.get("/priceOfCoin/:symbol/:marketSymbol",(req,res,next)=>{
    coinDB.priceOfCoinByMarket(req.params.symbol,req.params.marketSymbol).then(d=>{
        res.status(200).json({
            price:d
        })
    })
})

router.get("/getAllMarketsByCoin/:coinSymbol",(req,res,next)=>{
    coinDB.getAllCoinMarkets(req.params.coinSymbol).then(d=>{
        res.status(200).json({
            markets:d
        })
    })
})

router.get("/searchCoin/:coinSymbol",(req,res,next)=>{
   //search by coin symbol
   coinDB.searchCoin(req.params.coinSymbol).then(d=>{
 
      res.status(200).json({
           results:d
      })
   })
})

router.get("/allCoinsAtExchange/:exchangeName",(req,res,next)=>{
    coinDB.allCoinsAtExchange(req.params.exchangeName).then(d=>{
        if(d.length==0){
            invalid_response_tempalte("invalid exchange",res)
            return;
        }
        res.status(200).json({
            meta:{
                q:"Searched for all coins at the exchange "+req.params.exchangeName
            },
            coins:d
        })
    })
})

router.get("/whatExchangeIsCoinAvailableAt/:coinSymbol",(req,res,next)=>{
    coinDB.coinAvailableAtWhatExchange(req.params.coinSymbol).then(d=>{
        if(d.length==0){
            invalid_response_tempalte("Sorry invalid coin symbol",res)
            return;
        }
        res.status(200).json({
            Exchanges:d
        })
    })
})

router.get("/update",(req,res,next)=>{
    //route updates all coin info
    coinScraping.getCoinDataForBinance()
    coinScraping.getCoinDataForBibox()
    coinScraping.getCoinDataFromBittrex()
    //save binance coin data
    res.status(200).json({
        msg:"updated"
    })
})

function invalid_response_tempalte(msg,res){
    res.status(200).json({
        msg:msg
    })
}

module.exports=router;