import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const apiClient = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token from localStorage to admin requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear token and redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      if (isAdminRoute && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const labApi = {
  getLabInfo: async () => (await apiClient.get('/lab-info')).data,
  getResearchFocus: async () => (await apiClient.get('/research-focus')).data,
  getPublications: async (params = {}) => (await apiClient.get('/publications', { params })).data,
  getLabMembers: async () => (await apiClient.get('/lab-members')).data,
  getNews: async (params = {}) => (await apiClient.get('/news', { params })).data,
  getYoutubeVideos: async () => (await apiClient.get('/youtube-videos')).data,
  submitContact: async (data) => (await apiClient.post('/contact', data)).data,
};

export const authApi = {
  login: async (email, password) => (await apiClient.post('/auth/login', { email, password })).data,
  me: async () => (await apiClient.get('/auth/me')).data,
};

export const adminApi = {
  // Lab Info
  updateLabInfo: async (data) => (await apiClient.put('/admin/lab-info', data)).data,

  // Research Focus
  createResearchFocus: async (data) => (await apiClient.post('/admin/research-focus', data)).data,
  updateResearchFocus: async (id, data) => (await apiClient.put(`/admin/research-focus/${id}`, data)).data,
  deleteResearchFocus: async (id) => (await apiClient.delete(`/admin/research-focus/${id}`)).data,

  // Publications
  createPublication: async (data) => (await apiClient.post('/admin/publications', data)).data,
  updatePublication: async (id, data) => (await apiClient.put(`/admin/publications/${id}`, data)).data,
  deletePublication: async (id) => (await apiClient.delete(`/admin/publications/${id}`)).data,

  // Lab Members
  createLabMember: async (data) => (await apiClient.post('/admin/lab-members', data)).data,
  updateLabMember: async (id, data) => (await apiClient.put(`/admin/lab-members/${id}`, data)).data,
  deleteLabMember: async (id) => (await apiClient.delete(`/admin/lab-members/${id}`)).data,

  // YouTube Videos
  createYoutubeVideo: async (data) => (await apiClient.post('/admin/youtube-videos', data)).data,
  updateYoutubeVideo: async (id, data) => (await apiClient.put(`/admin/youtube-videos/${id}`, data)).data,
  deleteYoutubeVideo: async (id) => (await apiClient.delete(`/admin/youtube-videos/${id}`)).data,

  // News
  createNews: async (data) => (await apiClient.post('/admin/news', data)).data,
  updateNews: async (id, data) => (await apiClient.put(`/admin/news/${id}`, data)).data,
  deleteNews: async (id) => (await apiClient.delete(`/admin/news/${id}`)).data,

  // Contact Submissions
  getContactSubmissions: async () => (await apiClient.get('/admin/contact-submissions')).data,
  deleteContactSubmission: async (id) => (await apiClient.delete(`/admin/contact-submissions/${id}`)).data,
};

export const formatApiErrorDetail = (detail) => {
  if (detail == null) return 'Something went wrong. Please try again.';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === 'string' ? e.msg : JSON.stringify(e))).filter(Boolean).join(' ');
  if (detail && typeof detail.msg === 'string') return detail.msg;
  return String(detail);
};

export default apiClient;
