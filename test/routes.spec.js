const Routes = require('../src/routes');

let routes = new Routes();
let post_action = () => {return 1;};
let get_action = () => {return 2;};
let put_action = () => {return 3;};
let delete_action = () => {return 4;};

test('Add Route', () => {
  routes.addRoute('DELETE:/temp', delete_action);
  expect(routes.routes().length).toBe(1);
  expect(routes.actions().length).toBe(1);
  expect(routes.routes()).toContain('DELETE:/temp');
  expect(routes.actions()).toContain(delete_action);
});

test('Add method route', () => {
  routes.addMethodRoute(Routes.POST, '/test', post_action);
  expect(routes.routes().length).toBe(2);
  expect(routes.actions().length).toBe(2);
  expect(routes.routes()[1]).toBe('POST:/test');
  expect(routes.actions()[1]).toBe(post_action);
});

test('Already Exists', () => {
  routes.addMethodRoute(Routes.POST, '/test?b=4', get_action);
  expect(routes.routes().length).toBe(2);
  expect(routes.actions().length).toBe(2);
  expect(routes.actions()[1]).toBe(post_action);
});

test('Clear all', () => {
  routes.clearAll();
  expect(routes.routes().length).toBe(0);
  expect(routes.actions().length).toBe(0);
});

test('Add routes', () => {
  routes.clearAll();
  // Create a function without name
  let f = {};
  f.x = () => {return 3;};
  routes.addRoutes([
    [Routes.POST, '/test', post_action],
    [Routes.GET, '/test', get_action],
    [Routes.PUT, '/love/*', put_action],
    [Routes.DELETE, '/temp', delete_action],
  ]);
  let _routes = routes.routes();
  let _actions = routes.actions();
  expect(_routes.length).toBe(4);
  expect(_actions.length).toBe(4);
  expect(_routes[2]).toBe('PUT:/love/*');
  expect(_actions[2]).toBe(put_action);
});

test('Get Action', () => {
  expect(routes.getMethodAction(Routes.POST, '/test')).toBe(post_action);
  expect(routes.getMethodAction(Routes.GET, '/test')).toBe(get_action);
  expect(routes.getMethodAction(Routes.PUT, '/love/food')).toBe(put_action);
  expect(routes.getMethodAction(Routes.DELETE, '/not_found')).toBeUndefined();
});

test('Get Route Match', () => {
  routes.addRoutes([
    [Routes.POST, '/a/b/*/c', post_action],
    [Routes.GET, '/*/b/*/c', get_action]
  ]);
  expect(routes.getMethodRouteMatch(Routes.POST, '/a/b/z/c')).toBe('POST:/a/b/*/c');
  expect(routes.getMethodRouteMatch(Routes.GET, '/x/b/z/c')).toBe('GET:/*/b/*/c');
  expect(routes.getMethodRouteMatch(Routes.PUT, '/love/q')).toBe('PUT:/love/*');
  expect(routes.getMethodRouteMatch(Routes.POST, '/a/b/z/c/d')).toBeUndefined();
  routes.removeMethodRoute(Routes.POST, '/a/b/*/c');
  routes.removeMethodRoute(Routes.GET, '/*/b/*/c');
});

test('Remove route', () => {
  routes.removeMethodRoute(Routes.POST, 'test');
  expect( routes.routes().length).toBe(4);
  routes.removeMethodRoute(Routes.POST, '/test');
  expect(routes.routes().length).toBe(3);
  expect(routes.actions().length).toBe(3);
  expect(routes.routes()).not.toContain('POST:/test');
  expect(routes.actions()).not.toContain(post_action);
});

test('Add route with query', () => {
  routes.addMethodRoute(Routes.POST, '/query?a=1&b=2', post_action);
  // With no query
  expect(routes.hasMethodRoute(Routes.POST, '/query')).toBeTruthy();
  // With query
  expect(routes.hasMethodRoute(Routes.POST, '/query?peace=love')).toBeTruthy();
  expect(routes.getMethodAction(Routes.POST, '/query?children=3&parents=2')).toBe(post_action);
});

test('Has Route (including query)', () => {
  expect(routes.hasMethodRoute(Routes.PUT, '/love/*')).toBeTruthy();
  expect(routes.hasMethodRoute(Routes.GET, '/love/*')).toBeFalsy();
  expect(routes.hasMethodRoute(Routes.POST, '/query?z=3&y=4')).toBeTruthy();
  expect(routes.hasMethodRoute(Routes.POST, '/not_found')).toBeFalsy();
});

test('Remove route with query', () => {
  routes.removeMethodRoute(Routes.POST, '/query?c=4&d=6');
  expect(routes.hasMethodRoute(Routes.POST, '/query')).toBeFalsy();
});

// test('To String', () => {
//   expect(typeof routes.toString()).toBe('string');
// });
//
//
// // EXCEPTIONS
test('Bad Route', () => {
  let f = () => {routes.addMethodRoute(Routes.POST, 3, post_action)};
  expect(f).toThrow(/Routes Error: Route must be a string/);
});

test('Bad Action', () => {
  let f = () => {routes.addMethodRoute(Routes.POST, '/edit', 3)};
  expect(f).toThrow(/Routes Error: Action must be a function/);
});

// test('Missmatch routes-actions', () => {
//   let f = () => {
//     routes.addRoutes([
//       ['/test',post_action],
//       ['/peace']
//     ]);
//   };
//   expect(f).toThrow();
// });
//
// test('Invalid list', () => {
//   let f = () => {routes.addRoutes('/edit',post_action)};
//   expect(f).toThrow(/Routes Error: List must be an array/);
// })

test('Invalid Method', () => {
  let f = () => {routes.addMethodRoute('foo', '/love', post_action);};
  expect(f).toThrow(/Routes Error: Method/);
  let g = () => {routes.addRoute('foo:/love', post_action);};
  expect(g).toThrow(/Routes Error: Method/);
});
