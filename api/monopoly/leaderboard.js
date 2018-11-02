/*
@author Muhammed T Javed
@date 1/11/18
@description- Monopoly leaderboard system
*/
const express= require("express");
const router= express.Router();

const db= require("..//db/dbMySql.js");
const monopoly= new db.Monopoly();



router.get("/all",(req,res,next)=>{
    monopoly.grabAllEntries().then(data=>{
        res.status(200).json({
            monopoly:data
        })
    })
})
router.get("/all/wins",(req,res,next)=>{
    monopoly.grabAllEntries_by_wins().then(data=>{
        res.status(200).json({
            monopoly:data
        })
    })
})

router.get("/all/wins/best",(req,res,next)=>{
    monopoly.grabAllEntries_by_wins_best().then(data=>{
        res.status(200).json({
            monopoly:data
        })
    })
})


router.get("/profile/:id",(req,res,next)=>{
    var id= req.params.id;
    monopoly.getEntryById(id).then(data=>{
      checkNull(data,res);
    })
})

function checkNull(data,res){
    if(data.length<=0){
        res.status(200).json({
            non:"non"
        })
    }else{
        res.status(200).json({
            results:data
        })
    }
}

router.get("/search/:method/:query",(req,res,next)=>{
    var method= req.params.method;
    var query= req.params.query;

    switch(method){
        case "name":
        monopoly.searchEntry(query).then(data=>{
            checkNull(data,res);
        })
        break;
        case "xbox":
        monopoly.searchEntry_xbox(query).then(data=>{
            checkNull(data,res);

        })
        break;
        case "psn":
        monopoly.searchEntry_psn(query).then(data=>{
            checkNull(data,res);

        })
        break;
        case "steam":
        monopoly.searchEntry_steam(query).then(data=>{
            res.status(200).json({
                results:data
            })
        })
        break;
    }
})

router.get("/inc/:id",(req,res,next)=>{
    var id= req.params.id;
    monopoly.incrementWins(id).then(status=>{
        res.status(200).json({
            result:status
        })
    }).catch(err=>{

    })
})


router.get("/",(req,res,next)=>{    
    res.status(200).json({
        msg:'Welcome to Monopoly the unofficial monopoly leaderboard'
    })
})

















module.exports=router;