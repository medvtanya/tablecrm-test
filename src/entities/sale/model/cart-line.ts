import type { Nomenclature } from "@/entities/nomenclature/model/types";

export type CartLine = {
  id: string;
  nomenclature: Nomenclature;
  quantity: number;
  unitPrice: number;
};
