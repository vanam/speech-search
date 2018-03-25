var express = require('express');
const WatsonAuth = require('watson-developer-cloud/authorization/v1');

var cfenv = require('cfenv');

var app = express();
var cors = require('cors');
var appEnv = cfenv.getAppEnv();

app.use(cors());

var credentials = {
   version: 'v1',
   username: 'bd7dedba-211e-46e0-ba43-70df9bc166e3',
   password: 'dqJ5TnT7jMfb'
};

app.get('/getToken', function(req, res) {
    console.log('ok, lets do this');

    var params = {
        url: 'https://stream.watsonplatform.net/speech-to-text/api'
    };
    
    new WatsonAuth({
    username: credentials.username,
    password: credentials.password,
    url: params.url
  }).getToken((err, token) => {
    if (err) {
      console.error('error: ', err);
      return res.send(0);
    }
    // note: tokens are percent-encoded already and must not be double-encoded
    console.log('token: ', token);
    res.send(token);
  });
    
});

app.listen(appEnv.port, '0.0.0.0', function() {
    console.log("server starting on " + appEnv.url);
});