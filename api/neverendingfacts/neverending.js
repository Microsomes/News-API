const express= require("express");
const router= express.Router();



router.get("/",(req,res,next)=>{
    res.status(200).json({
        msg:"welcome to the neverendingfacts api"
    })
})



module.exports=router;