import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : '';

export interface Job {
  job_title_id: string;
  job_title: string;
  department_name?: string;
  department_id?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobResponse {
  items: Job[];
  total: number;
  page: number;
  pageSize: number;
}

export const jobApi = {
  async getAll(params?: {
    q?: string;
    page?: number;
    pageSize?: number;
    sort?: string;
    department_id?: string;
  }): Promise<JobResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/jobs`, { params });
    return response.data;
  },

  async getById(job_title_id: string): Promise<Job> {
    const response = await axios.get(`${API_BASE_URL}/api/jobs/${job_title_id}`);
    return response.data;
  },

  async create(data: Omit<Job, 'createdAt' | 'updatedAt'>): Promise<Job> {
    const response = await axios.post(`${API_BASE_URL}/api/jobs`, data);
    return response.data;
  },

  async update(job_title_id: string, data: Partial<Job>): Promise<Job> {
    const response = await axios.put(`${API_BASE_URL}/api/jobs/${job_title_id}`, data);
    return response.data;
  },

  async patch(job_title_id: string, data: Partial<Job>): Promise<Job> {
    const response = await axios.patch(`${API_BASE_URL}/api/jobs/${job_title_id}`, data);
    return response.data;
  },

  async delete(job_title_id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/api/jobs/${job_title_id}`);
  },

  async bulkCreate(data: Omit<Job, 'createdAt' | 'updatedAt'>[]): Promise<{ count: number }> {
    const response = await axios.post(`${API_BASE_URL}/api/jobs/bulk`, data);
    return response.data;
  }
};
