import path from 'path';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import { getInventory, reserveInventory } from '../src/inventoryClient';

const { like } = MatchersV3;

const provider = new PactV3({
  consumer: 'orders-service',
  provider: 'inventory-service',
  dir: path.resolve(process.cwd(), 'pacts'),
});

// Contract test (consumer side). No real inventory-service is started:
// Pact creates a mock server that responds according to the interaction
// described in each test, and if your code makes the request you described,
// it writes the contract to pacts/orders-service-inventory-service.json.
describe('Pact contract: orders-service -> inventory-service', () => {
  it('gets the inventory for an existing sku', () => {
    provider
      .given('sku-1 exists in the catalog')
      .uponReceiving('a request to get sku-1')
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

  it('reserves stock when there is enough', () => {
    provider
      .given('sku-1 has enough stock')
      .uponReceiving('a request to reserve 1 unit of sku-1')
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

  it('rejects the reservation when there is not enough stock', () => {
    provider
      .given('sku-1 does not have enough stock')
      .uponReceiving('a request to reserve more stock than available')
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
