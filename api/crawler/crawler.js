const express= require("express");
const router= express.Router();
var Xray = require('x-ray');
var x = Xray();
const request= require("request");
var fs = require('fs');
var _= require("underscore")
let moment = require('moment');
const axios= require("axios");
const apicache =  require( 'apicache' );

let cache = apicache.middleware;

router.use(cache('120 minutes'));


 

 
 

 

 

function crawlTelegraph(res,link,cat){
    var articles=[

      ];

      //connect to network to scrape data
      x(link,'div',[
            {
                title:'.list-of-entities__item-body-headline' ||null,
                description:'.buzzard__summary'||null,
                link:'.list-of-entities__item-body-headline a@href'||null,
                urlToImage:'img@src'||null,
                date:'.m_meta-property__date-date'||null,
                categories:'.mini-info-list__section'||null,
                time:'.m_meta-property__date-time',
             
            }
        ]).then(data=>{
            var articles=[];

            data.forEach(function(content){
                var content= content;
                var date= content.date;
                    var dateJ = new Date(date) // or
                    var ts=moment(date).format();

                     
                content.publishedAt=ts;
                content.categories=cat;
                articles.push(content);
            })
            
            articles= articles.filter(function(item,index){
                if(item.urlToImage && item.title && item.date && item.time && item.link){
                    item.author="telegrpah";
                    item.description="---";
                    item.source={
                        id:"Telegraph",
                        name:"Telegraph"
                    }
                    return item;
                }
            })
      
            articles= _.uniq(articles,function(item,key,title){
                return item.title
            })
            var total= articles.length;

            res.status(200).json({
                status:"scraped from telegraph live not cached",
                totalResults:total,
                articles,
              })
        })
      
}//end of crawl telegraph

function relap(){
    //helper method returns data once
}

//method is used to crawl all sources 
function crawlGeneric(link,tagSelectors,res){
    // title:'.list-of-entities__item-body-headline' ||null,
    // description:'.buzzard__summary'||null,
    // link:'a@href'||null,
    // img:'img@src'||null,
    // date:'.m_meta-property__date-date'||null,
    // categories:'.mini-info-list__section'||null,
    // time:'.m_meta-property__date-time'

    var selector_title=                    tagSelectors.titleTag;
    var selector_description=              tagSelectors.descriptionTag;
    var selector_link=                     tagSelectors.linkTag;
    var selector_img=                      tagSelectors.imgTag;
    var selector_date=                     tagSelectors.dateTag;
    var selector_categories=               tagSelectors.categoriesTag;
    var selector_time=                     tagSelectors.timeTag;

    var selector_source_name=              tagSelectors.souceMeta.source.name;
    var selector_source_categories=        tagSelectors.souceMeta.categories;

            x(link,'div',[
            {
                title:selector_title,
                description:selector_description,
                url:selector_link,
                urlToImage:selector_img,
                date:selector_date,
                categories:selector_categories,
                time:selector_time
            
            }
        ]).then(data=>{
            var articles=[];

            data.forEach(function(content){
                var content= content;
                var date= content.date;
                var dateJ = new Date() // or
                var ts=moment(date).format();
                content.publishedAt=ts,
                content.categories=selector_source_categories
                content.source={
                    name:selector_source_name,
                  
                }
                articles.push(content);
            })
            
            articles= articles.filter(function(item,index){
                if(item.urlToImage && item.title && item.date){
                    return item;
                }else{

                    //see if we need to do a relap since some data featrures are



                    item.date=null;
                    item.urlToImage=null;
                    item.description=null;
                     return item;
                }
            })
      
            articles= _.uniq(articles,function(item,key,title){
                return item.title
            })
            var total= articles.length;

            res.status(200).json({
                status:"generic scraped from telegraph live not cached",
                totalResults:total,
                articles,
            })
        })


}//crawlGeneric method



router.post("/generic",(req,res,next)=>{

    // console.log(req.body);
    console.log("...............myname");
    console.log(req.body);
    var url= req.body.souceMeta.link;
    var source= req.body.souceMeta.source.name;
    var categories= req.body.souceMeta.categories;
    
    crawlGeneric(url,{
        ...req.body
    },res);
     
})

