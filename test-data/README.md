# test-data

Shared test-data factories for `orders-service` and `inventory-service`.

Not an npm package — it's a plain folder of TypeScript, imported via a relative
path from test files in either service (e.g.
`import { buildInventoryItem } from '../../test-data';`). Both services'
`tsconfig.json` exclude `src/**/*.test.ts` from the production build, so these
files never need to be compiled or shipped — they only exist at test time,
transformed on the fly by `ts-jest`.

## Why

Before this, each test file wrote its own inline objects for things like an
inventory item or an order request. Every test that needed "an item with sku-1
and price 10" duplicated that shape, and it drifted slightly between files
(e.g. `{ sku, price, quantity }` vs `{ sku, quantity }` payloads). A shared
factory keeps the shape consistent and makes intent explicit in each test —
`buildInventoryItem({ quantity: 0 })` reads as "an item with no stock",
instead of a bare object literal you have to decode.

## Usage

```ts
import { buildInventoryItem, buildOrderRequest } from '../../test-data';

const outOfStockItem = buildInventoryItem({ quantity: 0 });
const order = buildOrderRequest({ quantity: 5 });
```

Each `build*` function returns sensible defaults and accepts a
`Partial<...>` of overrides for whatever the test case needs to change.
