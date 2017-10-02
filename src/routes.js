const SimpleRoutes = require('simple-routes');

// List of possible methods
const METHODS = [
  'POST',
  'GET',
  'PUT',
  'PATCH',
  'DELETE'
];

// Route and method actions
// Order of checking is done with simple-routes so we simply need to keep
// a record of which action belongs with which route/method combination
let _routes = {};

class Routes extends SimpleRoutes {

  constructor(opts) {
    super(opts);
    return this;
  }

  // Add a route to the routes
  // method: (string) the method of the http request
  // route: (string) the route to match. Uses minimatch for route matching
  // action: (function) the action (funtion callback) to perform. This function
  //         will be returned on a successful match.
  addRoute(method, route, action) {
    method = method.toUpperCase();
    if (!METHODS.includes(method)) {
      throw `Router Error: Method ${method} is not included in: ${METHODS}`
    }
    // If route does not exist add to _routes object
    if (!_routes.hasOwnProperty(route))
      _routes[route] = {};

    // If method already exists for route give a warning
    if (_routes[route].hasOwnProperty(method))
      console.warn(`Already Exists: ${route} already has an action for method ${method}.`);
    else {
      super.addRoute(route, action);
      _routes[route][method] = action;
    }

    return this;
  };


  // Adds multiple routes and actions.
  // list: array of arrays. Each array is of format [method, route, action].
  addRoutes(list) {
    if (list && Array.isArray(list)) {
      list.forEach((obj) => {
        this.addRoute(obj[0], obj[1], obj[2]);
      });
    }
    else {
      throw new Error(`Router Error: List must be an array\nList: ${list}`)
    }
    // Allow chaining of addRoutes
    return this;
  };
};

// "STATIC" variables
Routes.POST = 'POST';
Routes.GET = 'GET';
Routes.PUT = 'PUT';
Routes.PATCH = 'PATCH';
Routes.DELETE = 'DELETE';

module.exports = Routes;
