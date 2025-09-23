import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : '';

export interface Post {
  code: string;
  title: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostResponse {
  items: Post[];
  total: number;
}

export const postApi = {
  async getAll(params?: {
    q?: string;
    sort?: string;
  }): Promise<PostResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/posts`, { params });
    return response.data;
  },

  async getById(code: string): Promise<Post> {
    const response = await axios.get(`${API_BASE_URL}/api/posts/${code}`);
    return response.data;
  },

  async create(data: Omit<Post, 'createdAt' | 'updatedAt'>): Promise<Post> {
    const response = await axios.post(`${API_BASE_URL}/api/posts`, data);
    return response.data;
  },

  async update(code: string, data: Partial<Post>): Promise<Post> {
    const response = await axios.put(`${API_BASE_URL}/api/posts/${code}`, data);
    return response.data;
  },

  async patch(code: string, data: Partial<Post>): Promise<Post> {
    const response = await axios.patch(`${API_BASE_URL}/api/posts/${code}`, data);
    return response.data;
  },

  async delete(code: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/api/posts/${code}`);
  },

  async bulkCreate(data: Omit<Post, 'createdAt' | 'updatedAt'>[]): Promise<{ count: number }> {
    const response = await axios.post(`${API_BASE_URL}/api/posts/bulk`, data);
    return response.data;
  }
};
