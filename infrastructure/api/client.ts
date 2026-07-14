import { env } from '@/config/env';
import axios from 'axios';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from '../storage/token';

export const api = axios.create({
  baseURL: env.API_URL,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = await getRefreshToken();

      if (!refreshToken) {
        isRefreshing = false;
        await clearTokens();
        // TODO: Redirect to login or emit logout event here
        return Promise.reject(error);
      }

      try {
        // Pastikan endpoint ini sesuai dengan API Anda
        const { data } = await axios.post(`${env.API_URL}/auth/refresh`, {
          refreshToken,
        });

        // Sesuaikan 'data.accessToken' dan 'data.refreshToken' dengan response API Anda
        await saveTokens(data.accessToken, data.refreshToken);
        
        api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        processQueue(null, data.accessToken);
        
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await clearTokens();
        // TODO: Redirect to login or emit logout event here
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);