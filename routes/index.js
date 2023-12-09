var express = require('express');
var router = express.Router();
var functions = require('../functions/functions.js');
const mongoose = require("mongoose");
const mongoDB = "mongodb://127.0.0.1:27017/ouraData";
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error"));

db.on("connected", console.error.bind(console, "connect established"));
const FlexibleSchema = new mongoose.Schema({}, { strict: false });
const sleepDataDB = mongoose.model('SleepData', FlexibleSchema);
let personalToken = ''
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'OuraApi' });
});
router.get('/info/:token', function(req, res, next) {
  personalToken = req.params.token;
  
  var myHeaders = new Headers(); 
  myHeaders.append('Authorization', `Bearer ${personalToken}`); 
  var requestOptions = { 
  method: 'GET', 
  headers: myHeaders, 
  };
  fetch('https://api.ouraring.com/v2/usercollection/personal_info', requestOptions) 
    .then(response => response.json()) 
    .then(result => {
      if(result.message){
        res.send({status: "Data was not found"});
      }else{
        res.send(result)}
    }) 
    .catch(error => console.log('error', error));
});
// function to get sleepdata for last nights sleep
// now it gets 2 nights ago sleep score. with id more data of the sleep could be get. Have to test if this works for the lasty night also. 

router.get('/OuraData/sleep', function(req, res, next) {
  
 // make of the felxible model so json that comes from api can be straight saved in mongodb
  
  

  dates=functions.DateParser()
  
  var myHeaders = new Headers(); 
  myHeaders.append('Authorization', `Bearer ${personalToken}`); 
  var requestOptions = { 
  method: 'GET', 
  headers: myHeaders, 
  };
  fetch(`https://api.ouraring.com/v2/usercollection/daily_sleep?start_date=${dates.monthAgo}&end_date=${dates.today}`, requestOptions) 
    .then(response => response.json()) 
    .then(result => {
      
      if(result.message){
        res.send({status: "Data was not found"});
      }else{
        res.send(result)
        
        
        try{
          

          for(let i =0; i<result.data.length; i++){
            
            sleepDataDB.find( {day: result.data[i].day}) // try to find the data we are trying to save
            .then((data)=>{ 
              
              if(!data.length){// if not found we save it to db if data.length == 0 this is true
                sleepDataDB.create(result.data[i])
              }
            })
          }}catch(error){
            console.error('Error inserting to db', error)
          }
          
        
        }
      }
      
      ) 
    .catch(error => console.log('error', error));
});






module.exports = router;
