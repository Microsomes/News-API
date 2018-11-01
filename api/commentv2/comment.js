/*
new comments system for the newsify3.0 app
*/

var db= require("./../db/dbMySql").commentv2;
var comments= new db();

var express= require("express");
var router= express.Router();



router.get("/",(req,res,next)=>{
    res.status(200).json({
        msg:"commentv2 reporting"
    })
})


//route handles adding comment
router.post("/addComment",(req,res,next)=>{
    var body= req.body;
    comments.addComment({...body}).then(d=>{
        res.status(200).json({
            msg:"comment added"
        })
    }).catch(e=>{
        res.status(200).json({
            msg:"error adding comment"
        })  
    })
     
})

router.get("/getAllCommentsByPerson/:nameOfPerson",(req,res,next)=>{
    var createdBy= req.params.nameOfPerson;

    comments.getAllThreadsCreatedBy(createdBy).then(d=>{
        res.status(200).json({
            threads:d
        })
    }).catch(err=>{
        res.status(200).json({
            msg:"error"
        })
    })

     
})

router.get("/getRecentThreads",(req,res,next)=>{
     comments.getAllRecentCommentThreads().then(d=>{
        res.status(200).json({
            threads:d
        })
     }).catch(err=>{
         res.status(200).json({
             msg:"error grabbing threads"
         })
     })
     
})

router.get("/getCommentsByID/:articleID",(req,res,next)=>{
    var aid= req.params.articleID;
    console.log(aid);

    comments.getCommentsByArticleID(aid).then(d=>{
        res.status(200).json({
            status:"OK",
            comments:d
        })
    }).catch(err=>{
        res.status(200).json({
            status:"An error has been detected",
            err
        })
    })

     
})












module.exports=router;