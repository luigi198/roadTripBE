var express = require('express');
var bodyParser= require('body-parser')
var app = express();
var MongoClient = require('mongodb').MongoClient;
var db;

app.use(bodyParser.urlencoded({extended: true}))

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/api/places', function (req, res) {
  db.collection('places').find().sort({code: 1}).toArray(function (err, data) {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.json(data);
  });
});

app.put('/api/places/:id', function (req, res) {
  db.collection('places').update({'code': {$eq: req.params.id}}, {$set:{'checked': true}}, function (err, data) {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.json(data);
  });
});

MongoClient.connect('mongodb://luisCordoba:MongoDBUserForRoadTripV1!@ds133251.mlab.com:33251/heroku_m7t659bm', (err, database) => {
  if (err) {
    console.log(err);
    return;
  }
  db = database;
  app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });
})
