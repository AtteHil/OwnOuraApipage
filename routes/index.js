var express = require('express');
var router = express.Router();
var functions = require('../functions/functions.js');
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
        res.send(result)}
      }
      
      ) 
    .catch(error => console.log('error', error));
});






module.exports = router;
