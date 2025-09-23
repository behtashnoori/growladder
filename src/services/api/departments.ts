import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : '';

export interface Department {
  code: string;
  title: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentResponse {
  items: Department[];
  total: number;
}

export const departmentApi = {
  async getAll(params?: {
    q?: string;
    sort?: string;
  }): Promise<DepartmentResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/departments`, { params });
    return response.data;
  },

  async getById(code: string): Promise<Department> {
    const response = await axios.get(`${API_BASE_URL}/api/departments/${code}`);
    return response.data;
  },

  async create(data: Omit<Department, 'createdAt' | 'updatedAt'>): Promise<Department> {
    const response = await axios.post(`${API_BASE_URL}/api/departments`, data);
    return response.data;
  },

  async update(code: string, data: Partial<Department>): Promise<Department> {
    const response = await axios.put(`${API_BASE_URL}/api/departments/${code}`, data);
    return response.data;
  },

  async patch(code: string, data: Partial<Department>): Promise<Department> {
    const response = await axios.patch(`${API_BASE_URL}/api/departments/${code}`, data);
    return response.data;
  },

  async delete(code: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/api/departments/${code}`);
  },

  async bulkCreate(data: Omit<Department, 'createdAt' | 'updatedAt'>[]): Promise<{ count: number }> {
    const response = await axios.post(`${API_BASE_URL}/api/departments/bulk`, data);
    return response.data;
  }
};
