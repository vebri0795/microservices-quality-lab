export interface StockItem {
  price: number;
  quantity: number;
}

export type Catalog = Record<string, StockItem>;

export function getStock(catalog: Catalog, sku: string): StockItem | undefined {
  return catalog[sku];
}

export interface ReserveResult {
  ok: boolean;
  remaining?: number;
  error?: string;
}

export function reserveStock(catalog: Catalog, sku: string, quantity: number): ReserveResult {
  let result: ReserveResult;
  const item = getStock(catalog, sku);

  if(!item) {
    result = {
      ok: false,
      error: 'sku not found'
    }
  } else if(item.quantity < quantity) {
    result = {
      ok: false,
      error: 'insufficient stock'
    }
  } else {
    item.quantity = item.quantity - quantity;
    result = {
      ok: true,
      remaining: item.quantity
    }
  }

  return result;
}
