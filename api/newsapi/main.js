const express= require("express");
const router= express.Router();

var newsapiorgapikey= "82b8c4944c734f8c80aedbad7c29f299";

const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(newsapiorgapikey);

// var db= require("./../db/db").db;
//access firestore database
var moment = require('moment');

const CACHE_TIME=2880;
//cache time


function apiCall(){
    console.log("api called----");
}

router.get("/newsapi/",(req,res,next)=>{
    console.log(req.params.tagsourceify);



    res.status(200).json({
    message:'missing tag,source'
    });
})





function cache_query_eveything(query,result){
    // //method contacts the database and caches results
    // apiCall();

    // db.collection("everything_cache").add({
    //     q:query,
    //     timeAccessed:moment().format(),
    //     ...result
    // })

}

function isExpired(lastAccessed,timeToExpiry){
    var now= moment(new Date());
    var end= moment(lastAccessed);
    var duration= moment.duration(now.diff(end));
    var minutes= duration.asMinutes();
    if(minutes>timeToExpiry){
      return true;
    }else{
      return false;
    }
  }

function cache_query_everything_applicable(res,query){
 
            newsapi.v2.everything({
                q:query
             }).then(response => {

             
               var articles= response["articles"];
               var totalResults= articles.length;
               res.status(200).json({
                   status:"direct from the newsapi.org api",
                   totalResults,
                   articles
               })
             }).catch(err=>{
                  
            })
           
  

    //checks if we should use the cache of available or not
    //true - use cahce
    //false - do not use cache too old or not available
    return false;
}

function newsapi_everything_query(res,query){
    if(res && query){

        //check if the query being accessed has been cahced in the past
        cache_query_everything_applicable(res,query);
        

    }else{
        console.warn("newsapi_everything_query missing parameters");
    }
    
}

function cache_newsapi_souce_tag_add(tagify,result){
    // apiCall();

    // db.collection("newsapiorg_cahce").add({
    //     timeAccessed:moment().format(),
    //     tag:tagify,
    //     ...result
    // })
}

function cache_newsapi_souce_tag(res,tagify){

     
            console.log("no cahce");
            let tagifySlit= tagify.split(",");
            let source= tagifySlit[1];
            let tag= tagifySlit[0];

            newsapi.v2.everything({
                sources: source,
                q:tag
              }).then(response => {

 
                var articles= response["articles"];
                var totalResults= articles.length;
                res.status(200).json({
                    status:"live from newsapi.org",
                    totalResults,
                    articles
                })
              }).catch(err=>{
                  
              })

          
             
       
    
}

function tagify_m(tag,source){
    return tag+","+source
}

function grabNewsApi(res,tag,source){
    if(res && tag && source){
       if(tag=="headlines"){
        console.log("----headlines requested");
        apiCall();
 
                newsapi.v2.topHeadlines({
                    sources: source,
                  }).then(response => {
                     var articles= response["articles"];
                    var totalResults= articles.length;
                    res.status(200).json({
                        status:"live from newsapi.org",
                        totalResults,
                        articles
                    })
                  }).catch(err=>{
                       
                 })

           }else{
           
            cache_newsapi_souce_tag(res,tagify_m(tag,source));


 
            //    newsapi.v2.everything({
            //        sources: source,
            //        q:tag
            //      }).then(response => {
            //         cache_newsapi_souce_tag_add(tagify_m(tag,source),response);
            //         var articles= response["articles"];
            //        var totalResults= articles.length;
            //        res.status(200).json({
            //            status:"ok",
            //            totalResults,
            //            articles
            //        })
            //      });
           }
          
}else{
    return;
}

}

function grabNews(type,source,tag,res){
    if(type && source && tag && res){
        switch(type){
            case "generic":
            res.status(200).json({
                message:'generic'
            });
            break;
            case "newsapiorg":
            grabNewsApi(res,tag,source);
            break;
            default:
            res.status(200).json({
                message:'type mismatch error'
            });
            break;
        }
    }else{
        console.warn("fields from grabNews method missing");
    }
     
}

router.get("/newsapi/:tagsourceify",(req,res,next)=>{
    var data= req.params.tagsourceify.split(",");
    var source= data[0];
    var tag= data[1];
    var type= data[2];

    if(source && tag && type){
        //we have source and tag
         grabNews(type,source,tag,res);
         
    }else{
        res.status(200).json({
            message:'source or tag or type missing please use a commar to split source from tag'
        });
    }

     
})

