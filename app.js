const express = require('express');
const app = express();

const morgan= require('morgan');
const bodyParser= require('body-parser');
 const crawler= require("./api/crawler/crawler");
 const cons= require("./api/conspiracies/conspiracies");
 const newsapi = require("./api/newsapi/main");
 const newNewsapi= require("./api/refactoredNewsapi/newsapi");

 const boxingapi= require("./api/boxing/boxing");

 const neverendingfactsapi= require("./api/neverendingfacts/neverending");

 const jobs= require("./api/refactoredNewsapi/crawlerJob/job");

 const commentV2= require("./api/commentv2/comment");

 const imageUploader= require("./api/imageUploader/image");

 const coinsapi= require("./api/coins/coins");
 //coinsapi

 app.use('/images', express.static('images'))



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    if(req.method=="OPTIONS"){
        res.header("Access-Control-Allow-Methods","*");
        return res.status(200).json({
            
        })
    }
    next();
   });

 
// //apply a 30 minute cache to all routes

const maeplet= require("./api/maeplet/main");
 
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended:false
}));
app.use(bodyParser.json());
app.use("/maeplet",maeplet);
app.use("/crawler",crawler);
app.use("/cons",cons);
app.use("/news",newsapi);
app.use("/newsv2",newNewsapi);
app.use("/runjob",jobs);
app.use("/boxing",boxingapi);
app.use("/neverending",neverendingfactsapi);
 app.use("/commentv2",commentV2);
 app.use("/coins",coinsapi);
 app.use("/upload",imageUploader)


 
 
app.use((req,res,next)=>{
    const error= new Error("not found");
    error.status(404);
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(500);
    res.json({
        messages:"please check if the end point is correct, if you still have problems contact tayyab720@hotmail.com"
    });
});



module.exports= app;