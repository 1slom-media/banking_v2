import axios from 'axios';
import { AuthService } from '../auth/auth.service';

let apiClient = null;

export const getApiClient = (authService: AuthService) => {
  const apiClient = axios.create({
    baseURL: process.env.DAVR_URL,
  });

  apiClient.interceptors.request.use(async (config) => {
    const token = await authService.getAccessToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return apiClient;
};

