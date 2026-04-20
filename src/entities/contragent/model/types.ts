export type Contragent = {
  id: number;
  name?: string | null;
  phone?: string | null;
};

export type ContragentListResponse = {
  count: number;
  result: Contragent[];
};
