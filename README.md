# Browserify and AngularJS

Lately, I have been experimenting with browserify and using it to manage
my application builds.  Browserify gives you a large part of the NodeJS
api and the commonjs require module system on your browser code.

AngularJS has its own internal module system, but it is really not the
same thing as the commonjs or requirejs solutions.  Basically, commonjs
gives you an api to split out your application into small files that can
then be stitched together using the require function and browserify.

Just a standard concat has been working well, but I ran into some
specific needs that made browserify make a lot more sense.

My end goal is to be able to create micro-apps, small independent
features of an application that can be wired up during the build time,
but be maintained in separate project repositories for testing and
maintainability.

Browserify is a piece to that puzzle, so lets see some code.

``` sh
npm install browserify -g
npm install napa -g
npm install w3 -g
mkdir myapp
```

# package.json

``` json
{
  "name": "myapp",
  "version": "0.0.0",
  "scripts": {
    "install": "napa",
    "build": "browserify -t brfs app/app.js -o public/bundle.js",
    "start": "cd public && w3"
  },
  "napa": {
    "angular": "angular/bower-angular",
    "angular-route": "angular/bower-angular-route"
  },
  "devDependencies": {
    "brfs": "latest"
  }
}
```

** napa is a module that lets you add any git bower repo as a
nodejs module.

# create app/app.js

``` js
require('angular/angular');

angular.module('myapp', ['ngRoute'])
  .config(require('./routes'));
```

# create app/routes.js

``` js
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
```

# create app/controllers/main.js

``` js
module.exports = function($scope) {
  $scope.title = 'Main Page';
};
```

# create app/controllers/page2.js

``` js
module.exports = function($scope) {
  $scope.title = 'Page 2 Page';
};
```

# create app/templates/main.html

``` html
<h1>{{title}}</h1>
<p> You are on home </p>
<a ng-href="#/">Home</a>
<a ng-href="#/page2">Page 2</a>
```

# create app/templates/page2.html

``` html
<h1>{{title}}</h1>
<p>You are on page 2</p>
<a ng-href="#/">Home </a>
<a ng-href="#/page2">Page 2</a>
```
# create public/index.html

``` html
<!doctype html>
<html ng-app="myapp">
  <head><title>MyApp</title></head>
  <body>
    <ng-view></ng-view>
    <script src="bundle.js"></script>
  </body>
</html>
```

Once all these files are in place, you should be able to build the
bundle.js and run the app.


``` sh
npm install
npm run build
npm start
```

Now for the coolest trick: `watchify`

``` sh
npm install watchify --save-dev
```

Add the following node to the scripts object in package.json

``` json
  "watch": "watchify -t brfs app/app.js -o public/bundle.js"
```

Watchify will watch any changes to any of your controllers or 
templates and rebuild your bundle.js.

Try to modify the `main.html` then restart your web-server and 
you should see the new changes.

---

So this is first step into completely packaged micro-apps, by 
being able to require standard commonjs modules it makes our 
controllers very much like nodejs modules, actually you should
be able to unit test both controllers with just standard mocha
for nodejs.  And by browserifing our controllers and templates we
have no issues for conflict.


