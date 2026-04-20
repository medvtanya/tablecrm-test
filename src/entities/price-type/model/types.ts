export type PriceType = {
  id: number;
  name: string;
};

export type PriceTypeListResponse = {
  count: number;
  result: PriceType[];
};
