export type Paybox = {
  id: number;
  name: string;
  organization_id?: number | null;
  balance?: number;
};

export type PayboxListResponse = {
  count: number;
  result: Paybox[];
};
