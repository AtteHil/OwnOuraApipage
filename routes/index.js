var express = require('express');
var router = express.Router();
let personalToken = ''
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'OuraApi' });
});
router.get('/OuraData/:token', function(req, res, next) {
  personalToken = req.params.token;
  console.log(personalToken);
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
module.exports = router;
