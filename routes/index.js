var express = require('express');
var router = express.Router();
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
    .then(response => response.text()) 
    .then(result => {
      console.log(result)
      res.send(result)}
      ) 
    .catch(error => console.log('error', error));
});
// function to get sleepdata for last nights sleep
// now it gets 2 nights ago sleep score. with id more data of the sleep could be get. Have to test if this works for the lasty night also. 
//(Now my oura doesn't have stats for the last night)
router.get('/OuraData/sleep', function(req, res, next) {
  
  let today = new Date();
  let yesterday = new Date(today.getTime() - 86400000)
  let dayBefore = new Date(yesterday.getTime() -86400000)

  
  console.log(yesterday.toISOString().slice(0,10))
  
  var myHeaders = new Headers(); 
  myHeaders.append('Authorization', `Bearer ${personalToken}`); 
  var requestOptions = { 
  method: 'GET', 
  headers: myHeaders, 
  };
  fetch(`https://api.ouraring.com/v2/usercollection/daily_sleep?start_date=${dayBefore.toISOString().slice(0,10)}&end_date=${yesterday.toISOString().slice(0,10)}`, requestOptions) 
    .then(response => response.text()) 
    .then(result => {
      
      res.send(result)}
      ) 
    .catch(error => console.log('error', error));
});
module.exports = router;
