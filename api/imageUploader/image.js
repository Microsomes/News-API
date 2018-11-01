const express= require("express");
const router= express.Router()

var multer   = require("multer");


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '.jpg') //Appending .jpg
    }
  })
  
  var upload = multer({ storage: storage });

router.post('/upload', upload.any(), function (req, res, next) {
    // req.body contains the text fields
     var files= req.files;

    files.forEach(file=>{
        var path= file.path;
        var serverPath='https://socialstation.info/'+path;
         res.status(200).send(serverPath)
    })
})

router.post("/",upload.any(),function(req,res){
    // req.body contains the text fields
    var files= req.files;



    files.forEach(file=>{
        var path= file.path;
        var serverPath='https://socialstation.info/'+path;
         res.status(200).send(serverPath)
    })
})

module.exports=router;