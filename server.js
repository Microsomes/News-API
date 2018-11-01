const http = require('http');
//imported http
const app = require("./app");
var server= require('http').Server(app);
  
 

//end socket
var fs = require('fs');
var https = require('https');
const options = {
  key: fs.readFileSync("./socialstation.info/privkey.pem"),
  cert: fs.readFileSync("./socialstation.info/fullchain.pem")
};

const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;


// Used when generating any kind of Access Token
const twilioAccountSid = 'AC31cba9f2efe7aa8f223b2b4371e2980c';
const twilioApiKey = 'SK434b9f8d0b6dba035affd856f687dbc4';
const twilioApiSecret = 'qTnA45pZaDRvNglzCFfvIzH3Mso51098';
//twillio credentials



var isDebug=true;

if(isDebug){
  // const server= http.createServer(app);
  // server.listen(4000);
  server.listen(4000);
  console.log("debugging")






}else{
  const server= https.createServer(options,app);
  server.listen(443);
 
  console.log("production")
}

 



















