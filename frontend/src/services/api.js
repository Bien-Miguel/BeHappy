// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ENDPOINTS ====================
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// ==================== DASHBOARD ENDPOINTS ====================
export const dashboardAPI = {
  getMetrics: async () => {
    const response = await api.get('/dashboard/metrics');
    return response.data;
  },
};

// ==================== REPORTS ENDPOINTS ====================
export const reportsAPI = {
  create: async (reportData) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },

  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== null && filters[key] !== undefined) {
        params.append(key, filters[key]);
      }
    });
    const response = await api.get(`/reports?${params.toString()}`);
    return response.data;
  },

  getById: async (reportId) => {
    const response = await api.get(`/reports/${reportId}`);
    return response.data;
  },

  updateStatus: async (reportId, status, notes) => {
    const response = await api.patch(`/reports/${reportId}/status`, {
      status,
      notes,
    });
    return response.data;
  },

  assign: async (reportId, assignedTo) => {
    const response = await api.post(`/reports/${reportId}/assign`, {
      assigned_to: assignedTo,
    });
    return response.data;
  },

  uploadAttachment: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/reports/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// ==================== TASKS ENDPOINTS ====================
export const tasksAPI = {
  create: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== null && filters[key] !== undefined) {
        params.append(key, filters[key]);
      }
    });
    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data;
  },

  update: async (taskId, updateData) => {
    const response = await api.patch(`/tasks/${taskId}`, updateData);
    return response.data;
  },

  delete: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },
};

// ==================== ACTIVITY ENDPOINTS ====================
export const activityAPI = {
  sendHeartbeat: async () => {
    const response = await api.post('/activity/heartbeat');
    return response.data;
  },

  getActivity: async (employeeId, days = 7) => {
    const response = await api.get(`/activity/${employeeId}?days=${days}`);
    return response.data;
  },
};

// ==================== WELLNESS ENDPOINTS ====================
export const wellnessAPI = {
  getWellness: async (employeeId) => {
    const response = await api.get(`/wellness/${employeeId}`);
    return response.data;
  },

  calculate: async (employeeId) => {
    const response = await api.post(`/wellness/calculate/${employeeId}`);
    return response.data;
  },
};

// ==================== DEPARTMENTS ENDPOINTS ====================
export const departmentsAPI = {
  getAll: async () => {
    const response = await api.get('/departments');
    return response.data;
  },

  getWellness: async (departmentId) => {
    const response = await api.get(`/departments/${departmentId}/wellness`);
    return response.data;
  },
};

// ==================== EMPLOYEES ENDPOINTS (Admin) ====================
export const employeesAPI = {
  create: async (employeeData) => {
    const response = await api.post('/admin/employees', employeeData);
    return response.data;
  },

  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== null && filters[key] !== undefined) {
        params.append(key, filters[key]);
      }
    });
    const response = await api.get(`/admin/employees?${params.toString()}`);
    return response.data;
  },

  getById: async (employeeId) => {
    const response = await api.get(`/admin/employees/${employeeId}`);
    return response.data;
  },

  update: async (employeeId, updateData) => {
    const response = await api.patch(`/admin/employees/${employeeId}`, updateData);
    return response.data;
  },
};

// ==================== HELPER: Check if user is authenticated ====================
export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

// ==================== HELPER: Get current user ====================
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// ==================== HELPER: Store auth data ====================
export const storeAuthData = (token, user) => {
  localStorage.setItem('access_token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// ==================== HELPER: Clear auth data ====================
export const clearAuthData = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
};

export default api;


// Add this to the end of your api.js file

// ==================== ACTIVITY TRACKING ====================
let activityInterval = null;

export const startActivityTracking = () => {
  // Clear any existing interval
  if (activityInterval) {
    clearInterval(activityInterval);
  }

  // Send initial heartbeat
  activityAPI.sendHeartbeat().catch(err => 
    console.error('Initial heartbeat failed:', err)
  );

  // Send heartbeat every 5 minutes
  activityInterval = setInterval(() => {
    activityAPI.sendHeartbeat().catch(err => 
      console.error('Heartbeat failed:', err)
    );
  }, 5 * 60 * 1000); // 5 minutes

  // Return cleanup function
  return () => {
    if (activityInterval) {
      clearInterval(activityInterval);
      activityInterval = null;
    }
  };
};