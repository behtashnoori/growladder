import http from "../http";

export interface Course {
  courseId: string;
  title: string;
  isActive?: boolean;
}

export async function list() {
  const res = await http.get("/courses");
  return res.data as { items: Course[]; total: number };
}

export async function get(id: string) {
  const res = await http.get(`/courses/${id}`);
  return res.data as Course;
}

export async function create(data: Course) {
  const res = await http.post("/courses", data);
  return res.data as Course;
}

export async function update(id: string, data: Course) {
  const res = await http.put(`/courses/${id}`, data);
  return res.data as Course;
}

export async function remove(id: string) {
  const res = await http.delete(`/courses/${id}`);
  return res.data as Course;
}
