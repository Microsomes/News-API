/*
responsible for the crawling of automatically storing news articles to the database
*/

const express= require("express");
const router= express.Router();

var axios= require("axios");
var cron = require('node-cron');

const MicrosomesDB = require("../../db/dbMySql");
var newsRelated= MicrosomesDB.newsRelated;
var nr= new newsRelated();

console.log("jobs");

var domain=null;
var isProduction=true;
//determines if the server should connect to local or production server

if(isProduction){
    domain="https://socialstation.info/"
}else{
    domain="http://localhost:4000/"
}

const LINK_TO_ADD=domain+"newsv2/add";
const LINK_TO_ADD_M=domain+"newsv2/addM";



function addToDB(e){
    //contacts the database and adds this info
    nr.addNews({...e})
   
}

//similar to addToDB but varied slightly
//required a longitude and landitude parameter
function addToDB_MAP(e){
    nr.addNewsM(e);
}



function crawl_UFC(){
    console.log("crawling ufc news");
    //method that connects to the ufc api and crawls it
    var ufc_news_endpoint="http://ufc-data-api.ufc.com/api/v3/us/news";

    axios.get(ufc_news_endpoint).then(function(res){
            var data= res["data"];
            data.forEach(e=>{
                var title= e.title;
                var time= e.created;
                var author= e.author;
                var image= e.thumbnail;
                var url= "http://www.ufc.com/news/"+e.url_name;
                var sourceImage="https://firebasestorage.googleapis.com/v0/b/social-station-69cfc.appspot.com/o/newsresearchapp%2F2000px-UFC_logo.svg.png?alt=media&token=88e009b8-1e13-46c7-af92-c10382b87718";
                addToDB({
                    "title":title,
                    "description":"n-a",
                    "source":"UFC",
                    "author":author,
                    "url":url,
                    "image":image,
                    "tag":"UFC",
                    "sourceImage":sourceImage,
                  
                })
            })
    },err=>{

    })
}
 
function crawlReddit(url,tagToSubmit){
    var link=url;
    axios.get(link).then(function(res){
        var data= res["data"];
         if(data["totalResults"]){
            var total= data["totalResults"];
            if(total>1){
                //time to cache
                for(var i=0;i<total;i++){
                var curData=data["articles"][i];
                var curTitle= curData.title;
                var curDescription= "n/a";
                var curImage= curData.urlToImg;
                var curUrl= curData.url;
                var source="reddit";
                var tag=tagToSubmit;
                var sourceImage="https://vignette.wikia.nocookie.net/hayday/images/1/10/Reddit.png/revision/latest?cb=20160713122603";
                var randi= Math.random();
                var author= curData.author;
                addToDB({
                    "title":curTitle,
                    "description":curDescription,
                    "source":source,
                    "author":author,
                    "url":curUrl,
                    "image":curImage,
                    "tag":tag,
                    "sourceImage":sourceImage
                })
                 
                }
 
                


            }
        }
         
    })
}

 
function crawlTelegraphHeadlines_init(){
crawlTelegraphHeadlines("https://socialstation.info/crawler/telegraph/headlines","headlines");
crawlTelegraphHeadlines("https://socialstation.info/crawler/telegraph/world","world");
crawlTelegraphHeadlines("https://socialstation.info/crawler/telegraph/politics","politics");
crawlTelegraphHeadlines("https://socialstation.info/crawler/telegraph/science","science");
crawlTelegraphHeadlines("https://socialstation.info/crawler/telegraph/education","education");
crawlTelegraphHeadlines("https://socialstation.info/crawler/telegraph/health","health");
crawlTelegraphHeadlines("https://socialstation.info/crawler/telegraph/brexit","brexit");
crawlTelegraphHeadlines("https://socialstation.info/crawler/telegraph/royals","royals");
crawlTelegraphHeadlines("https://socialstation.info/crawler/telegraph/investigations","investigations");
}
  


function crawlTelegraphHeadlines(url,tagToSubmit){
    var link=url;
    axios.get(link).then(function(res){
        var data= res["data"];
         if(data["totalResults"]){
            var total= data["totalResults"];
            if(total>1){
                //time to cache
                for(var i=0;i<total;i++){
                var curData=data["articles"][i];
                var curTitle= curData.title;
                var curDescription= "n/a";
                var curImage= curData.urlToImage;
                var curUrl= curData.link;
                var source="telegraph";
                var tag=tagToSubmit;
                var sourceImage="https://lovespace.co.uk/wp-content/uploads/2013/10/the-telegraph-logo.jpg";
                var randi= Math.random();
                var author= null;
                if(randi>0.2){
                    author="Chris Mahatman"
                }else if(randi>0.4){
                    author="Ivon upon thymes";
                }else if(randi>0.6){
                    author="Colby James";
                }else if(randi>0.8){
                    author="Rodion Rozhkovsky";
                }else{
                    author="Lian ipp";
                }
                addToDB( {
                    title:curTitle,
                    description:curDescription,
                    source:source,
                    author:author,
                    url:curUrl,
                    image:curImage,
                    tag:tag,
                    sourceImage:sourceImage
                  }) 
                }
 
                


            }
        }
         
    })
}


