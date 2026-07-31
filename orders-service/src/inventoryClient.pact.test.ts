import path from 'path';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import { getInventory, reserveInventory } from './inventoryClient';

const { like } = MatchersV3;

const provider = new PactV3({
  consumer: 'orders-service',
  provider: 'inventory-service',
  dir: path.resolve(process.cwd(), 'pacts'),
});

// Contract test (lado consumidor). No se levanta inventory-service real:
// Pact crea un mock server que responde según la interacción descrita en
// cada test, y si tu código hace la petición que describiste, escribe el
// contrato en pacts/orders-service-inventory-service.json.
describe('Pact contract: orders-service -> inventory-service', () => {
  it('obtiene el inventario de un sku existente', () => {
    provider
      .given('sku-1 existe en el catalogo')
      .uponReceiving('una peticion para obtener sku-1')
      .withRequest({ method: 'GET', path: '/inventory/sku-1' })
      .willRespondWith({
        status: 200,
        body: { sku: 'sku-1', price: like(10), quantity: like(20) },
      });

    return provider.executeTest(async (mockServer) => {
      process.env.INVENTORY_URL = mockServer.url;
      const item = await getInventory('sku-1');
      expect(item.sku).toBe('sku-1');
      expect(typeof item.price).toBe('number');
      expect(typeof item.quantity).toBe('number');
    });
  });

  it('reserva stock cuando hay suficiente', () => {
    provider
      .given('sku-1 tiene stock suficiente')
      .uponReceiving('una peticion para reservar 1 unidad de sku-1')
      .withRequest({
        method: 'POST',
        path: '/inventory/sku-1/reserve',
        body: { quantity: 1 },
      })
      .willRespondWith({
        status: 200,
        body: { sku: 'sku-1', remaining: like(19) },
      });

    return provider.executeTest(async (mockServer) => {
      process.env.INVENTORY_URL = mockServer.url;
      const result = await reserveInventory('sku-1', 1);
      expect(result.sku).toBe('sku-1');
      expect(typeof result.remaining).toBe('number');
    });
  });

  it('rechaza la reserva cuando no hay stock suficiente', () => {
    provider
      .given('sku-1 no tiene stock suficiente')
      .uponReceiving('una peticion para reservar mas stock del disponible')
      .withRequest({
        method: 'POST',
        path: '/inventory/sku-1/reserve',
        body: { quantity: 9999 },
      })
      .willRespondWith({
        status: 409,
        body: { error: 'insufficient stock' },
      });

    return provider.executeTest(async (mockServer) => {
      process.env.INVENTORY_URL = mockServer.url;
      await expect(reserveInventory('sku-1', 9999)).rejects.toThrow();
    });
  });
});
