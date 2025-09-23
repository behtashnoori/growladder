import http from "../http";

export interface Training {
  emp_code: string;
  course_code: string;
  status?: string;
  attendancePercent?: number;
  absencePercent?: number;
  hours?: number;
  from?: string;
  to?: string;
}

export async function list(params: { emp_code?: string } = {}) {
  const res = await http.get("/api/trainings", { params });
  return res.data as { items: Training[]; total: number };
}

export async function create(data: Training) {
  const res = await http.post("/api/trainings", data);
  return res.data as Training;
}

export async function update(emp_code: string, course_code: string, data: Training) {
  const res = await http.put(`/trainings/${emp_code}/${course_code}`, data);
  return res.data as Training;
}

export async function remove(emp_code: string, course_code: string) {
  const res = await http.delete(`/trainings/${emp_code}/${course_code}`);
  return res.data as Training;
}
