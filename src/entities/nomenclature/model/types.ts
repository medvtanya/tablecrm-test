export type NomenclaturePriceRow = {
  price: number;
  price_type: string;
};

export type Nomenclature = {
  id: number;
  name: string;
  unit?: number | null;
  unit_name?: string | null;
  prices?: NomenclaturePriceRow[];
};

export type NomenclatureListResponse = {
  count: number;
  result: Nomenclature[];
};
