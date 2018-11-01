const express = require('express');
const router= express.Router();

var moment = require('moment');

var db= require("./../db/db").db;
//access firestore database

 
router.get("/getConspiracies/:filter",(req,res,next)=>{
     console.log(req.params.filter);
    getCons(req.params.filter,res);
})

router.post("/addCons/:tag",(req,res,next)=>{
     const postData=req.body;
     const tag= req.params.tag;

     if(req.body){
        createConspiraciy({
            postData
        },tag)
    }else{
        console.log("no data to add comment");
    }
    
    res.status(200).json({
        message:'adding'
    })

})

function getCons(tag,res){

    var res=res;
     
    
    //method grabs conspiracies from firebase based on tag
    switch(tag){
        case "headlines":
        //get conspiracies filtered by top headline
        db.collection("conspiracies").where("tag","==","headlines").get().then(data=>{
             if(data.empty){
                 //no conspiracies
                 res.status(200).json({
                    message:'n/a'
                })
             }else{
                var toSend=[];
                
                data.forEach(da=>{
                    toSend.push(da.data());
                })

                 res.status(200).json({
                    status:"ok",
                    totalResults:toSend.length,
                     articles:toSend
                 })
             }
        }).catch(err=>{
            res.status(200).json({
                status:"err",   
             })
        })
        break;
        case "bitcoin":
        //get bitcoin related conspiracies
        //get conspiracies filtered by top headline
        db.collection("conspiracies").where("tag","==","bitcoin").get().then(data=>{
            if(data.empty){
                //no conspiracies
                res.status(200).json({
                   message:'n/a'
               })
            }else{
               var toSend=[];
               
               data.forEach(da=>{
                   toSend.push(da.data());
               })

                res.status(200).json({
                   status:"ok",
                   totalResults:toSend.length,
                    articles:toSend
                })
            }
       }).catch(err=>{
           res.status(200).json({
               status:"err",   
            })
       })

        break;
        case "politics":
        //get politics related conspiracies
        db.collection("conspiracies").where("tag","==","politics").get().then(data=>{
            if(data.empty){
                //no conspiracies
                res.status(200).json({
                   message:'n/a'
               })
            }else{
               var toSend=[];
               
               data.forEach(da=>{
                   toSend.push(da.data());
               })

                res.status(200).json({
                   status:"ok",
                   totalResults:toSend.length,
                    articles:toSend
                })
            }
       }).catch(err=>{
           res.status(200).json({
               status:"err",   
            })
       })

        break;
        default:
        res.status(200).json({
            message:'n/a'
        })
        break;
    }

   


}

function createConspiraciy(data,tag){
    var data= data.postData;
    console.log(data);
    var keys= data.title+moment().format();
     //method adds a conspiracy to the firestore database
    db.collection("conspiracies").doc(keys).set({
        keys:keys,
        source:data.source,
        author:data.author,
        title:data.title,
        description:data.description,
        url:data.url,
        urlToImage:data.urlToImage,
        publishedAt:data.publishedAt,
        content:data.content,
        tag,
    }).then(res=>{
        console.log(res);
    }).catch(err=>{
        console.log(err);
    })
}



router.use("/",function(req,res,next){
    res.status(200).json({
        message:"i am the conspiracies"
    });
});

 

module.exports= router;