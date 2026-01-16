const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('auth_token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          this.setToken(null);
          window.location.href = '/login';
        }
        throw new Error(data.message || 'Une erreur est survenue');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  async upload(endpoint, formData) {
    const url = `${API_URL}${endpoint}`;
    const headers = {};
    
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors du téléversement');
    }

    return data;
  }
}

export const api = new ApiService();

// Auth API
export const authApi = {
  login: (email, password) => api.post('/login', { email, password }),
  register: (data) => api.post('/register', data),
  logout: () => api.post('/logout'),
  me: () => api.get('/me'),
  updateProfile: (data) => api.put('/profile', data),
  changePassword: (data) => api.put('/password', data),
};

// Dashboard API
export const dashboardApi = {
  getSuperAdminStats: () => api.get('/dashboard/super-admin'),
  getClientAdminStats: () => api.get('/dashboard/client-admin'),
};

// Companies API
export const companiesApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/companies${query ? `?${query}` : ''}`);
  },
  getOne: (id) => api.get(`/companies/${id}`),
  create: (data) => api.post('/companies', data),
  update: (id, data) => api.put(`/companies/${id}`, data),
  delete: (id) => api.delete(`/companies/${id}`),
  suspend: (id) => api.post(`/companies/${id}/suspend`),
  activate: (id) => api.post(`/companies/${id}/activate`),
  getStats: () => api.get('/companies/stats'),
};

// Documents API
export const documentsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/documents${query ? `?${query}` : ''}`);
  },
  getOne: (id) => api.get(`/documents/${id}`),
  create: (formData) => api.upload('/documents', formData),
  update: (id, data) => api.put(`/documents/${id}`, data),
  delete: (id) => api.delete(`/documents/${id}`),
  download: (id) => `${API_URL}/documents/${id}/download`,
  archive: (id) => api.post(`/documents/${id}/archive`),
  restore: (id) => api.post(`/documents/${id}/restore`),
  getStats: () => api.get('/documents/stats'),
};

// Folders API
export const foldersApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/folders${query ? `?${query}` : ''}`);
  },
  getTree: () => api.get('/folders/tree'),
  getOne: (id) => api.get(`/folders/${id}`),
  create: (data) => api.post('/folders', data),
  update: (id, data) => api.put(`/folders/${id}`, data),
  delete: (id) => api.delete(`/folders/${id}`),
};

// Users API
export const usersApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/users${query ? `?${query}` : ''}`);
  },
  getOne: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  resetPassword: (id, password) => api.post(`/users/${id}/reset-password`, { password }),
};

// Activity Logs API
export const activityLogsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/activity-logs${query ? `?${query}` : ''}`);
  },
  getOne: (id) => api.get(`/activity-logs/${id}`),
  getStats: () => api.get('/activity-logs/stats'),
};

export default api;
