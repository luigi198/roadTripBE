var express = require('express');
var bodyParser= require('body-parser')
var app = express();
var MongoClient = require('mongodb').MongoClient

app.use(bodyParser.urlencoded({extended: true}))

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

MongoClient.connect('mongodb://luisCordoba:MongoDBUserForRoadTripV1!@ds133251.mlab.com:33251/heroku_m7t659bm', (err, database) => {
  app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });
})
