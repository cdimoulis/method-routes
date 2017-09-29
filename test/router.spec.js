const Router = require('../src/router');

let router = new Router();
let action1 = () => {return 1;};
let action2 = () => {return 2;};

test('Add route', () => {
  router.addRoute(Router.POST, '/test', action1);
  let routes = router.routes();
  let actions = router.actions();
  expect(routes.length).toBe(1);
  expect(actions.length).toBe(1);
  expect(routes).toContain('/test');
  expect(actions).toContain(action1);
});

test('Clear all', () => {
  router.clearAll();
  let routes = router.routes();
  let actions = router.actions();
  expect(routes.length).toBe(0);
  expect(actions.length).toBe(0);
});

// test('Add routes', () => {
//   router.clearAll();
//   // Create a function without name
//   let f = {};
//   f.x = () => {return 3;};
//   router.addRoutes([
//     ['/test', action1],
//     ['/love', action2],
//     ['/temp', f.x],
//   ]);
//   let routes = router.routes();
//   let actions = router.actions();
//   expect(routes.length).toBe(3);
//   expect(actions.length).toBe(3);
//   expect(routes[1]).toBe('/love');
//   expect(actions[1]).toBe(action2);
// });
//
// test('Get Action', () => {
//   expect(router.getAction('/test')).toBe(action1);
//   expect(router.getAction('/love')).toBe(action2);
//   expect(router.getAction('/not_found')).toBe(-1);
// });
//
// test('Remove route', () => {
//   router.removeRoute('test');
//   let routes = router.routes();
//   expect(routes.length).toBe(3);
//   router.removeRoute('/test');
//   routes = router.routes();
//   let actions = router.actions();
//   expect(routes.length).toBe(2);
//   expect(actions.length).toBe(2);
//   expect(routes).not.toContain('/test');
//   expect(actions).not.toContain(action1);
// });
//
// test('Add route with query', () => {
//   router.addRoute('/query?a=1&b=2', action1);
//   // With no query
//   expect(router.hasRoute('/query')).toBeTruthy();
//   // With query
//   expect(router.hasRoute('/query?peace=love')).toBeTruthy();
//   expect(router.getAction('/query?children=3&parents=2')).toBe(action1);
// });
//
// test('Remove route with query', () => {
//   router.removeRoute('/query');
//   expect(router.hasRoute('/query')).toBeFalsy();
// });
//
// test('Has Route', () => {
//   expect(router.hasRoute('/love')).toBeTruthy();
//   expect(router.hasRoute('/not_found')).toBeFalsy();
// });
//
// test('To String', () => {
//   expect(typeof router.toString()).toBe('string');
// });
//
//
// // EXCEPTIONS
// test('Bad Route', () => {
//   let f = () => {router.addRoute(3, action1)};
//   expect(f).toThrow(/Router Error: Route must be a string/);
// });
//
// test('Bad Action', () => {
//   let f = () => {router.addRoute('/edit',3)};
//   expect(f).toThrow(/Router Error: Action must be a function/);
// });
//
// test('Missmatch routes-actions', () => {
//   let f = () => {
//     router.addRoutes([
//       ['/test',action1],
//       ['/peace']
//     ]);
//   };
//   expect(f).toThrow();
// });
//
// test('Invalid list', () => {
//   let f = () => {router.addRoutes('/edit',action1)};
//   expect(f).toThrow(/Router Error: List must be an array/);
// })

test('Invalid Method', () => {
  let f = () => {router.addRoute('foo', '/love', action1);};
  expect(f).toThrow(/Router Error: Method/);
});
