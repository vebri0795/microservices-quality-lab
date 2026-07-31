import { validateOrderInput, calculateTotal } from './orderLogic';

describe('validateOrderInput', () => {
  it('accepts a valid input', () => {
    expect(validateOrderInput({ sku: 'sku-1', quantity: 2 })).toEqual({ valid: true });
  });

  it('rejects if sku is missing', () => {
    expect(validateOrderInput({ quantity: 2 })).toEqual({
      valid: false,
      error: 'sku is required',
    });
  });

  it('rejects if quantity is not positive', () => {
    expect(validateOrderInput({ sku: 'sku-1', quantity: 0 })).toEqual({
      valid: false,
      error: 'quantity must be a positive number',
    });
  });
});

describe('calculateTotal', () => {
  it('calculates the total correctly', () => {
    expect(calculateTotal(10, 3)).toBe(60);
  });

  it('throws an error if the price is negative', () => {
    expect(() => calculateTotal(-5, 3)).toThrow('invalid price or quantity');
  });

  it('throws an error if the quantity is negative', () => {
    expect(() => calculateTotal(5, -3)).toThrow('invalid price or quantity');
  });
});