function crawlYahoo(url){
    //function takes a url
    return new Promise(function(resolve,reject){

        x(url,'div.Cf',[
            {
                 title:'h3',
                description:"p",
                urlToImage:"img@src",
                url:"a@href",
                publishedAt:x("a@href",".date"),
                author:x("a@href",".author-name")
                // description:'.buzzard__summary'||null,
                // link:'.macaw-item__body a@href'||null,
                // urlToImage:'img@src'||null,
                // date:'.m_meta-property__date-date'||null,
                // categories:'.mini-info-list__section'||null,
                // time:'.m_meta-property__date-time',
             
            }
        ]).then(data=>{
            resolve(data);
        });
        
    })
}

//check if the cache is expired or not
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

 
 

router.get("/yahoo/:tag",(req,res,next)=>{
    var url=null;
    var tag= req.params.tag;

    switch(tag){
        case "headlines":
        url="https://www.yahoo.com/news/";
        break;
        case "us":
        url="https://www.yahoo.com/news/us/";
        break;
        case "politics":
        url="https://www.yahoo.com/news/politics/";
        break;
        case "world":
        url="https://www.yahoo.com/news/world/"
        break;
        default:
        url="https://www.yahoo.com/news/";
        tag="headlines";
        break;
    }

    crawlYahoo(url).then(data=>{
         var total= data.length;
        res.status(200).json({
            status:"scraped direcly from yahoo",
            totalResults:total,
            articles:data,
        });
    }).then(err=>{
        res.status(200).json({
            err:'not able to scrape'
        });
    })
     
})

router.get("/telegraph/:tag",(req,res,next)=>{
    var url=null;
    var tag= req.params.tag;
    tag= tag.toLowerCase();
    switch(tag){
        case "headlines":
        url="https://www.telegraph.co.uk/news/";
        break;
        case "world":
        url="https://www.telegraph.co.uk/news/world/";
        break;
        case "politics":
        url="https://www.telegraph.co.uk/politics/";
        break;
        case "science":
        url="https://www.telegraph.co.uk/science/";
        break;
        case "education":
        url="https://www.telegraph.co.uk/education/";
        break;
        case "health":
        url="https://www.telegraph.co.uk/health/";
        break;
        case "brexit":
        url="https://www.telegraph.co.uk/brexit/";
        break;
        case "royals":
        url="https://www.telegraph.co.uk/the-royal-family/";
        break;
        case "investigations":
        url="https://www.telegraph.co.uk/news/investigations/";
        break;
        default:
        url="https://www.telegraph.co.uk/news";
        tag="headlines";
        break;
    }
 

    crawlTelegraph(res,url,tag);
})

router.get("/liveuamap/:tag",(req,res,next)=>{
    var tag= req.params.tag;
    const liveuamap=[
        'syria',
        'ukraine',
        'isis',
        'mideast',
        'europe',
        'america',
        'asia',
        'world',
        'africa',
        'usa',
        "pakistan" 
    ]

     crawlLiveMap(res,tag);
})

router.get("/reddit/:tag",(req,res,next)=>{
    var tag= req.params.tag;
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
    var url= "https://www.reddit.com/r/"+tag+".json";


    axios.get(url).then(data=>{
        var arrdata=data["data"].data["children"];
        var tota= arrdata.length;
        var thumbnail= "https://vignette.wikia.nocookie.net/roosterteeth/images/1/10/Reddit.png/revision/latest?cb=20171218051745";
        var cur= arrdata[0];
        var curData=cur["data"];
        var author= curData["author"];
        var timestamp= curData["created_utc"];
        var title= curData["title"];
        var articles=[];
        
        arrdata.forEach(content=>{
            let titles= content["data"]["title"];
            let author= content["data"]["author"];
            let timestamp=  content["data"]["created_utc"];
            
             
            timestamp = moment.unix(timestamp).format();

            var thumbnails= content["data"]["thumbnail"]|| thumbnail;
            if(thumbnails=="self"){
                thumbnails=thumbnail;
            }
            let ts= moment(timestamp).format();
            var description= "---"
            var url= content["data"]["url"];
            
            articles.push({
                title:titles,
                author,
                publishedAt:ts,
                description,
                url,
                urlToImg:thumbnails
            })
        })

        
        res.status(200).json({
            status:"scraped from reddit",
            totalResults:tota,
            articles,
        })
    }).catch(err=>{
        console.log("errored");
        console.log(err);
        res.status(200).json({
            articles:[]
        })
    })
    
})

router.get("/",(req,res,next)=>{
    res.status(200).json({
        msg:'crawler reporting'
    })
})


module.exports=router;