[![CI](https://github.com/vebri0795/microservices-quality-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/vebri0795/microservices-quality-lab/actions/workflows/ci.yml)

# Microservices Quality Lab

A small two-service system used as a hands-on lab for applying the full test
pyramid, contract testing, quality gates in CI, and end-to-end testing — the
core toolkit of a Quality Engineer working on microservices.

## Architecture

```
        POST /orders                 GET /inventory/:sku
 client ─────────────► orders-service ─────────────────► inventory-service
                         (port 4000)  POST /inventory/:sku/reserve (port 4001)
```

- **`inventory-service`** owns the catalog (in-memory: sku, price, quantity).
  Exposes `GET /inventory/:sku` and `POST /inventory/:sku/reserve`.
- **`orders-service`** receives `POST /orders`, validates the input, asks
  `inventory-service` for the item's price and reserves the requested
  quantity, calculates the total, and confirms (`201`) or reports a downstream
  failure (`502`).
- Both are plain TypeScript + Express, each with its own `Dockerfile`.
  `orders-service` talks to `inventory-service` over HTTP via `axios`
  (`orders-service/src/inventoryClient.ts`), never by importing its code.

## Project structure

```
inventory-service/
  src/           production code only
  tests/         everything test-related (unit tests, tests/tsconfig.json)
orders-service/
  src/
  tests/         unit, component, integration, contract tests + MSW mocks
test-data/       shared fixture factories, used by both services' tests
e2e/             standalone suite that exercises the whole deployed system
```

`src/` and `tests/` are kept separate on purpose: `npm run build` only ever
compiles `src/`, so test code, mocks, and fixtures never ship in a production
image. Each service's `tests/tsconfig.json` extends the base config so the
editor and `ts-jest` still get full type support for files under `tests/`.

## The test pyramid, applied

Five layers, each catching a different class of bug — deliberately chosen so
no two layers protect against the same failure:

| Layer | Where | What runs for real | What's virtualized | Bug it catches |
|---|---|---|---|---|
| **Unit** | `*.test.ts` in each `tests/` | Pure functions (`orderLogic`, `inventoryLogic`) | Everything — no HTTP, no I/O | Wrong business rules, e.g. bad total math or a validation edge case |
| **Component** | `orders.component.test.ts` | The real Express app, via `supertest` | The network call to `inventory-service`, via MSW | Routing/wiring bugs, or `orders-service` mishandling a `404`/`409` from its dependency — without needing a second process running |
| **Integration** | `inventoryClient.integration.test.ts` | A real `inventory-service`, called over real HTTP | Nothing | Wire-format mismatches, wrong env/URL config — anything a mock could hide |
| **Contract** | `inventoryClient.pact.test.ts` (consumer) + `pact.verify.test.ts` (provider) | Pact's mock server (consumer side) / the real provider (provider side) | The other service, on each side | A breaking API change on either side, caught before the two services ever run together in a shared environment |
| **End-to-end** | `e2e/orders.e2e.test.ts` | Both services as real Docker containers (`docker compose up --build`) | Nothing | Anything below can't see: a broken `Dockerfile`, wrong `docker-compose` networking, misconfigured env vars — does the *shipped* system actually work |

## CI/CD — quality gates

`.github/workflows/ci.yml` runs on every PR to `main`:

```
lint-and-unit (orders-service) ┐
lint-and-unit (inventory-service) ┴─► contract-tests ─┬─► docker-build (orders-service)
                                                       ├─► docker-build (inventory-service)
                                                       └─► e2e
```

All 6 jobs are configured as **required status checks** on `main` (branch
protection, admins included) — a failing job physically blocks the merge
button, not just a red badge someone can ignore.

## Build tools: shared test data

[`test-data/`](test-data/README.md) is a small internal library — plain
TypeScript, not an npm package — with factory functions
(`buildInventoryItem`, `buildOrderRequest`) that both services' test suites
import. It exists so "an item with sku-1 and price 10" has exactly one
definition instead of drifting across test files.

## Notable decisions

- **`axios` in production code, `fetch` in e2e tests.** `orders-service`
  relies on `axios` throwing on a non-2xx response to drive its
  `try`/`catch` → `502` flow. The e2e suite does the opposite — it needs to
  *inspect* `404`/`502` responses without an exception interrupting the
  assertion — so plain `fetch` (which never throws on HTTP error status) is
  the better fit there, with no extra dependency needed.
- **MSW v1, not v2.** v2's transitive dependencies are ESM-only and broke
  under this project's CommonJS Jest/`ts-jest` setup. Downgrading to v1 was
  simpler than migrating the whole project to ESM.
- **No `rootDir` in `tsconfig.json`.** `test-data/` sits outside both
  services' `src/`; an explicit `rootDir` made TypeScript reject any import
  crossing that boundary. Removing it lets each invocation (build vs. test)
  infer its own root.
- **Phase 5 was scoped down on purpose.** The original plan included
  provisioning a local Kubernetes cluster and deploying via ArgoCD. That's
  Platform/DevOps work, not something a QA Automation Engineer typically
  owns — so only the e2e suite (writing and maintaining tests against an
  already-deployed system) was built, which *is* core to the role.

## Running it locally

```bash
# per service
cd orders-service && npm install
npm test                 # unit + component (network mocked)
npm run test:integration # needs a real inventory-service running
npm run test:pact        # contract tests (consumer + provider)

cd ../inventory-service && npm install
npm test
npm run test:pact

# whole system, real containers
cd ..
docker compose up --build -d
cd e2e && npm install && npm test
cd .. && docker compose down
```
