export type Organization = {
  id: number;
  short_name?: string | null;
  work_name?: string | null;
  full_name?: string | null;
};

export type OrganizationListResponse = {
  count: number;
  result: Organization[];
};
