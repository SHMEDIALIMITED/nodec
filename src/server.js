
/**
 * Author Patrick Wolleb, SH MEDIA Limited.
 */

var express = require('express')
  , https = require('https')
  , path = require('path')
  , fs = require('fs');

// Load configurations
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , mongoose = require('mongoose');


var app = express();
                          console.log(config.db)
// Bootstrap db connection
mongoose.connect(config.db)

// Congiure Express
require('./config/express')(app, config);

// Bootstrap routes
require('./config/routes')(app, config);

var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('key-cert.pem')
};

https.createServer(options, app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});