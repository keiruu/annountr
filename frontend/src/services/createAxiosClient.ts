import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

interface CreateAxiosClientOptions {
  options?: AxiosRequestConfig;
  getCurrentAccessToken: () => string | null;
  getCurrentRefreshToken: () => string | null;
  refreshTokenUrl: string;
  logout: () => void;
  setRefreshedTokens: (accessToken: string, refreshToken: string) => void;
}

export function createAxiosClient({
  options,
  getCurrentAccessToken,
  getCurrentRefreshToken,
  refreshTokenUrl,
  logout,
  setRefreshedTokens,
}: CreateAxiosClientOptions): AxiosInstance {
  const client = axios.create(options);

  client.interceptors.request.use(
    (config) => {
      if (config.headers?.Authorization !== false) {
        const token = getCurrentAccessToken();
        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return client;
}
