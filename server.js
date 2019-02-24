// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var http = require('http');
var request = require("request");

var validator = require('validate-image-url');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.text());

var port = process.env.PORT || 80; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

var state = 'IL'
var zip_code = '61820'
var api_key = '31c809cc5219736cd4194f399101830e'


// // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.post('/', function (req, res) {
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var plate = req.body.plate;

    var options = { method: 'POST',
    url: 'http://api.reimaginebanking.com/customers',
    qs: { key: api_key },
    headers: 
     { 'Postman-Token': 'ce022f7e-70b4-4e62-b655-912ccc4170c4',
       'cache-control': 'no-cache',
       'Content-Type': 'application/json' },
    body: 
     { first_name: first_name,
       last_name: last_name,
       address: 
        { street_number: '1234',
          street_name: 'anywhere st.',
          city: 'nowhere',
          state: state,
          zip: zip_code } },
    json: true };
  
    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        var account_num = Math.floor(1000000000000000 + Math.random() * 9000000000000000);

        var options = { method: 'POST',
        url: 'http://api.reimaginebanking.com/customers/5c71c9546759394351bee30a/accounts',
        qs: { key: api_key },
        headers: 
        { 'Postman-Token': '85450a41-aff0-4ae9-9388-a12c6fb8a245',
            'cache-control': 'no-cache',
            'Content-Type': 'application/json' },
        body: 
        { type: 'Credit Card',
            nickname: 'Parking Payment',
            rewards: 50000,
            balance: 50000,
            account_number: account_num.toString() },
        json: true };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body);
        });
    });

});


app.use('/create', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);