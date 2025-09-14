import http from "../http";

export interface Employee {
  id: string;
  fullName: string;
  unitId?: string;
  departmentId?: string;
  sectionId?: string;
  rank?: string;
  hireDate?: string;
  positionStartDate?: string;
  isActive?: boolean;
}

export interface ListParams {
  q?: string;
  unitId?: string;
  rank?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}

export async function list(params: ListParams = {}) {
  const res = await http.get("/api/employees", { params });
  return res.data as { items: Employee[]; total: number; page: number; pageSize: number };
}

export async function get(id: string) {
  const res = await http.get(`/api/employees/${id}`);
  return res.data as Employee;
}

export async function create(data: Employee) {
  const res = await http.post("/api/employees", data);
  return res.data as Employee;
}

export async function update(id: string, data: Employee) {
  const res = await http.put(`/api/employees/${id}`, data);
  return res.data as Employee;
}

export async function patch(id: string, data: Partial<Employee>) {
  const res = await http.patch(`/api/employees/${id}`, data);
  return res.data as Employee;
}

export async function remove(id: string) {
  const res = await http.delete(`/api/employees/${id}`);
  return res.data as Employee;
}
