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
  };

  // Add a method:route to the routes
  // route: (string) the route to match. MUST include method in the format
  //        '{METHOD}:{Route}'. i.e. 'GET:/blog/*'
  // action: (function) the action (funtion callback) to perform. This function
  //         will be returned on a successful match.
  addRoute(route, action) {
    _checkRouteString(route);
    // Add the route with the method prepended
    super.addRoute(route, action);

    // Allow chaining of addRoutes
    return this;
  };

  // Add a route to the routes
  // method: (string) the method of the http request
  // route: (string) the route to match. Uses minimatch for route matching
  // action: (function) the action (funtion callback) to perform. This function
  //         will be returned on a successful match.
  addMethodRoute(method, route, action) {
    method = method.toUpperCase();
    _checkMethod(method);

    // Need to check route here since we will combine it with the method
    // when sending it to simple-routes
    if (!route || !((typeof route) === 'string')) {
      throw new Error(`Routes Error: Route must be a string for...\nroute: ${route}\naction: ${action}`);
    }

    // Allow chaining of addRoutes
    return this.addRoute(`${method}:${route}`, action);
  };


  // Adds multiple routes and actions.
  // list: array of arrays. Each array is of format [method, route, action].
  addRoutes(list) {
    if (list && Array.isArray(list)) {
      list.forEach((obj) => {
        this.addMethodRoute(obj[0], obj[1], obj[2]);
      });
    }
    else {
      throw new Error(`Router Error: List must be an array\nList: ${list}`)
    }
    // Allow chaining of addRoutes
    return this;
  };

  // Show the action for the given method:route string
  // Returns the function or undefined if not found
  getAction(route) {
    _checkRouteString(route);
    return super.getAction(route);
  };

  // Show the action for the passed method and route
  // Returns the function or undefined if not found
  getMethodAction(method, route) {
    method = method.toUpperCase();
    _checkMethod(method);
    // Separate potential query string
    let rq = route.split('?');
    // Index of path only
    return this.getAction(`${method}:${rq[0]}`);
  };

  // Get the route pattern that is matched with the given method:route string
  // Returns undefined if not found
  getRouteMatch(route) {
    _checkRouteString(route);
    return super.getRouteMatch(route);
  };

  // Get the route pattern that is matched for the passed method, route
  // Returns undefined if not found
  getMethodRouteMatch(method, route) {
    method = method.toUpperCase();
    _checkMethod(method);
    // Separate potential query string
    let rq = route.split('?');
    // Index of path only
    return this.getRouteMatch(`${method}:${rq[0]}`);
  };

  // Remove a specific method:route string combination
  // Returns the action or undefined if not found
  removeRoute(route) {
    _checkRouteString(route);
    return super.removeRoute(route);
  };

  // Remove the route pattern and method combination
  // Returns the action or undefined if not found
  removeMethodRoute(method, route) {
    method = method.toUpperCase();
    _checkMethod(method);
    // Separate potential query string
    let rq = route.split('?');
    return super.removeRoute(`${method}:${rq[0]}`)
  };

  // If has route pattern given the passed method:route string
  hasRoute(route) {
    _checkRouteString(route);
    return super.hasRoute(route);
  };

  // If has route pattern for a particular method and route pattern
  hasMethodRoute(method, route) {
    _checkMethod(method);
    method = method.toUpperCase();
    // Separate potential query string
    let rq = route.split('?');
    return this.hasRoute(`${method}:${rq[0]}`);
  };
};

/***
* Private FUNCTIONS
***/

// Check the method for accurateness
let _checkMethod = (method) => {
  if (!method) throw new Error(`Routes Error: Method ${method} is not included in: ${METHODS}.`);
  if (!METHODS.includes(method)) {
    throw new Error(`Routes Error: Method ${method} is not included in: ${METHODS}.`);
  }
};

let _checkRouteString = (route) => {
  if (!route) throw new Error(`Routes Error: Route must be a string for\nroute: ${route}`);
  let method = route.split(':')[0];
  _checkMethod(method);
}

// "STATIC" variables
Routes.POST = 'POST';
Routes.GET = 'GET';
Routes.PUT = 'PUT';
Routes.PATCH = 'PATCH';
Routes.DELETE = 'DELETE';

module.exports = Routes;
