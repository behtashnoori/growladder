import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : '';

export interface PositionHistory {
  id: number;
  emp_code: string;
  post_code?: string;
  post_title?: string;
  post_rank_code?: string;
  post_rank_title?: string;
  section_code?: string;
  section_title?: string;
  department_code?: string;
  department_title?: string;
  management_code?: string;
  management_title?: string;
  affiliation?: string;
  from_date: string;
  to_date?: string;
  is_current: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PositionHistoryCreate {
  emp_code: string;
  post_code?: string;
  post_title?: string;
  post_rank_code?: string;
  post_rank_title?: string;
  section_code?: string;
  section_title?: string;
  department_code?: string;
  department_title?: string;
  management_code?: string;
  management_title?: string;
  affiliation?: string;
  from_date: string;
  to_date?: string;
  is_current?: boolean;
}

export const positionHistoryApi = {
  async getByPersonnel(emp_code: string): Promise<PositionHistory[]> {
    const response = await axios.get(`${API_BASE_URL}/api/position-history/${emp_code}`);
    return response.data;
  },

  async create(data: PositionHistoryCreate): Promise<PositionHistory> {
    const response = await axios.post(`${API_BASE_URL}/api/position-history`, data);
    return response.data;
  },

  async update(id: number, data: Partial<PositionHistoryCreate>): Promise<PositionHistory> {
    const response = await axios.put(`${API_BASE_URL}/api/position-history/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/api/position-history/${id}`);
  },

  async bulkUpdate(emp_code: string, newPosition: Partial<PositionHistoryCreate>, effectiveDate: string): Promise<PositionHistory> {
    const response = await axios.post(`${API_BASE_URL}/api/position-history/bulk-update`, {
      emp_code,
      newPosition,
      effectiveDate
    });
    return response.data;
  }
};
