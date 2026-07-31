import path from 'path';
import { Verifier } from '@pact-foundation/pact';
import { createApp } from './app';

const PORT = 4444;
const PACT_FILE = path.resolve(
  __dirname,
  '../../orders-service/pacts/orders-service-inventory-service.json',
);

// Verificación de contrato (lado proveedor).
// Arranca inventory-service de verdad en un puerto de prueba y comprueba que
// cumple, petición por petición, el contrato que orders-service generó como
// consumidor (ver orders-service/src/inventoryClient.pact.test.ts). Requiere
// haber corrido `npm run test:pact` en orders-service al menos una vez, para
// que exista el archivo del contrato.
describe('Pact verification: inventory-service (provider)', () => {
  it('cumple el contrato generado por orders-service', () => {
    const server = createApp().listen(PORT);

    return new Verifier({
      provider: 'inventory-service',
      providerBaseUrl: `http://localhost:${PORT}`,
      pactUrls: [PACT_FILE],
      stateHandlers: {
        'sku-1 existe en el catalogo': () => Promise.resolve('ok'),
        'sku-1 tiene stock suficiente': () => Promise.resolve('ok'),
        'sku-1 no tiene stock suficiente': () => Promise.resolve('ok'),
      },
    })
      .verifyProvider()
      .finally(() => server.close());
  });
});
