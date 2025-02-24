import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Adding this interceptor ==> include the JWT token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginUser = async (credentials) => api.post('/users/login', credentials);
export const registerUser = async (userData) => api.post('/users/register', userData);

export const getAllUsers = async () => api.get('/users'); 
export const searchUsers = async (search, type) => api.get('/users/search', { params: { search, type } }); 
export const addUser = async (userData) => api.post('/users', userData); 