import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Interceptor to attach Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dropyourstories_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Public API Service
export const PublicService = {
  getStories: async (params?: { search?: string; category?: string; language?: string; sort?: string; page?: number; limit?: number }) => {
    const res = await api.get('/stories', { params });
    return res.data;
  },
  getStoryBySlug: async (slug: string) => {
    const res = await api.get(`/stories/${slug}`);
    return res.data.story;
  },
  getCategories: async () => {
    const res = await api.get('/categories');
    return res.data.categories;
  },
};

// Admin API Service
export const AdminService = {
  login: async (username: string, password: string) => {
    const res = await api.post('/admin/login', { username, password });
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/admin/me');
    return res.data.admin;
  },
  updateSettings: async (data: any) => {
    const res = await api.put('/admin/settings', data);
    return res.data;
  },
  getStories: async (params?: { search?: string; status?: string; language?: string; sort?: string }) => {
    const res = await api.get('/admin/stories', { params });
    return res.data;
  },
  getStoryById: async (id: string) => {
    const res = await api.get(`/admin/stories/${id}`);
    return res.data.story;
  },
  createStory: async (data: any) => {
    const res = await api.post('/admin/stories', data);
    return res.data.story;
  },
  updateStory: async (id: string, data: any) => {
    const res = await api.put(`/admin/stories/${id}`, data);
    return res.data.story;
  },
  deleteStory: async (id: string) => {
    const res = await api.delete(`/admin/stories/${id}`);
    return res.data;
  },
  toggleStatus: async (id: string, status: string) => {
    const res = await api.patch(`/admin/stories/${id}/status`, { status });
    return res.data.story;
  },
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
