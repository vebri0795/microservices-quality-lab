export interface OrderInput {
  sku?: unknown;
  quantity?: unknown;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateOrderInput(input: OrderInput): ValidationResult {
  if (typeof input.sku !== 'string' || input.sku.trim() === '') {
    return { valid: false, error: 'sku is required' };
  }
  if (typeof input.quantity !== 'number' || input.quantity <= 0) {
    return { valid: false, error: 'quantity must be a positive number' };
  }
  return { valid: true };
}

export function calculateTotal(price: number, quantity: number): number {
  let total: number;

  if (price <= 0 || quantity <= 0) {
    throw new Error('invalid price or quantity');
  } else {
    total = price * quantity;
  }

  return total;
}
