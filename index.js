var fs = require('fs');


require('./tasks/get-input-data.js')
  .readConfigurationData()
  .then(configData => {
    return require('./tasks/get-repository-list.js').requestRepositoriesInfo(configData);
  }).then(repositories => {
    // Write to file to make it easier to check (use in developing phase only)
    fs.writeFile('response.json', repositories, (err) => {
      if (err) {
        console.error('Failed to write to file.', err);
      }
    });
  });



