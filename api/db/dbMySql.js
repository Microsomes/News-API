var mysql = require('mysql');

var sha256 = require('js-sha256').sha256;
var sha224 = require('js-sha256').sha224;


function createMonopoly_table(){
    //spwans the monopoly leaderboard table
    var sql="CREATE TABLE `monopoly` (`id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,`name` varchar(255) NOT NULL,`wins` int(11) NOT NULL DEFAULT '0',`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,`xbox_handle` varchar(255) DEFAULT NULL,`psn_handle` varchar(255) DEFAULT NULL,`steam_handle` varchar(255) DEFAULT NULL)";
    con.query(sql,(err,result)=>{
        if(err){
            console.log("table already exists","monopoly table");
            return;
        }
        console.log("table created_monopoly table");
    })
}


function createComment_table(){
    //spawns a comment stable in 
        //method spawns a new news table
        var sql="CREATE TABLE `coins` (`ID` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,`price` text NOT NULL,`market` text NOT NULL,`market_symbol` text NOT NULL,`coin_symbol` text NOT NULL,`price_dollar` text NOT NULL,`Exchange_name` text NOT NULL,`timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP)"
        con.query(sql,(err,result)=>{
            if(err){
                console.log("table already exists","comments table");
                return;
            }
            console.log("table created");
        })
    
}

//spawns the source item table
function sourceItem_table(){
    var sql="CREATE TABLE `source_item` (`source` varchar(255) NOT NULL,`source_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,`promo_image` text NOT NULL,`square_image` text NOT NULL,`url` text NOT NULL,`source_description` text NOT NULL,`source_claps` int(11) NOT NULL DEFAULT '0')"
    con.query(sql,(err,result)=>{
        if(err){
            console.log("table: source item already exists","comments table");
            return;
        }
        console.log("table created");
    })
}

function createNewsifyUsers_table(){
    //method spawns a new news table
    var sql="CREATE TABLE `newsify_users` (`id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,`username` text NOT NULL,`password_hash` text NOT NULL,`souceName` text NOT NULL,`authorName` text NOT NULL,`jointedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP)"
    con.query(sql,(err,result)=>{
        if(err){
            console.log("table already exists");
            return;
        }
        console.log("table created");
    })

}

 function createNews_table(){
    //method spawns a new news table
    var sql="CREATE TABLE `news` (  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,`Title` text NOT NULL,`Description` text NOT NULL,`CrawlDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,`Source` text NOT NULL,`Author` text NOT NULL,`Url` text NOT NULL,`UrlToImage` text NOT NULL,`tag` text NOT NULL,`souceImageUrl` text NOT NULL,`postType` varchar(255) NOT NULL DEFAULT 'standard',`latLng` varchar(255) DEFAULT NULL,`newsType` varchar(255) NOT NULL DEFAULT 'crawled')";
    con.query(sql,(err,result)=>{
        if(err){
            console.log("table already exists");
            return;
        }
        console.log("table created");
    })

}


class newsify_auto{
    //class does all the authentication mumbo jumpbo related to database connectivity
    
    login(username,password){
        console.log(username);
        console.log(password);
        return new Promise((resolve,reject)=>{
            //verifiers user login 
            var password_hash= sha256(password);
            console.log(password_hash)
            var sql= "SELECT * FROM newsify_users WHERE password_hash=? AND username=?";
            con.query(sql,[password_hash,username],(err,result)=>{
                if(err){
                    reject(err);
                }else{
                     if(result.length>=1){
                        resolve("yes");
                    }else{
                        resolve("no");
                    }
                }
                 
            })
        })
       
    }

    getSourceNameByUsername(username){
        return new Promise((resolve,reject)=>{
            //grabs the users source name by username
            var sql= "SELECT souceName FROM newsify_users WHERE username=? ";
            con.query(sql,[username],(err,result)=>{
                if(err){
                    reject(err);
                }else{
                    if(result.length>=1){
                        //found something
                        resolve(result[0].souceName);
                    }else{
                        resolve("no");
                    }
                }
            })
        })
         
    }

