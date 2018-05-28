var request = require('request');

/**
 * Get the information of repositories where interested members participate in
 *
 * @param {any} configData
 */
function requestRepositoriesInfo(configData) {
  return new Promise((resolve, reject) => {
  request
    .get(configData.repositoriesURL, {
      auth: {
        user: configData.username,
        pass: configData.password,
      }
    })
    .on('response', (res) => {
      res.body = "";
      res.on('data', function (chunk) {
        res.body += chunk;
      });

      res.on('end', function () {
      });
    });
}

exports.requestRepositoriesInfo = requestRepositoriesInfo;
