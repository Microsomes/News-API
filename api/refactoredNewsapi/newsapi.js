const express= require("express");
const router= express.Router();
const MicrosomesDB = require("../db/dbMySql");

const jsq= require("jsonwebtoken");

let apicache= require("apicache");
let cache = apicache.middleware
 

var CAHCE_TIME="30 minutes";
//set the newsify chache to 30 minutes


var newsRelated= MicrosomesDB.newsRelated;
var nr= new newsRelated();

var newsify_auth= new MicrosomesDB.newsify_auto;

// newsify_auth.getSourceNameByUsername("microsomess").then(source=>{
//     console.log(source)
// })

//   newsify_auth.signup("microsomes","Ta123lo09","Microsomes News").then(d=>{
//       console.log(d);
//   })

// newsify_auth.verifyUsernameUnique("microsomess").then(d=>{
//     console.log(d);
// })

// newsify_auth.verifySourceNameUnique("Microsomes newss").then(d=>{
//     console.log(d);
// })

//  newsify_auth.login("microsomes","Ta123lo09").then(d=>{
//      console.log(d);
//  })


router.post("/login",verifyNewsifyLogin,(req,res,next)=>{
    var username= req.body.username;
    var password= req.body.password;
    username= username.toLowerCase();
    password= password.toLowerCase();


    jsq.sign({username},"secretkey",{expiresIn:"7d"},function(err,token){
        if(err){
            res.statusCode(403)
        }else{
            res.status(200).json({
                msg:"please save this access token and use it as a bearer authentication within the header...",
                username,
                token
            })
        }
    })
    
     
})

router.post("/signup",verifyAccountDetailsAreUnique,(req,res,next)=>{
   //verifies that 
    //username is unique
    var username= req.body.username;
    var sourceName= req.body.sourceName;
    var password= req.body.password;
    //source is unique
    username= username.toLowerCase();
    sourceName= sourceName.toLowerCase();
    password= password.toLowerCase();

    newsify_auth.signup(username,password,sourceName).then(d=>{
        res.status(200).json({
            msg:"User successfully created navigate to login to login"
        })
    }).catch(err=>{
        res.status(200).json({
            msg:err
        })
    })
    
     
})
//login auth above not ready yet


router.get("/",(req,res,next)=>{
    res.status(200).json({
        msg:"new newsapi speaking docs coming soon.",
        contact:{
            name:"Muhammed T Javed",
            email:"tayyabdev@outlook.com"
        }
    })
})


//handles the route for searching artices
router.get("/search/:query",cache(CAHCE_TIME),(req,res,next)=>{
    let query= req.params.query;
    nr.getNewsByQuery("%"+query+"%").then(data=>{
        res.status(200).json({
            data,
        })
    }).catch(err=>{
        res.status(200).json({
            msg:err,
        })
    })
})

//grabs the total amount of articles stored by the db
router.get("/total",(req,res,next)=>{
    nr.getTotal().then(data=>{
        res.status(200).json({
            data,
        })
    }).catch(err=>{
        res.status(200).json({
            msg:err
        })
    })
})
router.get("/total/:source",(req,res,next)=>{
    let source= req.params.source;
    nr.getTotalBySource(source).then(data=>{
        res.status(200).json({
            data,
        })
    }).catch(err=>{
        res.status(200).json({
            msg:err
        })
    })
})


router.get("/articleById/:id",(req,res,next)=>{
    var id= req.params.id;
    nr.getArticleById(id).then(data=>{
        res.status(200).json({
            data,
        })
    }).catch(err=>{
        res.status(200).json({
            msg:err,
        })
    })
})

router.get("/newsBySourceTag/:sourcetag",cache(CAHCE_TIME),(req,res,next)=>{
    var sourcetag= req.params.sourcetag;
    var source= sourcetag.split(",")[0];
    var tag= sourcetag.split(",")[1];
    nr.getNewsBySouceNTag(source,tag).then(data=>{
        res.status(200).json({
            data,
        })
    }).catch(err=>{
        res.status(200).json({
            msg:err
        })
    })
})

router.get("/tags/:source",cache(CAHCE_TIME),(req,res,next)=>{
    var source= req.params.source;
    nr.getTagsOfSource(source).then(data=>{
        res.status(200).json({
            data,
        })
    }).catch(err=>{
        res.status(200).json({
            err,
        })
    })
})

