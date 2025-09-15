import http from "../http";

export interface JobRequirement {
  id: string;
  unitId?: string;
  jobTitle: string;
  courseId: string;
  type?: string;
  priority?: string;
}

export async function list(params: { unitId?: string } = {}) {
  const res = await http.get("/job-requirements", { params });
  return res.data as { items: JobRequirement[]; total: number };
}

export async function get(id: string) {
  const res = await http.get(`/job-requirements/${id}`);
  return res.data as JobRequirement;
}

export async function create(data: JobRequirement) {
  const res = await http.post("/job-requirements", data);
  return res.data as JobRequirement;
}

export async function update(id: string, data: JobRequirement) {
  const res = await http.put(`/job-requirements/${id}`, data);
  return res.data as JobRequirement;
}

export async function remove(id: string) {
  const res = await http.delete(`/job-requirements/${id}`);
  return res.data as JobRequirement;
}
