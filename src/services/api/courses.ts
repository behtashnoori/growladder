import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : '';

export interface Course {
  code: string;
  title: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseResponse {
  items: Course[];
  total: number;
  page: number;
  pageSize: number;
}

export const courseApi = {
  async getAll(params?: {
    q?: string;
    page?: number;
    pageSize?: number;
    sort?: string;
  }): Promise<CourseResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/courses`, { params });
    return response.data;
  },

  async getById(code: string): Promise<Course> {
    const response = await axios.get(`${API_BASE_URL}/api/courses/${code}`);
    return response.data;
  },

  async create(data: Omit<Course, 'createdAt' | 'updatedAt'>): Promise<Course> {
    const response = await axios.post(`${API_BASE_URL}/api/courses`, data);
    return response.data;
  },

  async update(code: string, data: Partial<Course>): Promise<Course> {
    const response = await axios.put(`${API_BASE_URL}/api/courses/${code}`, data);
    return response.data;
  },

  async patch(code: string, data: Partial<Course>): Promise<Course> {
    const response = await axios.patch(`${API_BASE_URL}/api/courses/${code}`, data);
    return response.data;
  },

  async delete(code: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/api/courses/${code}`);
  },

  async bulkCreate(data: Omit<Course, 'createdAt' | 'updatedAt'>[]): Promise<{ count: number }> {
    const response = await axios.post(`${API_BASE_URL}/api/courses/bulk`, data);
    return response.data;
  }
};