router.get("/source/:source",cache(CAHCE_TIME),(req,res,next)=>{
    let source= req.params.source;
    nr.getNewsBySource(source).then(data=>{
        res.status(200).json({
            data,
        })
    }).catch(err=>{
        res.status(200).json({
            msg:err
        })
    })
})
router.get("/source/:source/:tag",cache(CAHCE_TIME),(req,res,next)=>{
    let source= req.params.source;
    let tag= req.params.tag;
    nr.getNewsBySouceNTag(source,tag).then(data=>{
        res.status(200).json({
            data,
        })
    }).catch(err=>{
        res.status(200).json({
            msg:err
        })
    })
})

router.get("/recent",cache(CAHCE_TIME),(req,res,next)=>{
    nr.getRecent().then(data=>{
        res.status(200).json({
            data,
        })
    }).catch(err=>{
        res.status(200).json({
            msg:err
        })
    })
})
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
router.get("/betterDelivery",(req,res,next)=>{
    //grabs all recent news from all sources
    var promises=[];
    nr.allSources().then(d=>{
        d.forEach(e=>{
          promises.push(nr.getNewsBySource(e.Source));
        })
        Promise.all(promises).then(values=>{
            var arraysOfData=values;
            var toMerge=[];

            for(let i=0;i<arraysOfData.length;i++){
                var currentArray= values[i];
                for(let i=0;i<currentArray.length;i++){
                    toMerge.push(currentArray[i]);
                }
            }
 
             res.status(200).json({
                msg:"better delivery",
                data:shuffle(toMerge)
            })
        })
    })

     
})

router.get("/recentug",cache(CAHCE_TIME),(req,res,next)=>{
    nr.getRecent_ug().then(data=>{
        res.status(200).json({
            data,
        })
    }).catch(err=>{
        res.status(200).json({
            msg:err
        })
    })
})


router.get("/sources",cache(CAHCE_TIME),(req,res,next)=>{
    nr.allSources().then(data=>{
        var sources=data;
        res.status(200).json({
            sources
        })
    }).catch(err=>{
        console.log(err);
        res.sendStatus(403);
    })
})
router.get("/sourcesug",cache(CAHCE_TIME),(req,res,next)=>{
    nr.allSources_ug().then(data=>{
        var sources=data;
        res.status(200).json({
            sources
        })
    }).catch(err=>{
        res.sendStatus(403);
    })
})




router.post("/add",verifyTitleUnique,(req,res,next)=>{
    let payload= req.body;
    nr.addNews({
       ...payload 
    }).then(data=>{
        res.status(200).json({
            msg:data
        })
    }).catch(err=>{
         res.sendStatus(403);
    })
 })
router.post("/addm",verifyTitleUnique,(req,res,next)=>{
    //exatly the same as add but is map specific
    let payload= req.body;
    console.log(payload);
    
    nr.addNewsM({
       ...payload 
    }).then(data=>{
        res.status(200).json({
            msg:data
        })
    }).catch(err=>{
         res.sendStatus(403);
    })
    console.log(payload);
})

router.post("/addUG",[verifyTitleUnique,verifyNewsifyToken],(req,res,next)=>{

    jsq.verify(req.token,"secretkey",(err,authdata)=>{
        if(err){
            res.sendStatus(403);
        }else{
            let payload= req.body;
            payload.verifiedUsername=authdata.username;
            //comes straight from the token
            newsify_auth.getSourceNameByUsername(authdata.username).then(d=>{
                var sourceName=d;
                payload.verifiedSourceName=d;
                nr.addNews_ug({
                    ...payload 
                    }).then(data=>{
                        res.status(200).json({
                            msg:data
                        })
                    }).catch(err=>{
                        res.sendStatus(403);
                    })
                    console.log(payload);

            }).catch(err=>{
                res.sendStatus(403);
            })
           
        }
    })
    return;

     
})


// router.put("/updateSource/:id",(req,res,next)=>{

// })


// router.put("/sourceItemUpdate/:id",(req,res,next)=>{
//     var id= req.params.id;
// })

router.get("/deleteNewsItem/:id",(req,res,next)=>{
    var id= req.params.id;
    nr.deleteNewsItem(id).then(result=>{
        res.status(200).json({
            msg:status
        })
    }).catch(err=>{
        res.status(200).json({
            msg:err
        })
    })
})



