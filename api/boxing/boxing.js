const express= require("express");
const router= express.Router()
 
 
 var ufc= require("./modules/ufcAPI");
 
 let apicache= require("apicache");
 let cache = apicache.middleware;

function hi(req,res,next){
    console.log("hi");
}


 router.use(cache("30 minutes"));
router.use(function(req,rex,next){
    console.log("hello")
    next();
}); 


 //add the caching needed to sustain the server resources
 //and enabling faster responsonses
  

router.get("/",(req,res,next)=>{
    res.status(200).json({
        msg:"Welcome to the Microsomes boxing api whereby you can request UFC Youtube Boxing and Professional Boxing data, such as figther profile, upcoming fights and much much more."
    })
})

 
 


 
router.get("/ufc/:what/:param",(req,res,next)=>{
    var what= req.params.what;
    var param= req.params.param;

    if(param=="none"){

     switch(what){
         case "fighters":
         ufc.allfighters().then(d=>{
            res.status(200).json({
                fighters:d
            })
         }).catch(err=>{
        
         })
         break;

         case "titleholders":
         ufc.title_holders().then(d=>{
             res.status(200).json({
                 titleholders:d
             })
         })
         break;

         default:
         res.status(200).json({
             msg:"api parameter error"
         })

         case "events":   
            ufc.all_events().then(d=>{
                res.status(200).json({
                    events:d
                })
            })
         break;

     }


      
        return;
    }

    switch(what){
        case "titleHoldersByClass":
        ufc.title_holder_by_class(param).then(d=>{
            res.status(200).json({
                titleholders:d
            })
        })
        break;
        case "fightersByClass":
        ufc.fighters_by_class(param).then(resp=>{
            res.status(200).json({
                fighters:resp,
            })
        })
        console.log(what);
        break;
        case "fighterByID":
        ufc.fighter_by_id(param).then(d=>{
            res.status(200).json({
                fighter:d
            })
        })
        break;
        case "fighterByFirstName":
        ufc.fighter_by_first_name(param).then(d=>{
            res.status(200).json({
                fighter:d
            })
        })
        break;
        
        case "eventByFighterID":
        ufc.event_by_fighter_id(param).then(d=>{
            res.status(200).json({
                events:d
            })
        })
        break;
        
        case "eventByFighterFname":
        ufc.event_by_fighter_fname(param).then(d=>{
            res.status(200).json({
                events:d
            })
        })
        break;
    }
})
 


module.exports= router;