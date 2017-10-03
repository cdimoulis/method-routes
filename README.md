# Method Routes

A simple way to match route pattern and HTTP method with an action.

[Changelog](https://github.com/cdimoulis/method-routes/blob/master/changelog.md)

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]

## Installation

`npm install method-routes`

## Usage

Simply import and create routes;

```js
let Routes = require('method-routes');

let routes = new Routes();
```

#### Add Routes

Add route patterns for a particular HTTP method by using a string representing a url to match and an action that will return if matched.

The url string (route pattern) should follow the [minimatch](https://www.npmjs.com/package/minimatch) documentation for matching.

Method is a standard HTTP method. One of `POST, GET, PUT, PATCH, DELETE`. For ease of use there are static variables available:
```js
Routes.POST
Routes.GET
Routes.PUT
Routes.PATCH
Routes.DELETE
```

Route patterns use a string like `['/url/route/*/to/match', action]`

Action is a function callback. This function will be returned on a successful match.

```js
let main_controller = require('./controllers/main');

// route, action
routes.addRoute('GET:/index.html', main_controller.index);
// OR
routes.addMethodRoute(Routes.GET, '/index.html', main_controller.index);

// [method, route,action], [method, route,action]
routes.addRoutes([
  ['POST', '/blog/articles/*', main_controller.articles],
  [Routes.PUT, '**', main_controller.default]
]);

routes.hasRoute('GET:/index.html'); // true
// OR
routes.hasMethodRoute(Routes.GET, '/index.html') // also true

// returns main_controller.articles, undefined if not found
let action = routes.getAction('GET:/blog/articles/cheese');
// OR
let action = routes.getMethodAction(Routes.GET, '/blog/articles/cheese');
```

**NOTE:**

The order in which route patterns are added is important. In the example above you see the route `**` which would match ANY AND ALL routes. However since it is added last the first two routes will be checked first for a match.

**Duplicate** route patterns will log a warning and be ignored (since they would never be reached anyway)

**QUERY STRINGS:**

Query strings are ignored when adding a route (`addRoute(...)`) and calling `hasRoute(...)`, `getAction(...)`, and `removeRoute(...)`. Only the path will be considered in the match.

#### View Routes

You can get an array of all the route patterns currently in the routes:
```js
routes.routes();
```

You can get an array of all the actions currently in the routes:
```js
routes.actions();
```

Get the action if the passed route string matches a route pattern for a particular method. Undefined if not found:
```js
routes.getAction('DELETE:/...');
// OR
routes.getMethodAction(Routes.DELETE, '/...');
```

Get the route pattern that the passed route string matches for a particular method. Undefined if not found:
```js
routes.getRouteMatch('PUT:/...');
// OR
routes.getMethodRouteMatch(Routes.PUT, '/...');
```

View a neater layout of the current route patterns in the router. If the function passed is a named function statement the function name will show. Otherwise the function will print.

```js
routes.toString();
// METHOD     ROUTE                ACTION                        
// GET       /index.html          index                            
// POST      /blog/article/*      articles    
// PUT       **                   default …

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

You can remove an individual route pattern:
```js
routes.removeRoute('POST:/blog/articles/*');
// OR
routes.removeMethodRoutes(Routes.POST, '/blog/articles/*');
```

You can remove all routes:
```js
routes.clearAll();
```

## Extending Routes

You can extend the routes using the class extend syntax available in node >6.11

```js
const MethodRoutes = require('method-routes');

class MyRoutes extends MethodRoutes {
  // override functions as you wish
  ...
};
```

#### Errors

The following are functions and conditions that will throw errors:

* `addRoute(route, action)`
  * `action` is undefined/null or is not a function.

* `addMethodRoute(method, route, action)`
  * Sam as `addRoute()` function

* `addRoutes(list)`
  * `list` is undefined/null or is not an array.

* Anytime
  * `method` is not a string or part of `POST, GET, PUT, PATCH, DELETE`
  * `route` is undefined/null, is not a type string or does not have a valid method at the beginning with followed by a colon and the route.


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
