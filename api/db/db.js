var firebase = require('firebase/app');
const auth= require('firebase/auth');
const firestore= require('firebase/firestore');


var app = firebase.initializeApp({
    apiKey: "AIzaSyBNrTd3lNjkAawJe7MkKdxs9LPWAQyKlPY",
    authDomain: "maeplet-8bbea.firebaseapp.com",
    databaseURL: "https://maeplet-8bbea.firebaseio.com",
    projectId: "maeplet-8bbea",
    storageBucket: "maeplet-8bbea.appspot.com",
    messagingSenderId: "233798750607"

 });

 var db= app.firestore();

 
db.settings({
    timestampsInSnapshots:true
})

module.exports={
    db:app.firestore()
}