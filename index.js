

require('./tasks/get-input-data.js')
  .readConfigurationData()
  .then(configData => {
    require('./tasks/get-repository-list.js').requestRepositoriesInfo(configData);
  });



