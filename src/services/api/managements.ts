import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : '';

export interface Management {
  code: string;
  title: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ManagementResponse {
  items: Management[];
  total: number;
}

export const managementApi = {
  async getAll(params?: {
    q?: string;
    sort?: string;
  }): Promise<ManagementResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/managements`, { params });
    return response.data;
  },

  async getById(code: string): Promise<Management> {
    const response = await axios.get(`${API_BASE_URL}/api/managements/${code}`);
    return response.data;
  },

  async create(data: Omit<Management, 'createdAt' | 'updatedAt'>): Promise<Management> {
    const response = await axios.post(`${API_BASE_URL}/api/managements`, data);
    return response.data;
  },

  async update(code: string, data: Partial<Management>): Promise<Management> {
    const response = await axios.put(`${API_BASE_URL}/api/managements/${code}`, data);
    return response.data;
  },

  async patch(code: string, data: Partial<Management>): Promise<Management> {
    const response = await axios.patch(`${API_BASE_URL}/api/managements/${code}`, data);
    return response.data;
  },

  async delete(code: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/api/managements/${code}`);
  },

  async bulkCreate(data: Omit<Management, 'createdAt' | 'updatedAt'>[]): Promise<{ count: number }> {
    const response = await axios.post(`${API_BASE_URL}/api/managements/bulk`, data);
    return response.data;
  }
};
