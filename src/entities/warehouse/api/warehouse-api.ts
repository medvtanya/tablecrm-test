import { tablecrmFetchJson } from "@/shared/api/tablecrm-client";
import type { WarehouseListResponse } from "../model/types";

export function fetchWarehouses(token: string) {
  return tablecrmFetchJson<WarehouseListResponse>({
    token,
    path: "warehouses",
    searchParams: { limit: 200 },
  });
}
