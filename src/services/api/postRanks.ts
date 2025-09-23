import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

export interface PostRank {
  code: string;
  title: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostRankResponse {
  items: PostRank[];
  total: number;
}

export const postRankApi = {
  async getAll(params?: {
    q?: string;
    sort?: string;
  }): Promise<PostRankResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/post-ranks`, { params });
    return response.data;
  },

  async getById(code: string): Promise<PostRank> {
    const response = await axios.get(`${API_BASE_URL}/api/post-ranks/${code}`);
    return response.data;
  },

  async create(data: Omit<PostRank, 'createdAt' | 'updatedAt'>): Promise<PostRank> {
    const response = await axios.post(`${API_BASE_URL}/api/post-ranks`, data);
    return response.data;
  },

  async update(code: string, data: Partial<PostRank>): Promise<PostRank> {
    const response = await axios.put(`${API_BASE_URL}/api/post-ranks/${code}`, data);
    return response.data;
  },

  async patch(code: string, data: Partial<PostRank>): Promise<PostRank> {
    const response = await axios.patch(`${API_BASE_URL}/api/post-ranks/${code}`, data);
    return response.data;
  },

  async delete(code: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/api/post-ranks/${code}`);
  },

  async bulkCreate(data: Omit<PostRank, 'createdAt' | 'updatedAt'>[]): Promise<{ count: number }> {
    const response = await axios.post(`${API_BASE_URL}/api/post-ranks/bulk`, data);
    return response.data;
  }
};

