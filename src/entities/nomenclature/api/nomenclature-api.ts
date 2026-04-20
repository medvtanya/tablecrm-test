import { tablecrmFetchJson } from "@/shared/api/tablecrm-client";
import type { NomenclatureListResponse } from "../model/types";

export function searchNomenclature(token: string, name: string) {
  return tablecrmFetchJson<NomenclatureListResponse>({
    token,
    path: "nomenclature",
    searchParams: {
      name: name.trim(),
      limit: 40,
      with_prices: true,
    },
  });
}