function crawlYahooHeadlines(url,tagToSubmit){
    var link=url;
    axios.get(link).then(function(res){
        var data= res["data"];
         if(data["totalResults"]){
            var total= data["totalResults"];
            if(total>1){
                //time to cache
                for(var i=0;i<total;i++){
                var curData=data["articles"][i];
                var curTitle= curData.title;
                var curDescription= curData.description;
                var curImage= curData.urlToImage;
                var curUrl= curData.url;
                var source="Yahoo";
                var tag=tagToSubmit;
                var sourceImage="https://vignette.wikia.nocookie.net/logopedia/images/8/84/Yahoo%21_18_Favicon.png/revision/latest?cb=20130825034903";
                var randi= Math.random();
                var author= null;
                if(randi>0.2){
                    author="Chris Mahatman"
                }else if(randi>0.4){
                    author="Ivon upon thymes";
                }else if(randi>0.6){
                    author="Jimmy Saval";
                }else if(randi>0.8){
                    author="Rodion Rozhkovsky";
                }else{
                    author="Bill Cosbey";
                }

                addToDB( {
                    title:curTitle,
                    description:curDescription,
                    source:source,
                    author:author,
                    url:curUrl,
                    image:curImage,
                    tag:tag,
                    sourceImage:sourceImage
                  })
                }
 
                


            }
        }
         
    })
}

//returns a random author
function randomAuthor(){
    var randi= Math.random();
    var author= null;
    if(randi>0.2){
        return "Chris Mahatman"
    }else if(randi>0.4){
       return "Ivon upon thymes";
    }else if(randi>0.6){
        return "Sajjid";
    }else if(randi>0.8){
       return"Rodion Rozhkovsky";
    }else{
        return "The Notorious";
    }
}

function crawlYahoo_init(){
     crawlYahooHeadlines("https://socialstation.info/crawler/yahoo/headlines","headlines");
     crawlYahooHeadlines("https://socialstation.info/crawler/yahoo/us","usa");
     crawlYahooHeadlines("https://socialstation.info/crawler/yahoo/politics","politics");
     crawlYahooHeadlines("https://socialstation.info/crawler/yahoo/world","world");
}



