export interface OrderRequestData {
  sku: string;
  quantity: number;
}

export function buildOrderRequest(overrides: Partial<OrderRequestData> = {}): OrderRequestData {
  return {
    sku: 'sku-1',
    quantity: 2,
    ...overrides,
  };
}
