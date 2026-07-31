import { rest } from 'msw';
import { getInventoryUrl } from '../../src/inventoryClient';
import { buildInventoryItem } from '../../../test-data';

// MSW handlers that stand in for inventory-service over HTTP, so component
// tests can drive the real orders-service app without a real inventory-service
// process. Happy path only — tests override with server.use(...) for the
// 404/409 cases.
export const handlers = [
  rest.get(`${getInventoryUrl()}/inventory/:sku`, (req, res, ctx) => {
    const { sku } = req.params;
    return res(ctx.status(200), ctx.json(buildInventoryItem({ sku: sku as string })));
  }),

  rest.post(`${getInventoryUrl()}/inventory/:sku/reserve`, (req, res, ctx) => {
    const { sku } = req.params;
    return res(ctx.status(200), ctx.json({ sku, remaining: 18 }));
  }),
];