    verifyUsernameUnique(username){
        return new Promise((resolve,reject)=>{
            //verifies no one else has that username
            var sql="SELECT * FROM newsify_users WHERE username=?";
            con.query(sql,[username],(err,result)=>{
                if(err){
                    reject(err);
                }else{
                    if(result.length>=1){
                        resolve("yes")
                    }else{
                        resolve("no")
                    }
                }
            })
        })
         
    }

    verifySourceNameUnique(sourceName){
        //verifies no one else has that source name
        return new Promise((resolve,reject)=>{
            //verifies no one else has that souceName
            var sql="SELECT * FROM newsify_users WHERE souceName=?";
            con.query(sql,[sourceName],(err,result)=>{
                if(err){
                    reject(err);
                }else{
                    if(result.length>=1){
                        resolve("yes")
                    }else{
                        resolve("no")
                    }
                }
            })
        })
    }

    
    signup(username,password,sourceName){
        return new Promise((resolve,reject)=>{
            //signs user up based on a payload
            var password_hash= sha256(password);
            var sql="INSERT INTO newsify_users SET ? ";
            con.query(sql,{
                username:username,
                password_hash:password_hash,
                souceName:sourceName,
                authorName:sourceName,   
            },(err,result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        })
         

    }
}


//class for monpoly related shiz
class Monopoly{


   

    checkNameDub(name){
        //checks if the name of the person entered is unique
        return new Promise((resolve,reject)=>{
            var sql="SELECT name FROM monopoly WHERE name=?";
            con.query(sql,[name],(err,result)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(result);
            })
        })
    }

    //add leaderboard with just a name
    addLeaderboardRecord_first(name,wins,xbox,psn,steam){
        return new Promise((resolve,reject)=>{
            var sql="INSERT INTO monopoly SET ?";
            con.query(sql,{
                name,
                wins,
                xbox_handle:xbox || "--",
                psn_handle:psn || "--",
                steam_handle:steam || "--",
            })
        })
    }

    grabAllEntries(){
        return new Promise((resolve,reject)=>{
            var sql="SELECT * FROM monopoly";
            con.query(sql,(err,result)=>{
                if(err){
                    reject(err);
                    return
                }
                resolve(result);
            })
        })
    }

    grabAllEntries_by_wins(){
        return new Promise((resolve,reject)=>{
            var sql="SELECT * FROM monopoly ORDER BY wins DESC";
            con.query(sql,(err,result)=>{
                if(err){
                    reject(err);
                    return
                }
                resolve(result);
            })
        })
    }

    grabAllEntries_by_wins_best(){
        return new Promise((resolve,reject)=>{
            var sql="SELECT * FROM monopoly ORDER BY wins DESC LIMIT 3";
            con.query(sql,(err,result)=>{
                if(err){
                    reject(err);
                    return
                }
                resolve(result);
            })
        })
    }

    searchEntry(query){
        return new Promise((resolve,reject)=>{
            var sql="SELECT * FROM monopoly WHERE name LIKE ?";
            con.query(sql,["%"+query+"%"],(err,result)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(result);
            })
        })
    }

    searchEntry_xbox(query){
        return new Promise((resolve,reject)=>{
            var sql="SELECT * FROM monopoly WHERE xbox_handle LIKE ?";
            con.query(sql,["%"+query+"%"],(err,result)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(result);
            })
        })
    }
    searchEntry_psn(query){
        return new Promise((resolve,reject)=>{
            var sql="SELECT * FROM monopoly WHERE psn_handle LIKE ?";
            con.query(sql,["%"+query+"%"],(err,result)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(result);
            })
        })
    }
    searchEntry_steam(query){
        return new Promise((resolve,reject)=>{
            var sql="SELECT * FROM monopoly WHERE steam_handle LIKE ?";
            con.query(sql,["%"+query+"%"],(err,result)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(result);
            })
        })
    }

    getEntryById(id){
        return new Promise((resolve,reject)=>{
            var sql="SELECT * FROM monopoly WHERE id=?";
            con.query(sql,[id],(err,result)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(result);
            })
        })
    }

    incrementWins(id){
        return new Promise((resolve,reject)=>{
            var sql="UPDATE monopoly SET wins= wins+1 WHERE id=?";
            con.query(sql,[id],(err,result)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(result);
            })
        })
            
    }
}


