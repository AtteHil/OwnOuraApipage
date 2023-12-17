var express = require('express');
var router = express.Router();
const session = require("express-session");
var functions = require('../functions/functions.js');
const mongoose = require("mongoose");
const mongoDB = "mongodb://127.0.0.1:27017/ouraData";
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
const db = mongoose.connection;
//check the status of connection
db.on("error", console.error.bind(console, "MongoDB connection error"));
db.on("connected", console.error.bind(console, "connect established"));

router.use(session({
  secret: 'MyOwnVerySecretKey123',
  resave: false,
  saveUninitialized: true,

}));

//flexible schema to upload json objects straight from oura api to mongodb
const FlexibleSchema = new mongoose.Schema({}, { strict: false });
const sleepDataDB = mongoose.model('SleepData', FlexibleSchema);
// let personalToken = ''
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'OuraApi' });
});
router.get('/sleep', function (req, res, next) {
  res.render('sleep', { title: 'OuraApi' });
});


router.get('/user', function (req, res, next) {
  const personalToken = req.session.token;
  if (personalToken) {
    res.json({ loggedIn: true, personalToken });
  } else {
    res.json({ loggedIn: false });
  }
})



// get basic information aabotu the user and ring to send back to front.
router.get('/info/:token', async function (req, res, next) {
  dates = functions.DateParser()

  req.session.token = req.params.token;
  personalToken = req.session.token;
  console.log(personalToken);
  informationJson = {};
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${personalToken}`);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };
  const infoResponse = await fetch('https://api.ouraring.com/v2/usercollection/personal_info', requestOptions)
  if (!infoResponse.ok) {
    throw new Error(` eka HTTP error! Status: ${infoResponse.status}`);
  }
  const result = await infoResponse.json();
  if (result.message) {
    res.send({ status: "Data was not found" });
    c
  } else {
    informationJson.information = result;
    // res.send(result)
  }

  //get ring information
  try {

    const ringResponse = await fetch(`https://api.ouraring.com/v2/usercollection/ring_configuration?start_date=${dates.monthAgo}&end_date=${dates.today}`, requestOptions);

    if (!ringResponse.ok) {
      throw new Error(` toka HTTP error! Status: ${ringResponse.status}`);
    }

    const ringResult = await ringResponse.json();
    if (result.message) {
      res.send({ status: "Data was not found" });

    } else {

      informationJson.ringInformation = ringResult.data[0];
      res.send(informationJson);
    }
  } catch (error) {
    console.log('error', error);
  }
}
);
// function to get sleepdata for last nights sleep


router.get('/OuraData/sleep', function (req, res, next) {

  // make of the felxible model so json that comes from api can be straight saved in mongodb


  const personalToken = req.session.token;
  dates = functions.DateParser()

  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${personalToken}`);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };
  fetch(`https://api.ouraring.com/v2/usercollection/daily_sleep?start_date=${dates.monthAgo}&end_date=${dates.today}`, requestOptions)
    .then(response => response.json())
    .then(result => {

      if (result.message) {
        res.send({ status: "Data was not found" });
      } else {
        res.send(result)


        try {


          for (let i = 0; i < result.data.length; i++) {

            sleepDataDB.find({ day: result.data[i].day }) // try to find the data we are trying to save
              .then((data) => {

                if (!data.length) {// if not found we save it to db if data.length == 0 this is true
                  sleepDataDB.create(result.data[i])
                }
              })
          }
        } catch (error) {
          console.error('Error inserting to db', error)
        }


      }
    }

    )
    .catch(error => console.log('error', error));
});






module.exports = router;