async function scrapeLiveuamap_init(){
    const liveuamap = [
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
    liveuamap.forEach(e=>{
       
        sleep(5000).then(() => {
            //do stuff
            scrpeLiveuamap_scrape(e);
            console.log("----------------------");
          })
    })
}

function scrpeLiveuamap_scrape(tag){

    var tagTo=tag;
    //which tag is used

const LIVEUAMAP= require("liveuamp_scraper_pro");
const LIVEUAMAP_SCRAPE= LIVEUAMAP.crawlLiveMap;
const LIVEUAMAP_COORD= LIVEUAMAP.grabCoordinations;
    LIVEUAMAP_SCRAPE(tagTo).then(data=>{
      
        LIVEUAMAP_COORD(data).then(coords=>{

            var tota= coords.length;
            for(var i=0;i<tota;i++){
                var onw= coords[i];
                var curData=onw;
            var lat= onw.coordinates.cor.lat;
            var lng= onw.coordinates.cor.lng;
          ///*
            /*
            templates 

            */
           var curTitle= curData.title;
            var curDescription= "---";
            var curImage= curData.urlToImage;
            var curUrl= curData.url;
            var source="Liveuamap";
            var tag=tagTo;
            var sourceImage="https://vignette.wikia.nocookie.net/logopedia/images/8/84/Yahoo%21_18_Favicon.png/revision/latest?cb=20130825034903";
            var author=randomAuthor();

            console.log(curTitle);
            console.log(curImage);
            console.log(curUrl);
          

            addToDB_MAP({
                title:curTitle,
                description:"---",
                source:"liveuamap",
                author:author,
                url:curUrl,
                image:curImage,
                tag:tag,
                sourceImage:"https://pbs.twimg.com/profile_images/941334986313076736/681FnRJ0_400x400.jpg",
                lat:lat,
                lng:lng
              })



            }

            
           
        })  
    })
 
}

function crawlReddit_init(){
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
    crawlReddit("https://socialstation.info/crawler/reddit/Gameidea","Gameidea")
    crawlReddit("https://socialstation.info/crawler/reddit/FORTnITE","FORTnITE")
    crawlReddit("https://socialstation.info/crawler/reddit/JibrelNetwork","JibrelNetwork")

    crawlReddit("https://socialstation.info/crawler/reddit/AskReddit","AskReddit")
    crawlReddit("https://socialstation.info/crawler/reddit/politics","politics")
    crawlReddit("https://socialstation.info/crawler/reddit/The_Donald","The_Donald")

    crawlReddit("https://socialstation.info/crawler/reddit/worldnews","worldnews")
    crawlReddit("https://socialstation.info/crawler/reddit/nba","nba")  
    crawlReddit("https://socialstation.info/crawler/reddit/videos","videos")

    crawlReddit("https://socialstation.info/crawler/reddit/funny","funny")
    crawlReddit("https://socialstation.info/crawler/reddit/gaming","gaming")
    
 

    }
 
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
async function runCrawler(){
    console.log("running crawler this could take a min");
    await sleep(2000);

    // scrpeLiveuamap_init();
    scrapeLiveuamap_init();
     await sleep(2000);

   crawlYahoo_init();
   await sleep(2000);

    crawlTelegraphHeadlines_init();
    await sleep(2000);

    // crawlReddit_init();
    // await sleep(2000);

    scrapeNewsApiOrgRelated_init();
    await sleep(2000);
    console.log("scrape job completed");
    // crawl_maeplet();

    crawl_UFC();
    //crawls ufc

}
 
   cron.schedule('0 0 */3 * * *', function(){
     console.log('running a task every minute');
     runCrawler();
   });
 // runCrawler();

 

 

 router.get("/runjob",(req,res,next)=>{
    runCrawler();
    
     res.status(200).json({
         msg:"running job the scraper should scrape around 200-500 articles "
     })
 })



//crawl  and cache liveuamap

//end points to scrape

function crawl_maeplet(){
    console.log("crawling maeplet");
    //crawls maeplet to add new data
    var url="https://socialstation.info/maeplet/events";
    axios.get(url).then(function(res){
        var tots=res["data"].totalResults;
        for(var i=0;i<tots;i++){
        var curData= res["data"].events[i];
        var curID= curData["id"];
        var curContent= curData["eventContent"];
        var curLat= curData["lat"];
        var curLng= curData["lng"];
        var curAuthor= curData["addedBy"];
        var curTag= curData["country"];
        var curImage= curData["imageUrl"];
        var curUrl= curData["source"];
        addToDB({
            title:curContent,
            description:"---",
            source:"maeplet",
            author:curAuthor,
            url:curUrl,
            image:curImage,
            tag:curTag,
            sourceImage:"https://pbs.twimg.com/profile_images/849355876792238080/pKS9_NCk_400x400.jpg",
            lat:curLat,
            lng:curLng
          })
        }
     })
}
 function scrapeLiveuamap(scrapeUrl,tagtosubmit){
    var scrapeUrl=scrapeUrl;

    axios.get(scrapeUrl).then(function(res){
        var data= res["data"];
         if(data["totalResults"]){
            var total= data["totalResults"];
             if(total>1){
                //time to cache
                for(var i=0;i<total;i++){
                var curData=data["articles"][i];
                var curTitle= curData.title;
                var curDescription= "n/a";
                var curImage= curData.urlToImage;
                var curUrl= curData.url;
 
                var source="Liveuamap";
                var tag=tagtosubmit;
                var sourceImage="https://pbs.twimg.com/profile_images/941334986313076736/681FnRJ0_400x400.jpg";
                var randi= Math.random();
                 if(randi>0.2){
                    author="Chris Mahatman"
                }else if(randi>0.4){
                    author="Ivon upon thymes";
                }else if(randi>0.6){
                    author="Jimmy Saval";
                }else if(randi>0.8){
                    author="Rodion Rozhkovsky";
                }else{
                    author="Bill Cosbey";
                }


                 axios.post(LINK_TO_ADD, {
                    title:curTitle,
                    description:curDescription,
                    source:source,
                    author:author,
                    url:curUrl,
                    image:curImage,
                    tag:tag,
                    sourceImage:sourceImage
                  })
                  .then(function (response) {
                    console.log(response);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
                }
 
                


            }
        }
         
    })
}

 
 


//crawl  and cache maeplet

//end points to scrape

///maeplet/events/united kingdom
///maeplet/events/ukraine
///maeplet/events/syria
///maeplet/events/mideast
///maeplet/events/europe
///maeplet/events/america
///maeplet/events/asia
///maeplet/events/world
///maeplet/events/africa




//crawl and cache telegrpah
//end points to scrape and cache

// /telegraph/headlines
// /telegraph/world
// /telegraph/politics
// /telegraph/science
// /telegraph/education
// /telegraph/health
// /telegraph/brexit
// /telegraph/royals
// /telegraph/investigations

//crawl and cache reddit
//reddit end points to scrape and cache
//reddit/tag--{{subreddit name}}
function scrapeNewsApiOrgRelated(scrapeUrl,tagtosubmit,sourceName,sourceImagePassed){
    var scrapeUrl=scrapeUrl;

    axios.get(scrapeUrl).then(function(res){
        var data= res["data"];
         if(data["totalResults"]){
            var total= data["totalResults"];
             if(total>1){
                //time to cache
                for(var i=0;i<total;i++){
                var curData=data["articles"][i];
                var curTitle= curData.title;
                var curDescription= "n/a";
                var curImage= curData.urlToImage;
                var curUrl= curData.url;
 
                var source=sourceName;
                var tag=tagtosubmit;
                var sourceImage=sourceImagePassed;
                author= curData.author;

                    
                  addToDB( {
                    title:curTitle,
                    description:curDescription,
                    source:source,
                    author:author,
                    url:curUrl,
                    image:curImage,
                    tag:tag,
                    sourceImage:sourceImage
                  })
                }
 
                


            }
        }
         
    })
}
 
function scrapeNewsApiOrgRelated_init(){
    scrapeNewsApiOrgRelated("https://socialstation.info/news/newsapi/bbc-sport,headlines,newsapiorg","headlines","bbc sport","https://m.files.bbci.co.uk/modules/bbc-morph-sport-opengraph/1.1.1/images/bbc-sport-logo.png");
    scrapeNewsApiOrgRelated("https://socialstation.info/news/newsapi/bbc-news,headlines,newsapiorg","headlines","bbc news","https://m.files.bbci.co.uk/modules/bbc-morph-news-waf-page-meta/2.2.2/bbc_news_logo.png");
    scrapeNewsApiOrgRelated("https://socialstation.info/news/newsapi/axios,headlines,newsapiorg","headlines","axios","https://upload.wikimedia.org/wikipedia/commons/d/d8/Axios.png");
    scrapeNewsApiOrgRelated("https://socialstation.info/news/newsapi/buzzfeed,headlines,newsapiorg","headlines","buzzfeed","https://www.buzzfeed.com/static-assets/img/buzzfeed_arrow.e86a786d9e5e2250e1ed3e0ec95ba42d.png");
    scrapeNewsApiOrgRelated("https://socialstation.info/news/newsapi/daily-mail,headlines,newsapiorg","headlines","dailymail","https://www.verdict.co.uk/wp-content/uploads/2018/03/Daily-Mail.jpg");
    scrapeNewsApiOrgRelated("https://socialstation.info/news/newsapi/IGN,headlines,newsapiorg","headlines","ign","https://yt3.ggpht.com/a-/ACSszfFT7-tj_rusHUZvQMtz9G3n2ESMGgyTM-Lfxw=s900-mo-c-c0xffffffff-rj-k-no");

    scrapeNewsApiOrgRelated("https://socialstation.info/news/newsapi/abc-news,headlines,newsapiorg","headlines","abc news","http://www.abc.net.au/news/linkableblob/8413676/data/abc-news-og-data.jpg");

    scrapeNewsApiOrgRelated("https://socialstation.info/news/newsapi/bloomberg,headlines,newsapiorg","headlines","bloomberg","https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/New_Bloomberg_Logo.svg/1280px-New_Bloomberg_Logo.svg.png");

    scrapeNewsApiOrgRelated("https://socialstation.info/news/newsapi/engadget,headlines,newsapiorg","headlines","engadget","https://o.aolcdn.com/engadget/brand-kit/eng-logo-white.png");

    scrapeNewsApiOrgRelated("https://socialstation.info/news/newsapi/the-verge,headlines,newsapiorg","headlines","the verge","https://www.underconsideration.com/brandnew/archives/the_verge_2016_logo.png");

     
     
}
 
//crawl and cache bbc sport
  



//crawl and cache bbc news
//https://socialstation.info/news/newsapi/bbc-news,headlines,newsapiorg


//crawl and cache axios
//https://socialstation.info/news/newsapi/axios,headlines,newsapiorg




//crawl and cache buzzfeed
//https://socialstation.info/news/newsapi/buzzfeed,headlines,newsapiorg


//crawl and cache daily mail
//https://socialstation.info/news/newsapi/daily-mail,headlines,newsapiorg


//crawl and cache IGN
//https://socialstation.info/news/newsapi/IGN,headlines,newsapiorg

module.exports=router;