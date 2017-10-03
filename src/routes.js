const SimpleRoutes = require('simple-routes');
const columnify = require('columnify');

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
    method = _checkMethod(method);

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
      throw new Error(`Routes Error: List must be an array\nList: ${list}`)
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
    method = _checkMethod(method);
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
    method = _checkMethod(method);
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
    method = _checkMethod(method);
    // Separate potential query string
    let rq = route.split('?');
    return this.removeRoute(`${method}:${rq[0]}`)
  };

  // If has route pattern given the passed method:route string
  hasRoute(route) {
    _checkRouteString(route);
    return super.hasRoute(route);
  };

  // If has route pattern for a particular method and route pattern
  hasMethodRoute(method, route) {
    method = _checkMethod(method);
    // Separate potential query string
    let rq = route.split('?');
    return this.hasRoute(`${method}:${rq[0]}`);
  };

  // Get a pretty listing of the methods, routes and actions
  toString() {
    let data = [];
    for (let i = 0; i < this.routes().length; i++) {
      let r = this.routes()[i].split(':');
      let method = r[0];
      let route = r[1];
      let action = this.actions()[i].name || this.actions()[i].toString();
      action = action.replace(/\s\s+/g,' ');
      data.push({method: method, route: route, action: action});
    }
    let columns = columnify(data, {
      truncate: true,
      minWidth: 20,
      config: {
        action: {maxWidth: 30},
        method: {maxWidth: 10},
      },
    });
    return columns;
  };
};

/***
* Private FUNCTIONS
***/

// Check the method for errors
let _checkMethod = (method) => {
  if (method && (typeof method) === 'string') {
    method = method.toUpperCase();
    if (!METHODS.includes(method))
      throw new Error(`Routes Error: Method ${method} is not included in: ${METHODS}.`);
  }
  else
    throw new Error(`Routes Error: Method ${method} is not included in: ${METHODS}.`);

  return method;
};

let _checkRouteString = (route) => {
  if (route && (typeof route) === 'string') {
    let method = route.split(':')[0];
    _checkMethod(method);
  }
  else
    throw new Error(`Routes Error: Route must be a string for\nroute: ${route}`);
};

// "STATIC" variables
Routes.POST = 'POST';
Routes.GET = 'GET';
Routes.PUT = 'PUT';
Routes.PATCH = 'PATCH';
Routes.DELETE = 'DELETE';

module.exports = Routes;
