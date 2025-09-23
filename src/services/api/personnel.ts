import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : '';

export interface Personnel {
  emp_code: string;
  name: string;
  employment_date?: string; // تاریخ استخدام
  job_title_id?: string;
  job_title?: string;
  department_id?: string;
  department_name?: string;
  post_code?: string;
  post_title?: string;
  section_code?: string;
  section_title?: string;
  department_code?: string;
  department_title?: string;
  management_code?: string;
  management_title?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersonnelResponse {
  items: Personnel[];
  total: number;
  page: number;
  pageSize: number;
}

export const personnelApi = {
  async getAll(params?: {
    q?: string;
    page?: number;
    pageSize?: number;
    sort?: string;
    job_title_id?: string;
    department_id?: string;
  }): Promise<PersonnelResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/personnel`, { params });
    return response.data;
  },

  async getById(emp_code: string): Promise<Personnel> {
    const response = await axios.get(`${API_BASE_URL}/api/personnel/${emp_code}`);
    return response.data;
  },

  async create(data: Omit<Personnel, 'createdAt' | 'updatedAt'>): Promise<Personnel> {
    const response = await axios.post(`${API_BASE_URL}/api/personnel`, data);
    return response.data;
  },

  async update(emp_code: string, data: Partial<Personnel>): Promise<Personnel> {
    const response = await axios.put(`${API_BASE_URL}/api/personnel/${emp_code}`, data);
    return response.data;
  },

  async patch(emp_code: string, data: Partial<Personnel>): Promise<Personnel> {
    const response = await axios.patch(`${API_BASE_URL}/api/personnel/${emp_code}`, data);
    return response.data;
  },

  async delete(emp_code: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/api/personnel/${emp_code}`);
  },

  async bulkCreate(data: Omit<Personnel, 'createdAt' | 'updatedAt'>[]): Promise<{ count: number }> {
    const response = await axios.post(`${API_BASE_URL}/api/personnel/bulk`, data);
    return response.data;
  }
};
