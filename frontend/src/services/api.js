import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const authApi = {
  register: (payload) => api.post('/api/auth/register', payload),
  login: (payload) => api.post('/api/auth/login', payload),
};

export const gearApi = {
  list: (params) => api.get('/api/gears', { params }),
  create: (payload) => api.post('/api/gears', payload),
  update: (id, payload) => api.patch(`/api/gears/${id}`, payload),
  remove: (id) => api.delete(`/api/gears/${id}`),
  priceHistory: (id) => api.get(`/api/gears/${id}/price-history`),
};

export const dashboardApi = {
  get: () => api.get('/api/dashboard'),
};

export const crawlApi = {
  listProducts: () => api.get('/api/crawl/products'),
  search: (keyword) => api.get('/api/crawl/search', { params: { keyword } }),
};
