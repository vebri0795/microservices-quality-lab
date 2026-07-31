import { getInventory, reserveInventory } from './inventoryClient';

// Integration test: requiere que inventory-service esté corriendo DE VERDAD
// (por ejemplo `npm run dev` dentro de inventory-service, o `docker compose up`)
// escuchando en INVENTORY_URL (por defecto http://localhost:4001).
describe('inventoryClient (integration, sin mocks)', () => {
  it('getInventory devuelve el item real del catálogo', async () => {
    const item = await getInventory('sku-1');
    expect(item.sku).toBe('sku-1');
    expect(item.price).toBe(10);
    expect(item.quantity).toBeGreaterThanOrEqual(0);
  });
  it('getInventory rechaza si el sku no existe', async () => {
    await expect(getInventory('sku-inexistente')).rejects.toThrow();
  });
  it('reserveInventory reduce el stock real en inventory-service', async () => {
    const before = await getInventory('sku-1');
    const result = await reserveInventory('sku-1', 1);
    expect(result.remaining).toBe(before.quantity - 1)
  });
});