router.get("/sourceItemByName/:name",(req,res,next)=>{
    var name= req.params.name;
    nr.grabSourceItem_by_name(name).then(data=>{
        res.status(200).json({
            source:data
        })
    }).catch(err=>{
        res.status(200).json({
            msg:"error occured"
        })
    })
})

router.get("/souceItemByID/:id",(req,res,next)=>{
    var id= req.params.id;
    nr.grabSourceItem_by_id(id).then(data=>{
        res.status(200).json({
            source:data
        })
    }).catch(err=>{
        res.status(200).json({
            msg:"error occured"
        })
    })
})

router.get("/allsourceitems",(req,res,next)=>{
    nr.grabSourceItems().then(data=>{
        res.status(200).json({
            sources:data
        })
    }).catch(err=>{
        res.status(200).json({
            msg:"error..."
        })
    })
})

//route that updates a souce item
router.post("/updateSourceItem/:id",(req,res,next)=>{
    var id= req.params.id;
    var data=req.body;
    nr.updateSourceItem(id,{
        source:data.source,
        promo_image:data.promo_image,
        square_image:data.source_image,
        url:data.url,
        source_description:data.source_description
    }).then(status=>{
        res.status(200).json({
            msg:status
        })
    }).catch(err=>{
        res.status(200).json({
            msg:err
        })
    })
})


//router for creating a new souce item
router.post("/createSource",checkSourceUnique,(req,res,next)=>{
    var data= req.body;

    console.log(data);
    nr.addSourceItem({
        source:data.source,
        promo_image:data.promo_image,
        square_image:data.source_image,
        url:data.url,
        source_description:data.source_description,
    }).then(status=>{
        res.status(200).json({
            msg:status
        })
    }).catch(err=>{
        res.status(200).json({
            msg:err
        })
    })

})

// //route strictly for internal use will upgrade the database
// router.post("/upgrade",(req,res,next)=>{
    
//     let payload= req.body;

//     console.log(payload);

//     res.status(200).json({
//         msg:"upgrade was successful"
//     })
// })


function verifyTitleUnique(req,res,next){
    console.log("verifying")
    //verifys post being added is unique
    let payload= req.body;
    let title= payload.title;
    nr.checkDublicateTitle(title).then(data=>{
        if(data=="yes"){
            res.status(200).json({
                msg:"dublicate title"
            })
        }else{
            next();
        }
    })
}

//middleware for create source route
function checkSourceUnique(req,res,next){
    var sourceI= req.body.source;
    
    nr.checkSouceItemExists(sourceI).then(data=>{
        console.log(data.length);
        if(data.length>=1){
            //exists
            res.status(200).json({
                msg:"source already exists"
            })
        }else{
            next();
        }
    }).catch(err=>{
        console.log(err);
    })
}

function verifyUG_user_is_signed_in(){
    //middleware that verifies if a user is signed in or not
    //to be able to add a news source as user generated a user must be signed in
    //and a post must contain a bearer authentication token
}

function verifyNewsifyLogin(req,res,next){
    //verifies newsify login details are correct before allowing a login
    var username=req.body.username;
    var password=req.body.password;
    username= username.toLowerCase();
    password= password.toLowerCase();
    console.log(username);
    console.log(password);
    //todo verify if username and password are actually correct before giving user an
    //access token
    console.log(username);
    console.log(password);
    
    
    newsify_auth.login(username,password).then(d=>{
        console.log(d);
         if(d=="yes"){
             next();
         }else{
             console.log("hmm");
             res.sendStatus(403);
         }
    }).catch(err=>{
        console.log(err);
    })
 }

function verifyNewsifyToken(req,res,next){
    //verifies if bearer token is correct
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

function verifyAccountDetailsAreUnique(req,res,next){
    //verifies that 
    //username is unique
    var username= req.body.username;
    var sourceName= req.body.sourceName;
    var password= req.body.password;
    //source is unique
    username= username.toLowerCase();
    sourceName= sourceName.toLowerCase();
    password= password.toLowerCase();

    newsify_auth.verifyUsernameUnique(username).then(d=>{
        if(d=="no"){
            //confirms its a unique name

            //if its unique lets check the source name as well

            newsify_auth.verifySourceNameUnique(sourceName).then(d=>{
                if(d=="no"){
                    //verifies that sourcename is also unique
                    next();
                }else{
                    res.sendStatus(403);
                }
            })

        }else{
            res.sendStatus(403);
        }
    })

     
}


function invalid_response(msg,res){
    res.status(200).json({
        msg,
    })
}









module.exports=router;