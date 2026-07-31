# Phase 1 — Fundamentals + first microservice

Two services: `inventory-service` and `orders-service`. `orders-service`
receives orders and asks `inventory-service` whether there's stock before
confirming.

The boilerplate (Express server, routes, Docker, tsconfig) is already set up
so you don't waste time on that. What's left to implement are two pure logic
functions — exactly the pieces that get unit tested.

## What you need to do

1. `cd inventory-service && npm install`
2. Open `src/inventoryLogic.ts` and complete `reserveStock` (the rules are
   in the TODO comment right above the function).
3. Run `npm test` — the `reserveStock` tests should pass.
4. Do the same in `orders-service`: `npm install`, complete
   `calculateTotal` in `src/orderLogic.ts`, run `npm test`.
5. Once both `npm test` pass, bring everything up together from the root:
   ```
   docker-compose up --build
   ```
6. Test the full flow:
   ```
   curl -X POST http://localhost:4000/orders \
     -H "Content-Type: application/json" \
     -d '{"sku":"sku-1","quantity":2}'
   ```
   You should get a 201 with the calculated total.

## "Done" definition for this phase

- [ ] `npm test` passes in both services without touching the `.test.ts` files
- [ ] `docker-compose up` brings up both services with no errors
- [ ] The curl request above responds 201 with the correct total
- [ ] You can explain in one sentence the difference between what
      `orderLogic.test.ts` tests (unit, everything mocked) and what you'd
      test if you made the two services talk to each other for real
      (that's Phase 2)

## Next step

Once you have it, tell me "finished phase 1" and we'll review your
implementation before moving on to integration tests + contract testing
with Pact.
