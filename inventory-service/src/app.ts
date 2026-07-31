import express from 'express';
import { getStock, reserveStock, Catalog } from './inventoryLogic';

export const catalog: Catalog = {
  'sku-1': { price: 10, quantity: 20 },
  'sku-2': { price: 25, quantity: 5 },
};

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/inventory/:sku', (req, res) => {
    const item = getStock(catalog, req.params.sku);
    if (!item) return res.status(404).json({ error: 'sku not found' });
    res.json({ sku: req.params.sku, ...item });
  });

  app.post('/inventory/:sku/reserve', (req, res) => {
    const { quantity } = req.body;
    const result = reserveStock(catalog, req.params.sku, quantity);
    if (!result.ok) {
      const status =
        result.error === 'sku not found' ? 404 : result.error === 'invalid quantity' ? 400 : 409;
      return res.status(status).json({ error: result.error });
    }
    res.json({ sku: req.params.sku, remaining: result.remaining });
  });

  return app;
}
