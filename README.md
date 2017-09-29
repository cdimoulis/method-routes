# Method Routes

A simple route and method matcher for nodejs.

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]

## Installation

`npm install method-routes`

## Usage

Simply import and create router;

```js
let Router = require('method-routes');

let router = new Router();
```

#### Add Routes

Adding routes is simply a string representing a url to match and an action which is a function.

The url string should follow the [minimatch](https://www.npmjs.com/package/minimatch) documentation for matching.

Routes are added using an array like `['/url/route/*/to/match', action]`

Action is a function callback. This function will be returned on a successful match

```js
let main_controller = require('./controllers/main');

// route, action
router.addRoute('/index.html', main_controller.index);

// [route,action], [route,action]
router.addRoutes([
  ['/blog/articles/*', main_controller.articles],
  ['**', main_controller.default]
]);

router.hasRoute('/index.html'); // true

let action = router.getAction('/blog/articles/cheese'); // returns main_controller.articles
```

**NOTE:**

The order in which routes are added is important. In the example above you see the route `**` which would match ANY AND ALL routes. However since it is added last the first two routes will be checked first for a match.

**QUERY STRINGS:**

Query strings are ignored when adding a route (`addRoute(...)`) and calling `hasRoute(...)`, `getAction(...)`, and `removeRoute(...)`. Only the path will be considered in the match.

#### View Routes

You can get an array of all the routes currently in the router:
```js
router.routes();
```

You can get an array of all the actions currently in the router:
```js
router.actions();
```

View a neater layout of the current routes in the router. If the function passed is a named function statement the function name will show. Otherwise the function will print.

```js
router.toString();

// ROUTE                ACTION              
// /index.html          index                   
// /blog/article/*      articles                   
// **                   default      
```

Named function statements (as opposed to a function literal) will help with this table. If using a function constructor then using a named function will be helpful:
```js
Controller = new function() {

  this.index = function index() {
    ...
  };

  this.create = function() {

  };
};

let main_controller = new Controller();
main_controller.index.name; // index
main_controller.create.name; // ''
```

#### Remove Routes

You can remove an individual route:
```js
router.removeRoute('/blog/articles/**');
```

You can remove all routes:
```js
router.clearAll();
```


[npm]: https://img.shields.io/npm/v/method-routes.svg
[npm-url]: https://npmjs.com/package/method-routes

[node]: https://img.shields.io/node/v/method-routes.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/david/cdimoulis/method-routes.svg
[deps-url]: https://david-dm.org/cdimoulis/method-routes

[tests]: https://img.shields.io/travis/cdimoulis/method-routes/master.svg
[tests-url]: https://travis-ci.org/cdimoulis/method-routes

[cover]: https://coveralls.io/repos/github/cdimoulis/method-routes/badge.svg?branch=master
[cover-url]: https://coveralls.io/github/cdimoulis/method-routes?branch=master
