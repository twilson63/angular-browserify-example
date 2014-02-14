var fs = require('fs');
module.exports = function($routeProvider) {
  $routeProvider
    .when('/', {
      controller: require('./controllers/main.js'),
      template: fs.readFileSync(__dirname + '/templates/main.html')
    })
    .when('/page2', {
      controller: require('./controllers/page2.js'),
      template: fs.readFileSync(__dirname + '/templates/page2.html')
    });
};