class newsRelated{
    constructor(){
        console.log("hi");
    }



    

    getArticleById(id){
        return new Promise((resolve,reject)=>{
            var sql="SELECT * FROM news WHERE id=?";
            con.query(sql,[id],(err,result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        })
        
    }

    getTotalBySource(source){
        return new Promise((resolve,reject)=>{
            //returns the total articles stored
            var sql="SELECT COUNT(id) as totalArticlesCached FROM news WHERE Source=? ";
            con.query(sql,[source],(err,result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        })
         
    }
    getTotal(){
        return new Promise((resolve,reject)=>{
            //returns the total articles stored
            var sql="SELECT COUNT(id) as totalArticlesCached FROM news ";
            con.query(sql,(err,result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        })
         
    }

    getNewsByQuery(query){
        return new Promise((resolve,reject)=>{
            //searches the title 
            var sql="SELECT * FROM news WHERE Title LIKE ? ORDER BY id desc LIMIT 50"
            con.query(sql,[query],(err,result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        })
        
    }

    getNewsBySouceNTag(source,tag){
        return new Promise((resolve,reject)=>{
            var sql="SELECT * FROM news WHERE Source=? AND tag=?  ORDER BY id desc  LIMIT 50";
            con.query(sql,[source,tag],(err,result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        })
        
    }

    getTagsOfSource(source){
        return new Promise((resolve,reject)=>{
            var sql="SELECT DISTINCT tag FROM news WHERE Source=?";
            con.query(sql,[source],(err,result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        })
        
    }

    getNewsBySource(source){
        return new Promise((resolve,reject)=>{
            var sql="SELECT * FROM news WHERE Source=?  ORDER BY id desc  LIMIT 50";
            con.query(sql,[source],(err,result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        })
       
    }

    getRecent(){
        return new Promise((resolve,reject)=>{
            //grabs recent articles
            var sql="SELECT * FROM news WHERE newsType='crawled' ORDER BY id desc LIMIT 200";
            con.query(sql,(err,result)=>{
                if(err){
                    reject(err);
                }else{
                     resolve(result)
                }
            })
        })     
    }

    getRecent_ug(){
        //like get recent but gets recent user generated content
        return new Promise((resolve,reject)=>{
            //grabs recent articles
            var sql="SELECT * FROM news WHERE newsType='user_generated' ORDER BY id desc LIMIT 1000";
            con.query(sql,(err,result)=>{
                if(err){
                    reject(err);
                }else{
                     resolve(result)
                }
            })
        })  
    }

    allSources(){
        return new Promise(function(resolve,reject){
            //grabs all sources
            var sql="SELECT DISTINCT Source ,souceImageUrl  FROM news WHERE newsType='crawled'";
            con.query(sql,(err,result)=>{
                if(err){
                    reject("no");
                    console.log(err);
                }else{
                    resolve(result);
                }
            })
        })
      
    }
    allSources_ug(){
        //method grabs all user generated sources
        return new Promise(function(resolve,reject){
            //grabs all sources
            var sql="SELECT DISTINCT Source ,souceImageUrl FROM news WHERE newsType='user_generated'";
            con.query(sql,(err,result)=>{
                if(err){
                    reject("no");
                }else{
                    resolve(result);
                }
            })
        })
      
    }
    
    checkDublicateTitle(title){
        return new Promise(function(resolve,reject){
            //checks if a title already exists within the news database
            var sql="SELECT * FROM news WHERE Title=?";
            con.query(sql,[title],(err,result)=>{
                if(err){
                    console.log(err);
                    return;
                }
                if(result.length<=0){
                    resolve("no");
                }else{
                    resolve("yes");
                }
            })
        })
       
    }





    //checks if news items exists
    checkSouceItemExists(source){
        return new Promise((resolve,reject)=>{
            var sql="SELECT   source  FROM  source_item WHERE source= ? ";
            con.query(sql,[source],(err,result)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(result);
            })
        })
    }


    //method adds a source item
    addSourceItem(newsPayload){
        console.log(newsPayload);
        return new Promise((resolve,reject)=>{

            var sql="INSERT INTO source_item SET ?";

            con.query(sql,{
                source:newsPayload.source,
                promo_image:newsPayload.promo_image,
                square_image:newsPayload.square_image,
                url:newsPayload.url,
                source_description:newsPayload.source_description,
                source_claps:0
            },(err,result)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(result);
                
            })


        })
    }
    
    //returns the list of all sources and their details
    grabSourceItems(){
        return new Promise((resolve,reject)=>{
            var sql="SELECT * FROM source_item";
            con.query(sql,(err,result)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(result);
            })
        })
    }

    grabSourceItem_by_name(name){
        return new Promise((resolve,reject)=>{
            var sql="SELECT * FROM source_item WHERE source=?";
            con.query(sql,[name],(err,result)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(result);
            })
        })
    }
    grabSourceItem_by_id(id){
        return new Promise((resolve,reject)=>{
            var sql="SELECT * FROM source_item WHERE source_id=?";
            con.query(sql,[id],(err,result)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(result);
            })
        })
    }

    //updates a source item
    updateSourceItem(id,newsPayload){
        return new Promise((resolve,reject)=>{
            var sql="UPDATE source_item SET ? WHERE source_id="+id;
            con.query(sql,{
                source:newsPayload.source,
                promo_image:newsPayload.promo_image,
                square_image:newsPayload.square_image,
                url:newsPayload.url,
                source_description:newsPayload.source_description,
                source_claps:0
            },(err,result)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(result);
            })
        })
    }

    //method deletes a news item
    deleteNewsItem(id){
        console.log("deleted");
        return new Promise((resolve,reject)=>{
            var sql="DELETE FROM source_item WHERE source_id=?";
            con.query(sql,[id],(err,result)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(result);
            })
        })
    }

     addNews(newsPayload){
         return new Promise(function(resolve,reject){
            var sql="SELECT * FROM news WHERE Title=?";
            con.query(sql,[newsPayload.title],(err,result)=>{
                if(err){
                    console.log(err);
                    return;
                }
                if(result.length<=0){
                    resolve("no");
                    con.query("INSERT INTO news SET ?",{
                        Title:newsPayload.title,
                        Description:newsPayload.description,
                        Source:newsPayload.source,
                        Author:newsPayload.author,
                        Url:newsPayload.url,
                        UrlToImage:newsPayload.image,
                        tag:newsPayload.tag,
                        souceImageUrl:newsPayload.sourceImage,
                     
                    },(err,result)=>{
                        if(err){
                            reject("no");
                        }else{
                            resolve(result);
                            console.log("done");
                        }
                        
                    })
                    return;
                }else{
                    resolve("yes");
                    console.log("dub")
                    return;//dublicate title detected
                }
            })

          
             
         })
        
    }
    addNewsM(newsPayload){
        //add news but also be able to add a coodinate
        return new Promise(function(resolve,reject){
           var sql= "INSERT INTO news SET ?";
           con.query(sql,{
               Title:newsPayload.title,
               Description:newsPayload.description,
               Source:newsPayload.source,
               Author:newsPayload.author,
               Url:newsPayload.url,
               UrlToImage:newsPayload.image,
               tag:newsPayload.tag,
               souceImageUrl:newsPayload.sourceImage,
               postType:"map",
               latLng:newsPayload.lat+","+newsPayload.lng

           },(err,result)=>{
               if(err){
                   reject("no");
               }else{
                   resolve(result);
               }
               
           })
        })
       
   }
    addNews_ug(newsPayload){
        //slight modification from add news but has extra info for user generated news
        return new Promise(function(resolve,reject){
           var sql= "INSERT INTO news SET ?";
           con.query(sql,{
               Title:newsPayload.title,
               Description:newsPayload.description,
               Source:newsPayload.verifiedSourceName,
               Author:newsPayload.verifiedUsername,
               Url:newsPayload.url,
               UrlToImage:newsPayload.image,
               tag:newsPayload.tag,
               souceImageUrl:newsPayload.sourceImage,
               newsType:"user_generated"
           },(err,result)=>{
               if(err){
                   reject("no");
               }else{
                   resolve(result);
               }
               
           })
        })
       
   }
}


//all methods related to the comments section of newsify
class commentv2{

    //adds a comment
    addComment(ad){
        return new Promise((resolve,reject)=>{
            var sql= "INSERT INTO comments SET ?";
            con.query(sql,{
                articleID:ad.articleID,
                titleOfArticle:ad.titleOfArticle,
                commentText:ad.commentText,
                createdBy:ad.createdBy
             },(err,result)=>{
                if(err){
                    reject(err);
                }
                resolve(result);
            })
        })
       

    }

    getAllThreadsCreatedBy(createdBy){
        return new Promise((resolve,reject)=>{
            var sql="SELECT DISTINCT(titleOfArticle),articleID  FROM comments WHERE createdBy=?";
            con.query(sql,[createdBy],(err,result)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(result);
                }
            })
        })
        
    }

    //grabs all comments by articleid
    getCommentsByArticleID(articleID){
        return new Promise((resolve,reject)=>{
            var sql="SELECT * FROM comments WHERE articleID=?";

            con.query(sql,[articleID],(err,result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        })
         
    }

    //grabs all threads that have been used
    getAllRecentCommentThreads(){
        return new Promise((resolve,reject)=>{
            var sql="SELECT DISTINCT(titleOfArticle),articleID FROM comments";
            con.query(sql,(err,result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        })
         
    }
}
 

class coinsRelated{
    
    addCoinData(coinData){
        var sql="INSERT INTO coins SET ?";

        con.query(sql,{
            price:coinData.price,
            market:coinData.market,
            market_symbol:coinData.market_symbol,
            coin_symbol:coinData.coin_symbol,
            price_dollar:coinData.price_dollar,
            Exchange_name:coinData.Exchange_name,
            
        },(err,result)=>{
            console.log(result);
            console.log(err);
        })
    }

    priceOfCoin(symbol){
        return new Promise((resolve,reject)=>{
            var sql="SELECT * FROM coins WHERE coin_symbol=? ORDER BY timestamp DESC LIMIT 1";
            con.query(sql,[symbol],(err,result)=>{
                resolve(result);
             })
        })
      
    }

    priceOfCoinByExchange(coinSymbol,exchange){
        //grabs price by coin and exchage
        return new Promise((resolve,reject)=>{
            var sql="SELECT * FROM coins WHERE coin_symbol=? && Exchange_name=? ORDER BY timestamp DESC LIMIT 1";
            con.query(sql,[coinSymbol,exchange],(err,result)=>{
                resolve(result);
             })
        })
    }

    priceOfCoinByMarket(symbol,marketSymbol){
        return new Promise((resolve,reject)=>{
            var sql="SELECT * FROM coins WHERE market_symbol=? &&  coin_symbol=? ORDER BY timestamp DESC LIMIT 1";
            con.query(sql,[marketSymbol,symbol],(err,result)=>{
                resolve(result);
             })
        })  
    }
    priceOfCoinByExchangeAndMarket(symbol,marketSymbol,exchange){
        return new Promise((resolve,reject)=>{
            var sql="SELECT * FROM coins WHERE market_symbol=? &&  coin_symbol=? AND Exchange_name=? ORDER BY timestamp DESC LIMIT 1";
            con.query(sql,[marketSymbol,symbol,exchange],(err,result)=>{
                resolve(result);
             })
        })  
    }
    getAllCoinsByExchange(exchange){
        var sql="SELECT * FROM coins WHERE Exchange_name=?";
        //grabs all coins trading on exchange
        con.query(sql,[exchange],(err,result)=>{
            console.log(result);
            console.log(err);
        })
    }

    getAllCoinMarkets(coinSymbol){
        //grabs all coin markets
        return new Promise((resolve,reject)=>{
            var sql="SELECT DISTINCT(market_symbol) FROM coins WHERE coin_symbol=? ";
            con.query(sql,[coinSymbol],(err,result)=>{
                resolve(result);
             })
        })  
    }

    getAllCoinMarketsByExchange(coinSymbol,exchange){
        //grabs all the markets of a coin on a particular exchange
        return new Promise((resolve,reject)=>{
            var sql="SELECT DISTINCT(market_symbol) FROM coins WHERE coin_symbol=? AND Exchange_name=? ";
            con.query(sql,[coinSymbol,exchange],(err,result)=>{
                resolve(result);
             })
        })  
    }

    searchCoin(coinSymbol){
        return new Promise((resolve,reject)=>{
            var sql= "SELECT * FROM coins WHERE coin_symbol LIKE ?  ";
            con.query(sql,["%"+coinSymbol+"%"],(err,result)=>{
                if(err){
                    reject(err)
                }
                resolve(result);

            })
        })
         
    }

    allCoinsAtExchange(exchange){
        //returns all coins that are trading on given exchange
        return new Promise((resolve,reject)=>{
            con.query("SELECT DISTINCT(coin_symbol) FROM coins WHERE  Exchange_name=?",[exchange],(err,result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        })

    }

    coinAvailableAtWhatExchange(coinSymbol){
       //returns all exchanges a given coin is available at
       return new Promise((resolve,reject)=>{
        con.query("SELECT DISTINCT(Exchange_name) FROM coins WHERE coin_symbol=?",[coinSymbol],(err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve(result)
            }
        })
       })
        
    }

}
 

//news related

function createUsers_table(){
    var sql= "CREATE TABLE `users` (`ID` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,`joinedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,`username` varchar(255) NOT NULL,`passwordHash` text NOT NULL,`isAdmin` int(11) DEFAULT NULL) "
    con.query(sql,(err,result)=>{
        if(err){
            console.log("table already exists");
            return;
        }
        console.log("table created");
    })
}

function createEvents_table(){
var sql="CREATE TABLE `events` (`id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, `eventContent` text NOT NULL,`timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `addedBy` varchar(25) NOT NULL,`lat` varchar(255) NOT NULL,`lng` varchar(255) NOT NULL,`iconType` varchar(255) NOT NULL,`source` varchar(255) NOT NULL,`country` varchar(255) NOT NULL, `tag` varchar(255) NOT NULL,   `imageUrl` text NOT NULL) ";

    con.query(sql,(err,result)=>{
        if(err){
            console.log("table already exists");
        }else{
            console.log("events table created");
        }
    })
}

function createAvailableCoordinates_table(){

}

function twitterBotTweets_table(){
    var sql="CREATE TABLE `twitterbot` ( `ID` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,`eventContent` text NOT NULL,`timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,`source` varchar(255) NOT NULL,`isCoordinateAssigned` int(11) DEFAULT '0', `lat` varchar(255) DEFAULT NULL, `lng` varchar(255) NOT NULL)";
    con.query(sql,(err,result)=>{
        if(err){
            console.log("table already exists");
        }else{
            console.log("the twitter bot is created");
        }
    })
}

var addEvent= function(payload){
    return new Promise(function(resolve,reject){
        var eventText= payload.eventText;
        var addedBy=  payload.addedBy;
        var lat=     payload.lat;
        var lng=    payload.lng;
        var iconType= payload.iconType;
        var source=  payload.source;
        var country= payload.country;
        var tag=    payload.tag;
        var imageUrl= payload.imageUrl;
    
    
        var sql= "INSERT INTO events SET ?";
    
        con.query(sql,{
            eventContent:eventText,
            addedBy:addedBy,
            lat:lat,
            lng:lng,
            iconType:iconType,
            source:source,
            country:country,
            tag:tag,
            imageUrl:imageUrl
        },(err,result)=>{
            if(err){
                reject("error")
            }else{
                resolve("yes");
            }
        })
    
    })
    

}

var getAllEvents=function(){
    return new Promise(function(resolve,reject){
            //method gets all events
            var sql="SELECT * FROM events ORDER BY ID DESC";
            con.query(sql,(err,result)=>{
                if(err){
                    reject("no");
                }else{
                    resolve(result);
                }
            })
    })
    
}

var getAllEventsByCountry=function(country){
    return new Promise(function(resolve,reject){
            //method gets all events
            var sql="SELECT * FROM events WHERE country=? ORDER BY ID DESC";
            con.query(sql,[country],(err,result)=>{
                if(err){
                    reject("no");
                }else{
                    resolve(result);
                }
            })
    })
    
}

var getEventById =function(id){
    return new Promise(function(resolve,reject){
            //method gets all events
            var sql="SELECT * FROM events WHERE id=?";
            con.query(sql,[id],(err,result)=>{
                if(err){
                    reject("no");
                    console.log(err);
                }else{
                    resolve(result);
                }
            })
    })  
}


function init(){
    //method creates all the tables necessary
    createUsers_table();
    createEvents_table();
    twitterBotTweets_table();
    createNews_table();
    createNewsifyUsers_table();
    createComment_table();
    sourceItem_table();
    createMonopoly_table();
}


//connects to mysql database
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database:"maepletv3"
  });
  
  con.connect(function(err) {
    init();
    if (err) throw err;
    console.log("Connected!");
  });

var createUser=function(userData){
    return new Promise((resolve,reject)=>{
        const username=   userData.username;
        const password=   userData.password;
        let   passwordHash= sha256(password);
         let toAdd={
            username:username,
            passwordHash:passwordHash
        }
        let sql= "INSERT INTO users SET ?";
        con.query(sql,toAdd,(err,result)=>{
            if(err){
                reject("error")
                console.log(err);
            }else{
                resolve("msadded");
            }
        })
    })
     
}

var checkUnique=function(username){
    return new Promise((resolve,reject)=>{
        var sql= "SELECT username FROM users WHERE username= ?";
        con.query(sql,[username],(err,result)=>{
            if(err){
                reject("error");
            }else{
                if(result.length>=1){
                    resolve("exists");
                }else{
                    resolve("no");
                }
            }
            
        })
    })
     
}

var login= function(loginPayload){
    return new Promise((resolve,reject)=>{
        var username= loginPayload.username;
        var password= loginPayload.password;
        var passwordHash= sha256(password);
    
        var sql= "SELECT username,passwordHash FROM users WHERE username= ? AND passwordHash= ?";
    
        con.query(sql,[username,passwordHash],(err,result)=>{
            if(err){
                reject("error");
            }else{
                if(result.length==0){
                    resolve("no");
                }else{
                    resolve("yes");
                }
            }
            
        })
    })
   
}

 

var getProfile= function(username){
    sql="SELECT * FROM users WHERE username= ?";
    con.query(sql,[username],(err,result)=>{
        if (err) throw err;
        console.log(result);
    })
}


module.exports={
    checkUnique,
    createUser,
    login,
    getProfile,
    addEvent,
    getAllEvents,
    getAllEventsByCountry,
    getEventById,
    newsRelated,
    newsify_auto,
    commentv2,
    coinsRelated,
    Monopoly
}