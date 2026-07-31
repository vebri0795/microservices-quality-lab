// Component test: the real orders-service app (routing, validation, the
// orderLogic it calls) runs for real. Only the network call to
// inventory-service is virtualized via MSW — no real inventory-service
// process, no docker-compose.
import request from 'supertest';
import { rest } from 'msw';
import { server } from './mocks/server';
import { createApp } from '../src/app';
import { getInventoryUrl } from '../src/inventoryClient';
import { buildOrderRequest } from '../../test-data';

const app = createApp();

describe('POST /orders (component)', () => {
  it('confirms the order and returns the total when there is enough stock', async () => {
    const res = await request(app).post('/orders').send(buildOrderRequest());

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ sku: 'sku-1', quantity: 2, total: 20, status: 'confirmed' });
  });

  it('returns 502 when inventory-service reports the sku does not exist', async () => {
    server.use(
      rest.get(`${getInventoryUrl()}/inventory/:sku`, (req, res, ctx) =>
        res(ctx.status(404), ctx.json({ error: 'sku not found' })),
      ),
    );

    const res = await request(app).post('/orders').send(buildOrderRequest());

    expect(res.status).toBe(502);
  });

  it('returns 502 when inventory-service reports insufficient stock', async () => {
    server.use(
      rest.post(`${getInventoryUrl()}/inventory/:sku/reserve`, (req, res, ctx) =>
        res(ctx.status(409), ctx.json({ error: 'insufficient stock' })),
      ),
    );

    const res = await request(app).post('/orders').send(buildOrderRequest());

    expect(res.status).toBe(502);
  });

  it('returns 400 without calling inventory-service at all when the input is invalid', async () => {
    const inventoryCalled = jest.fn();
    server.use(
      rest.get(`${getInventoryUrl()}/inventory/:sku`, (req, res, ctx) => {
        inventoryCalled();
        return res(ctx.status(200), ctx.json({ sku: 'sku-1', price: 10, quantity: 20 }));
      }),
    );

    const res = await request(app).post('/orders').send(buildOrderRequest({ quantity: -1 }));

    expect(res.status).toBe(400);
    expect(inventoryCalled).not.toHaveBeenCalled();
  });
});
