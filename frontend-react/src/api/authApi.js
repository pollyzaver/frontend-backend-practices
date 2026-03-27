import apiClient from './apiClient';

export const register = async (email, first_name, last_name, password) => {
  const response = await apiClient.post('/auth/register', {
    email,
    first_name,
    last_name,
    password,
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  const { accessToken, refreshToken } = response.data;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/';
};

export const getMe = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};