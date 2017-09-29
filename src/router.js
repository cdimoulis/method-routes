const SimpleRouter = require('simple-routes');

// List of possible methods
const METHODS = [
  'POST',
  'GET',
  'PUT',
  'PATCH',
  'DELETE'
];

class Router extends SimpleRouter {

  constructor(opts) {
    super(opts);

  }

  addRoute(method, route, action) {
    method = method.toUpperCase();
    if (!METHODS.includes(method)) {
      throw `Router Error: Method ${method} is not included in: ${METHODS}`
    }
    console.log(`Method: ${method}`);
    return super.addRoute(route, action);
  };

};

// "STATIC" variables
Router.POST = 'POST';
Router.GET = 'GET';
Router.PUT = 'PUT';
Router.PATCH = 'PATCH';
Router.DELETE = 'DELETE';

module.exports = Router;
