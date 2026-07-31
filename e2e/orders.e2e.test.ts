// End-to-end test: hits the real, already-deployed system from the outside,
// exactly like a real client would — no imports from orders-service or
// inventory-service internals, no mocks. Requires both containers running
// first, from the repo root:
//
//   docker compose up --build -d
//
// ...and `docker compose down` afterwards.
//
// This drives the full chain: HTTP request -> orders-service container ->
// real inventory-service container -> HTTP response.

const ORDERS_URL = process.env.ORDERS_URL || 'http://localhost:4000';
const INVENTORY_URL = process.env.INVENTORY_URL || 'http://localhost:4001';

describe('POST /orders (e2e)', () => {
  it('confirms the order and actually decrements stock in inventory-service', async () => {
    const before = await fetch(`${INVENTORY_URL}/inventory/sku-2`).then((res) => res.json());

    const res = await fetch(`${ORDERS_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku: 'sku-2', quantity: 1 }),
    });
    
    const body = await res.json();
    expect(res.status).toBe(201);
    expect(body.total).toBe(before.price * 1);

    const after = await fetch(`${INVENTORY_URL}/inventory/sku-2`).then((res) => res.json());
    expect(after.quantity).toBe(before.quantity - 1);
  });

  it('returns 502 when the sku does not exist anywhere in the real inventory-service', async () => {
    const res = await fetch(`${ORDERS_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku: 'does-not-exist', quantity: 1 }),
    });

    expect(res.status).toBe(502);
  });

  it('returns 502 when there is not enough real stock to reserve', async () => {
    const res = await fetch(`${ORDERS_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku: 'sku-2', quantity: 999999 }),
    });

    expect(res.status).toBe(502);
  });
});
