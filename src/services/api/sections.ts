import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : '';

export interface Section {
  code: string;
  title: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SectionResponse {
  items: Section[];
  total: number;
}

export const sectionApi = {
  async getAll(params?: {
    q?: string;
    sort?: string;
  }): Promise<SectionResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/sections`, { params });
    return response.data;
  },

  async getById(code: string): Promise<Section> {
    const response = await axios.get(`${API_BASE_URL}/api/sections/${code}`);
    return response.data;
  },

  async create(data: Omit<Section, 'createdAt' | 'updatedAt'>): Promise<Section> {
    const response = await axios.post(`${API_BASE_URL}/api/sections`, data);
    return response.data;
  },

  async update(code: string, data: Partial<Section>): Promise<Section> {
    const response = await axios.put(`${API_BASE_URL}/api/sections/${code}`, data);
    return response.data;
  },

  async patch(code: string, data: Partial<Section>): Promise<Section> {
    const response = await axios.patch(`${API_BASE_URL}/api/sections/${code}`, data);
    return response.data;
  },

  async delete(code: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/api/sections/${code}`);
  },

  async bulkCreate(data: Omit<Section, 'createdAt' | 'updatedAt'>[]): Promise<{ count: number }> {
    const response = await axios.post(`${API_BASE_URL}/api/sections/bulk`, data);
    return response.data;
  }
};
