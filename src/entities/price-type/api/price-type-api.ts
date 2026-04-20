import { tablecrmFetchJson } from "@/shared/api/tablecrm-client";
import type { PriceTypeListResponse } from "../model/types";

export function fetchPriceTypes(token: string) {
  return tablecrmFetchJson<PriceTypeListResponse>({
    token,
    path: "price_types",
    searchParams: { limit: 200 },
  });
}
