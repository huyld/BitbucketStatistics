var request = require('request');

/**
 * List of properties of repository that we are interested in
 */
const interestingProperties = [
  'uuid',
  'links',
  'slug',
  'updated_on'
];
/**
 * List of links of repository that we are interested in
 */
const interestingLinks = [
  'commits',
  'pullrequests'
];

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
  });
}

/**
 * Return an object with only properties in interestingKeys list
 *
 * @param {any} obj
 * @param {any} interestingKeys
 */
function filterInterestingProperties(originalObj, interestingKeys) {
  return Object.keys(originalObj)
    .filter(key => interestingKeys.includes(key))
    .reduce((obj, interestingKey) => {
      if (interestingKey === 'links') {
        obj[interestingKey] = filterInterestingProperties(originalObj.links, interestingLinks);
      } else {
        obj[interestingKey] = originalObj[interestingKey];
      }
      return obj;
    }, {});
}

exports.requestRepositoriesInfo = requestRepositoriesInfo;
