import { request } from "./client";

export interface PriceInfo {
  warehouse_name: string;
  quantity: number;
  unit_cost: number;
  price_s: number;
  price_ultra: number;
  price_enter: number;
}

export interface ProductInfo {
  product_code: string;
  product_name: string;
  prices: PriceInfo[];
}

export const specificApi = {
  getPriceForNomen: (productCode: string) =>
    request<ProductInfo>(
      `/api/v1/specific/product-summary/${encodeURIComponent(productCode)}`
    ),
};
