import { getStock, reserveStock, Catalog } from './inventoryLogic';

describe('getStock', () => {
  it('devuelve el item si el sku existe', () => {
    const catalog: Catalog = { 'sku-1': { price: 10, quantity: 5 } };
    expect(getStock(catalog, 'sku-1')).toEqual({ price: 10, quantity: 5 });
  });

  it('devuelve undefined si el sku no existe', () => {
    const catalog: Catalog = {};
    expect(getStock(catalog, 'sku-x')).toBeUndefined();
  });
});

describe('reserveStock', () => {
  it('reserva stock cuando hay suficiente', () => {
    const catalog: Catalog = { 'sku-1': { price: 10, quantity: 5 } };
    const result = reserveStock(catalog, 'sku-1', 2);
    expect(result).toEqual({ ok: true, remaining: 3 });
  });

  it('rechaza la reserva cuando no hay suficiente stock', () => {
    const catalog: Catalog = { 'sku-1': { price: 10, quantity: 1 } };
    const result = reserveStock(catalog, 'sku-1', 5);
    expect(result).toEqual({ ok: false, error: 'insufficient stock' });
  });

  it('rechaza la reserva cuando el sku no existe', () => {
    const catalog: Catalog = {};
    const result = reserveStock(catalog, 'sku-x', 1);
    expect(result).toEqual({ ok: false, error: 'sku not found' });
  });
});
