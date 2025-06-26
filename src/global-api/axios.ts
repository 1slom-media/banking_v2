import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { AuthService } from '../auth/auth.service';

interface RetryRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

export const getApiClient = (
  authService: AuthService,
  baseUrl: string,
  type: string,
  provider: string,
) => {
  const apiClient = axios.create({
    baseURL: baseUrl,
  });

  // 🟢 Request Interceptor - token qo‘shish
  apiClient.interceptors.request.use(async (config) => {
    const token = await authService.getAccessToken(type, provider);
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // 🔴 Response Interceptor - 401 bo‘lsa tokenni yangilab qayta yuborish
  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryRequestConfig;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (provider === 'ANORBANK') {
          const loginDto = {
            username: process.env.ANOR_USERNAME,
            password: process.env.ANOR_PASSWORD,
          };
          await authService.loginAnor(loginDto);
        } else if (provider === 'DAVRBANK') {
          await authService.refreshTokenDavr(); // 👈 faqat chaqiriladi, parametrsiz
        }

        const newToken = await authService.getAccessToken(type, provider);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }

      return Promise.reject(error);
    },
  );

  return apiClient;
};