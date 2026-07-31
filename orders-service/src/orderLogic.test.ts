import { validateOrderInput, calculateTotal } from './orderLogic';

describe('validateOrderInput', () => {
  it('acepta un input valido', () => {
    expect(validateOrderInput({ sku: 'sku-1', quantity: 2 })).toEqual({ valid: true });
  });

  it('rechaza si falta el sku', () => {
    expect(validateOrderInput({ quantity: 2 })).toEqual({
      valid: false,
      error: 'sku is required',
    });
  });

  it('rechaza si la cantidad no es positiva', () => {
    expect(validateOrderInput({ sku: 'sku-1', quantity: 0 })).toEqual({
      valid: false,
      error: 'quantity must be a positive number',
    });
  });
});

describe('calculateTotal', () => {
  it('calcula el total correctamente', () => {
    expect(calculateTotal(10, 3)).toBe(30);
  });

  it('lanza un error si el precio es negativo', () => {
    expect(() => calculateTotal(-5, 3)).toThrow('invalid price or quantity');
  });

  it('lanza un error si la cantidad es negativa', () => {
    expect(() => calculateTotal(5, -3)).toThrow('invalid price or quantity');
  });
});
