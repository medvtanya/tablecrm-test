import { tablecrmFetchJson } from "@/shared/api/tablecrm-client";
import type { ContragentListResponse } from "../model/types";

export function fetchContragentsByPhone(token: string, phone: string) {
  return tablecrmFetchJson<ContragentListResponse>({
    token,
    path: "contragents",
    searchParams: { phone: phone.trim(), limit: 50 },
  });
}
