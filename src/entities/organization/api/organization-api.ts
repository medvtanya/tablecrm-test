import { tablecrmFetchJson } from "@/shared/api/tablecrm-client";
import type { OrganizationListResponse } from "../model/types";

export function fetchOrganizations(token: string) {
  return tablecrmFetchJson<OrganizationListResponse>({
    token,
    path: "organizations",
    searchParams: { limit: 200 },
  });
}
