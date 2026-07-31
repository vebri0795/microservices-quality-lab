export interface InventoryItemData {
  sku: string;
  price: number;
  quantity: number;
}

export function buildInventoryItem(overrides: Partial<InventoryItemData> = {}): InventoryItemData {
  return {
    sku: 'sku-1',
    price: 10,
    quantity: 20,
    ...overrides,
  };
}
