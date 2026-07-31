import { server } from './server';

// Runs once per test file, after the test framework (describe/it) is ready.
// Wires the MSW server into every test's lifecycle so inventory-service is
// intercepted network-level instead of actually being called.
beforeAll(() =>
  server.listen({
    onUnhandledRequest(req, print) {
      // supertest talks to the app under test itself over 127.0.0.1 — that's
      // not inventory-service (which is called via "localhost"), let it through.
      if (req.url.hostname === '127.0.0.1') return;
      print.error();
    },
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
