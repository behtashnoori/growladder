import http from "../http";

export type ListParams = {
  q?: string;
  unitId?: string;
  rank?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
};

export async function listEmployees(params: ListParams = {}) {
  const { data } = await http.get("/api/employees", { params });
  // Accept { items, total } or [] shapes
  return Array.isArray(data) ? { items: data, total: data.length } : data;
}