router.get("/everything/",(req,res,next)=>{
    
    res.status(200).json({
        message:'eveything requrires a query e.g /bitcoin'
    })
})

router.get("/everything/:query",(req,res,next)=>{

    newsapi_everything_query(res,req.params.query);
    
})

router.get("/sources/",(req,res,next)=>{
    res.status(200).json({
        message:'souces parameter missing send a type e.g /entertainment'
    })
})

function cache_sources_add(category,response,tots){
    

    // db.collection("newsapiorg_sources_cache").add({
    //     totalResults:tots,
    //       category,
    //     ...response
    // });
}

function cahce_sources(category,res){

     
    
            newsapi.v2.sources({
                category: category,
                language: 'en',
                country: 'us'
              }).then(response => {
 
                var sources=response["sources"]
                res.status(200).json({
                    status:"ok",
                    totalResults:sources.length,
                    sources,
                })
                var tots=sources.length;
 
                 
              });
           
            }

    


router.get("/sources/:query",(req,res,next)=>{

    if(req.params.query=="bbc"){
        const bbc=[
           "BBC News",
           "BBC Sport" 
        ]
    
        var sources=[];
    
        bbc.forEach(content=>{
            sources.push({name:content});
        })

        res.status(200).json({
            totalResults:10,
            sources
        })
        return;
    }

    if(req.params.query=="yahoo"){
        const yahoo=[
           "headlines",
           "us",
           "politics",
           "world"     
        ]
    
        var sources=[];
    
        yahoo.forEach(content=>{
            sources.push({name:content});
        })

        res.status(200).json({
            totalResults:10,
            sources
        })
        return;
    }


    if(req.params.query=="reddit"){
        const popularSubReddits=[
            "Gameidea",
            "FORTnITE",
            "JibrelNetwork",
            "AskReddit",
            "politics",
            "The_Donald",
            "worldnews",
            "nba",
            "videos",
            "funny",
            "todayilearned",
            "soccer",
            "CFB",
            "pics",
            "gaming",
            "movies",
            "news",
            "gifs",
            "nfl",
            "relationships",
            "television",
            "Jokes",
            "Bitcoin",
            "science",
            "MMA",
            "Tinder",
            "pcmasterrace",
            "europe"
        ]
    
        var sources=[];
    
        popularSubReddits.forEach(content=>{
            sources.push({name:content});
        })

        res.status(200).json({
            totalResults:10,
            sources
        })
        return;
    }

    if(req.params.query=="telegraph"){
        const telegrpahSources=[
            "headlines",
            "World",
            "Politics",
            "Science",
            "Education",
            "Health",
            "Brexit",
            "Royals",
            "Investigations"  
        ]
    
        var sources=[];
    
        telegrpahSources.forEach(content=>{
            sources.push({name:content});
        })

        res.status(200).json({
            totalResults:10,
            sources
        })
        return;

     }
    if(req.params.query=="liveuamap"){
        const popularSubReddits=[
            'syria',
            'ukraine',
            'isis',
            'mideast',
            'europe',
            'america',
            'asia',
            'world',
            'africa',
            'usa'       
        ]
    
        var sources=[];
    
        popularSubReddits.forEach(content=>{
            sources.push({name:content});
        })

        res.status(200).json({
            totalResults:10,
            sources
        })
        return;
    }

    if(req.params.query=="conspiracies"){
        const popularSubReddits=[
            
            "Headlines",
            "Bitcoin",
            "Politics"
          
             
        ]
    
        var sources=[];
    
        popularSubReddits.forEach(content=>{
            sources.push({name:content});
        })

        res.status(200).json({
            totalResults:10,
            sources
        })
        return;
    }

    if(req.params.query=="everything"){
        
                console.log("no cache");
                //no cache
                newsapi.v2.sources({
                    language: 'en',
                    pageSize:100
                   }).then(response => {
                    var sources=response["sources"]
                    res.status(200).json({
                        status:"ok",
                        totalResults:sources.length,
                        sources,
                    })
                    var tots= sources.length;s                    
                    
                  });
            }
})

router.get("/",(req,res,next)=>{
    res.status(200).json({
        message:"Getting news use news/newsapi to get newsapi news"
    });
})

module.exports= router;