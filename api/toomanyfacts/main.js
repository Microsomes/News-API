const express = require("express");
const router= express.Router();
 var jwt = require('jsonwebtoken');
 

const MicrosomesDB= require("./../db/dbMySql");
//grab connection object 

 
 
 

function sendMessage_placeholder(res,msg){
    res.status(200).json({
        msg,
    })
}

router.get("/facts",(req,res)=>{
    sendMessage_placeholder(res,"returns all facts");
})

router.get("/facts/:tag",(req,res)=>{
    const tag= req.params.tag;
    sendMessage_placeholder(res,"giving filtered facts by tag"+tag);
})

router.get("/profile/:username",(req,res)=>{
    const profileUsername= req.params.username;
    sendMessage_placeholder(res,"Returning user details for "+profileUsername);
})


router.post("/addFact",verifyToken,(req,res)=>{
        jwt.verify(req.token,"secretkey",(err,authData)=>{
            if(err){
                res.sendStatus(403);
            }else{
                //we can add the fact since the user has been verified and authenticated
                let postPayload= req.body;
                const username= authData.username;
                const factContent= postPayload.factContent;
                const factTag=   postPayload.tag;
                MicrosomesDB.addFact({
                    factContent:factContent,
                    username:username,
                    tag:factTag
                 }).then(data=>{
                    if(data=="yes"){
                        res.status(200).json({
                            msg:"Fact Added"
                        })
                    }
                }).catch(err=>{
                    res.sendStatus(403);
                })
                
            }
        })


  
})

router.post("/login",verifyCredentials,(req,res)=>{
    var username= req.body.username;

    jwt.sign({username},"secretkey",{expiresIn:"7d"},function(err,token){
        if(err){
            res.sendStatus(403);
        }else{
            res.status(200).json({
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
        res.sendStatus(403);
    })

 
 })



router.get("/",(req,res)=>{
    res.status(200).json({
        msg:'i am the too many facts api'
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