import { getStock, reserveStock, Catalog } from './inventoryLogic';

describe('getStock', () => {
  it('returns the item if the sku exists', () => {
    const catalog: Catalog = { 'sku-1': { price: 10, quantity: 5 } };
    expect(getStock(catalog, 'sku-1')).toEqual({ price: 10, quantity: 5 });
  });

  it('returns undefined if the sku does not exist', () => {
    const catalog: Catalog = {};
    expect(getStock(catalog, 'sku-x')).toBeUndefined();
  });
});

describe('reserveStock', () => {
  it('reserves stock when there is enough', () => {
    const catalog: Catalog = { 'sku-1': { price: 10, quantity: 5 } };
    const result = reserveStock(catalog, 'sku-1', 2);
    expect(result).toEqual({ ok: true, remaining: 3 });
  });

  it('rejects the reservation when there is not enough stock', () => {
    const catalog: Catalog = { 'sku-1': { price: 10, quantity: 1 } };
    const result = reserveStock(catalog, 'sku-1', 5);
    expect(result).toEqual({ ok: false, error: 'insufficient stock' });
  });

  it('rejects the reservation when the sku does not exist', () => {
    const catalog: Catalog = {};
    const result = reserveStock(catalog, 'sku-x', 1);
    expect(result).toEqual({ ok: false, error: 'sku not found' });
  });
});
