import http from "../http";

export interface Training {
  id: string;
  employeeId: string;
  courseId: string;
  attendancePercent?: number;
  date?: string;
  status?: string;
}

export async function list(params: { employeeId?: string } = {}) {
  const res = await http.get("/trainings", { params });
  return res.data as { items: Training[]; total: number };
}

export async function create(data: Training) {
  const res = await http.post("/trainings", data);
  return res.data as Training;
}

export async function update(id: string, data: Training) {
  const res = await http.put(`/trainings/${id}`, data);
  return res.data as Training;
}

export async function remove(id: string) {
  const res = await http.delete(`/trainings/${id}`);
  return res.data as Training;
}
