import { tablecrmFetchJson } from "@/shared/api/tablecrm-client";
import type { CreateSalePayload, CreateSaleResponse } from "../model/types";

export function createSale(
  token: string,
  payload: CreateSalePayload[],
  conduct: boolean,
) {
  return tablecrmFetchJson<CreateSaleResponse>({
    token,
    path: "docs-sales",
    searchParams: { conduct },
    method: "POST",
    body: payload,
  });
}
