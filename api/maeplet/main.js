const express = require("express");
const router= express.Router();
 var jwt = require('jsonwebtoken');
 

const MicrosomesDB= require("./../db/dbMySql");
//grab connection object 

// MicrosomesDB.addEvent({
//     eventText:"Hi text",
//     addedBy:"Microsomes",
//     lat:"lat",
//     lng:"lng",
//     iconType:"default",
//     source:"twitterbot",
//     country:"country",
//     tag:"bitcoin"
// })
 
 
 
 

function sendMessage_placeholder(res,msg){
    res.status(200).json({
        msg,
    })
}

 

router.get("/profile/:username",(req,res)=>{
    const profileUsername= req.params.username;
    sendMessage_placeholder(res,"Returning user details for "+profileUsername);
})

router.post("/addEvent",verifyToken,(req,res)=>{
    jwt.verify(req.token,"secretkey",(err,authData)=>{
        if(err){
            res.sendStatus(403);
        }else{
            //token was verified time to add the event

           var eventText = req.body.eventText;
           var addedBy= authData.username;
           var lat= req.body.lat;
           var lng= req.body.lng;
           var iconType= req.body.iconType;
           var source= req.body.source
           var country= req.body.country;
           var tag= req.body.tag;  
           var imageUrl= req.body.imageUrl;   
            MicrosomesDB.addEvent({
                eventText:eventText,
                addedBy:addedBy,
                lat:lat,
                lng:lng,
                iconType:iconType,
                source:source,
                country:country,
                tag:tag,
                imageUrl:imageUrl
            }).then(data=>{
                res.status(200).json({
                    msg:"Added"
                })
            })








        }
    })
})


router.get("/events",(req,res,next)=>{
    MicrosomesDB.getAllEvents().then(data=>{
        var total= data.length;
        res.status(200).json({
            status:"ok",
            totalResults:total,
            events:data
        })
    })
})

router.get("/events/:country",(req,res,next)=>{
    MicrosomesDB.getAllEventsByCountry(req.params.country).then(data=>{
        var total= data.length;
        res.status(200).json({
            status:"ok",
            totalResults:total,
            events:data
        })
    })
 })
 router.get("/event/:id",(req,res,next)=>{
    MicrosomesDB.getEventById(req.params.id).then(data=>{
        var total= data.length;
        res.status(200).json({
            status:"ok",
            totalResults:total,
            events:data
        })
    })
 })

 


// router.post("/addFact",verifyToken,(req,res)=>{
//         jwt.verify(req.token,"secretkey",(err,authData)=>{
//             if(err){
//                 res.sendStatus(403);
//             }else{
//                 //we can add the fact since the user has been verified and authenticated
//                 let postPayload= req.body;
//                 const username= authData.username;
//                 const factContent= postPayload.factContent;
//                 const factTag=   postPayload.tag;
//                 MicrosomesDB.addFact({
//                     factContent:factContent,
//                     username:username,
//                     tag:factTag
//                  }).then(data=>{
//                     if(data=="yes"){
//                         res.status(200).json({
//                             msg:"Fact Added"
//                         })
//                     }
//                 }).catch(err=>{
//                     res.sendStatus(403);
//                 })
                
//             }
//         })


  
// })

router.post("/login",verifyCredentials,(req,res)=>{
    var username= req.body.username;

    jwt.sign({username},"secretkey",{expiresIn:"7d"},function(err,token){
        if(err){
            res.sendStatus(403);
        }else{
            res.status(200).json({
                username,
                token,
                msg:"Congratulations you have signed in"
            })
        }
    })
   
})


router.post("/signup",verifyUsernameIsUnique,(req,res)=>{
    const payLoad= req.body;
    const username=   payLoad.username;
    const password=   payLoad.password;

    MicrosomesDB.createUser({
        username:username,
        password:password
    }).then(data=>{
        if(data=="msadded"){
            console.log("user added");
            sendMessage_placeholder(res,"added");
        }
    }).catch(err=>{
        console.log(err);
        res.sendStatus(403);
    })

 
 })



router.get("/",(req,res)=>{
    res.status(200).json({
        msg:'i am the maeplet api docs coming soon'
    });
});

function verifyCredentials(req,res,next){
    //method verifies the login details the user submitted are correct
    let loginPayLoad= req.body;

    const username= req.body.username;
    const password= req.body.password;

    MicrosomesDB.login({
        username:username,
        password:password
    }).then(data=>{
        if(data=="yes"){
            //credientials verified
            next();
        }else{
            res.sendStatus(403);
        }
    }).catch(err=>{
        res.sendStatus(403);
    })

}

function verifyUsernameIsUnique(req,res,next){
    //method verifies if username trying to be logged in is unique or not
    const username= req.body.username;

    MicrosomesDB.checkUnique(username).then(data=>{

        if(data=="exists"){
            res.sendStatus(403);
        }else{
            next();
        }

    }).catch(err=>{
        res.sendStatus(403);
    })
     
}

function verifyToken(req,res,next){
    //method will verify token is valid
    const bearerHeader= req.headers["authorization"];
    if(bearerHeader !=undefined){
       const bearer= bearerHeader.split(" ");
       const bearerToken= bearer[1];
       req.token=bearerToken;
       next();
    }else{
        res.sendStatus(403);
    }
  
}






module.exports=router;