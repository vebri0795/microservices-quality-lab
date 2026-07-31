// This client talks to inventory-service over HTTP.
import axios from 'axios';

export function getInventoryUrl(): string {
  return process.env.INVENTORY_URL || 'http://localhost:4001';
}

export interface ReserveResponse {
  sku: string;
  remaining: number;
}

export interface InventoryItem {
  sku: string;
  price: number;
  quantity: number;
}

export async function reserveInventory(sku: string, quantity: number): Promise<ReserveResponse> {
  const res = await axios.post(`${getInventoryUrl()}/inventory/${sku}/reserve`, { quantity });
  return res.data;
}

export async function getInventory(sku: string): Promise<InventoryItem> {
  const res = await axios.get(`${getInventoryUrl()}/inventory/${sku}`);
  return res.data;
}
