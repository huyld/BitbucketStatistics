var fs = require('fs');
var path = require('path');
var readline = require('readline');

class ConfigurationData {
  constructor() {
    this.repositoriesURL = '';
    this.username = '';
    this.password = '';
  }
}

let configData = new ConfigurationData();

/**
 * Read configuration data from a file.
 * Return a config object which contains configuration information
 *
 */
function readConfigurationData() {

  return new Promise((resolve, reject) => {
    console.info(`Reading configuration data...`);

    // Read input file
    const configFilePath = path.join(__dirname, '../config.conf');
    const lineReader = readline.createInterface({
      input: fs.createReadStream(configFilePath)
    });

    lineReader.on('line', line => {
      var lineArr = line.split('=');

      switch (lineArr[0]) {
        case 'repositoriesURL':
          configData.repositoriesURL = lineArr[1];
          break;
        case 'username':
          configData.username = lineArr[1];
          break;
        case 'password':
          configData.password = lineArr[1];
          break;
        default:
          break;
      }
    });

    lineReader.on('close', () => {
      console.info(`Finish reading configuration data.`);
      resolve(configData);
    });
  });
}

exports.readConfigurationData = readConfigurationData;
exports.ConfigurationData = ConfigurationData;
