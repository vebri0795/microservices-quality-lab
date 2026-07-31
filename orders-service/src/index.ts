import express from 'express';
import { validateOrderInput, calculateTotal } from './orderLogic';
import { reserveInventory, getInventory } from './inventoryClient';

const app = express();
app.use(express.json());

app.post('/orders', async (req, res) => {
  const validation = validateOrderInput(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const { sku, quantity } = req.body;

  try {
    const item = await getInventory(sku);
    await reserveInventory(sku, quantity);
    const total = calculateTotal(item.price, quantity);
    res.status(201).json({ sku, quantity, total, status: 'confirmed' });
  } catch (err: any) {
    res.status(502).json({ error: 'could not process order', detail: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`orders-service listening on ${PORT}`));
