# e2e

End-to-end tests for the whole system: `orders-service` and `inventory-service`
running for real (as Docker containers), talking to each other for real. No
mocks, no in-process imports of either service's code — these tests only know
about the public HTTP endpoints, exactly like a real client would.

## Running

From the repo root:

```bash
docker compose up --build -d
cd e2e
npm install
npm test
cd ..
docker compose down
```

## Why this is separate from the other test suites

- `orders-service/tests/*.test.ts` (unit) and `orders.component.test.ts`
  (component) never start real containers — they run the app in-process,
  virtualizing or mocking the network.
- The contract tests (`inventoryClient.pact.test.ts` / `pact.verify.test.ts`)
  verify each service against a shared, versioned spec — but the two
  services never run together in the same test.
- These e2e tests are the only ones that exercise the full deployed chain:
  HTTP request → `orders-service` container → real `inventory-service`
  container → HTTP response — the same path a real consumer would hit.
