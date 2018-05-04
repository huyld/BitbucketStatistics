var request = require('request');
var fs = require('fs');


require('./tasks/get-input-data.js')
  .readConfigurationData()
  .then(configObj => {
    console.log(`configuration object ${configObj}`);

  });
