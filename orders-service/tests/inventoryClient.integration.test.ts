import { getInventory, reserveInventory } from '../src/inventoryClient';

// Integration test: requires inventory-service to be running for REAL
// (e.g. `npm run dev` inside inventory-service, or `docker compose up`)
// listening on INVENTORY_URL (defaults to http://localhost:4001).
describe('inventoryClient (integration, no mocks)', () => {
  it('getInventory returns the real item from the catalog', async () => {
    const item = await getInventory('sku-1');
    expect(item.sku).toBe('sku-1');
    expect(item.price).toBe(10);
    expect(item.quantity).toBeGreaterThanOrEqual(0);
  });
  it('getInventory rejects if the sku does not exist', async () => {
    await expect(getInventory('nonexistent-sku')).rejects.toThrow();
  });
  it('reserveInventory reduces the real stock in inventory-service', async () => {
    const before = await getInventory('sku-1');
    const result = await reserveInventory('sku-1', 1);
    expect(result.remaining).toBe(before.quantity - 1)
  });
});
