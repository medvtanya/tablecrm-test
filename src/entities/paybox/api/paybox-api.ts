import { tablecrmFetchJson } from "@/shared/api/tablecrm-client";
import type { PayboxListResponse } from "../model/types";

export function fetchPayboxes(token: string) {
  return tablecrmFetchJson<PayboxListResponse>({
    token,
    path: "payboxes",
    searchParams: { limit: 200 },
  });
}
