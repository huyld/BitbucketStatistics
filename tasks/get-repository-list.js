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
  console.info('Requesting repository list...');
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
          const jsonObj = JSON.parse(res.body);
          const nextURL = jsonObj.next;

          if (nextURL) {
            getRepoListRecursively(nextURL, configData).then(result => {
              console.info('Finish requesting repository list.');
              resolve(result);
            });
          } else {
            console.info('Finish requesting repository list.');
            resolve(jsonObj);
          }
        });
      });
  });
}

/**
 * Since the repositories in the response is paginated,
 * this method recursively calls itself to get the repositories in the next page.
 * After it reaches the last page, it returns a list of repositories in that page.
 *
 * @param {any} requestURL
 * @param {any} configData
 */
function getRepoListRecursively(requestURL, configData) {
  return new Promise((resolve, reject) => {
    request
      .get(requestURL, {
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
          const jsonObj = JSON.parse(res.body);
          const repoList = jsonObj.values;

          // Filter repository objects to get only interesting properties
          const filteredRepoList = repoList
            .map(el => filterInterestingProperties(el, interestingProperties));

          const nextURL = jsonObj.next;
          if (nextURL) {
            getRepoListRecursively(nextURL, configData)
              .then(returnedRepoList => {
                // Append the returned repoList to the current repoList
                resolve([...returnedRepoList, ...filteredRepoList]);
              });
          } else {
            // Resolve the current repoList
            resolve(filteredRepoList);
          }
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
