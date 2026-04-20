export type Warehouse = {
  id: number;
  name: string;
  address?: string | null;
};

export type WarehouseListResponse = {
  count: number;
  result: Warehouse[];
};
