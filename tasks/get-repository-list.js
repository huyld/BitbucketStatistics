var request = require('request');
var fs = require('fs');

/**
 * Get the information of repositories where interested members participate in
 *
 * @param {any} configData
 */
function requestRepositoriesInfo(configData) {
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
        handleRepositoriesList(res);
      });
    });
}

function handleRepositoriesList(res) {
  const jsonObj = JSON.parse(res.body);
  const jsonStr = JSON.stringify(jsonObj, null, 4);

  // Write to file to make it easier to check (use in developing phase only)
  fs.writeFile('response.txt', jsonStr, (err) => {
    if (err) {
      console.error('Failed to write to file.', err);
    }
  });
}

exports.requestRepositoriesInfo = requestRepositoriesInfo;
