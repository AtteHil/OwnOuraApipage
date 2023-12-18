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

// initializing schemas to null
let sleepDataDB = null;
let activityDataDB = null;
let readinessDataDB = null;

router.use(session({
  secret: 'MyOwnVerySecretKey123',
  resave: false,
  saveUninitialized: true,

}));


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'OuraApi' });
});
router.get('/sleep', function (req, res, next) {
  res.render('sleep', { title: 'OuraApi' });
});


router.get('/user', function (req, res, next) {
  const personalToken = req.session.token;
  const id = req.session.user
  if (personalToken) {
    res.json({ loggedIn: true, personalToken, id });
  } else {
    res.json({ loggedIn: false });
  }
})



// get basic information about the user and ring to send back to front.
router.get('/info/:token', async function (req, res, next) {
  dates = functions.DateParser()

  req.session.token = req.params.token;
  personalToken = req.session.token;

  // console.log(personalToken);
  informationJson = {};
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${personalToken}`);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };
  const infoResponse = await fetch('https://api.ouraring.com/v2/usercollection/personal_info', requestOptions)
  if (!infoResponse.ok) {
    throw new Error(` HTTP error! Status: ${infoResponse.status}`);
  }
  const result = await infoResponse.json();
  if (result.message) {
    res.send({ status: "Data was not found" });
    c
  } else {
    req.session.user = result.id
    informationJson.information = result;
    // res.send(result)
  }

  //get ring information
  try {

    const ringResponse = await fetch(`https://api.ouraring.com/v2/usercollection/ring_configuration?start_date=${dates.monthAgo}&end_date=${dates.today}`, requestOptions);

    if (!ringResponse.ok) {
      throw new Error(` HTTP error! Status: ${ringResponse.status}`);
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

  const personalToken = req.session.token;
  dates = functions.DateParser()
  if (!sleepDataDB) {
    sleepDataDB = functions.makeSchema("sleepdata", req.session.user)
  }
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

          functions.addToDb(sleepDataDB, result);
        } catch (error) {
          console.error('Error inserting to db', error)
        }
      }
    }).catch(error => console.log('error', error));
});


router.get('/OuraData/activity', function (req, res, next) {

  const personalToken = req.session.token;
  dates = functions.DateParser()
  if (!activityDataDB) {
    activityDataDB = functions.makeSchema("activitydata", req.session.user)
  }
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${personalToken}`);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };

  fetch(`https://api.ouraring.com/v2/usercollection/daily_activity?start_date=${dates.monthAgo}&end_date=${dates.today}`, requestOptions)
    .then(response => response.json())
    .then(result => {
      if (result.message) {
        res.send({ status: "Data was not found" });
      } else {
        res.send(result)
        try {

          functions.addToDb(activityDataDB, result);
        } catch (error) {
          console.error('Error inserting to db', error)
        }
      }
    }).catch(error => console.log('error', error));
});


// function to add readiness to db
router.get('/OuraData/readiness', function (req, res, next) {

  const personalToken = req.session.token;
  dates = functions.DateParser()
  if (!readinessDataDB) {
    readinessDataDB = functions.makeSchema("readinessdata", req.session.user)
  }
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${personalToken}`);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };
  fetch(`https://api.ouraring.com/v2/usercollection/daily_readiness?start_date=${dates.monthAgo}&end_date=${dates.today}`, requestOptions)
    .then(response => response.json())
    .then(result => {
      if (result.message) {
        res.send({ status: "Data was not found" });
      } else {
        res.send(result)
        try {
          functions.addToDb(readinessDataDB, result)
        } catch (error) {
          console.error('Error inserting to db', error)
        }
      }
    }).catch(error => console.log('error', error));
});


// code to get selected dates and all the days between them from database
router.get('/OuraData/sleepscores/:startdate/:enddate', async function (req, res, next) {
  const startDate = req.params.startdate;
  const endDate = req.params.enddate;

  if (!sleepDataDB) {
    res.status(403).send({ status: "no imported data" }); // if user has not logged in or there is no token to identify the user
    return;
  }
  const result = await functions.findFromDB(sleepDataDB, startDate, endDate);

  if (!result.length) { // if nothing with given dates are found
    res.send({ message: "nothing found" })
  }
  else {
    res.send(result); // send back the result of sleeps found from given range
  }
})



module.exports = router;
