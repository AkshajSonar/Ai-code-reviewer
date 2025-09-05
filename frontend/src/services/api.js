import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  loginWithToken: (token) => api.post('/auth/token', { token: 'test-token' }),
  getMe: () => api.get('/auth/me'),
  logout: () => api.get('/auth/logout'),
};

export const codeforcesAPI = {
  getProblems: (tags, rating) => api.get(`/api/codeforces/problems?tags=${tags}&rating=${rating || ''}`),
  getRandomProblem: (tags, rating) => api.get(`/api/codeforces/problems/random?tags=${tags}&rating=${rating || ''}`),
  saveAttempt: (data) => api.post('/api/codeforces/attempt', data),
  bookmarkProblem: (data) => api.post('/api/codeforces/bookmark', data),
  getBookmarks: () => api.get('/api/codeforces/bookmarks'),
};

export const geminiAPI = {
  codeReview: (data) => api.post('/api/gemini/review', data),
  codeExplanation: (data) => api.post('/api/gemini/explain', data),
};

export const userAPI = {
  getStats: () => api.get('/api/users/stats'),
  getSolvedProblems: (params) => api.get('/api/users/solved', { params }),
  updatePreferences: (data) => api.put('/api/users/preferences', data),
};

export default api;