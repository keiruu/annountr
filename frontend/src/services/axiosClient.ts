import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/rootReducer';
import { logoutSuccess, setTokens } from '../features/user/userSlice';

const REFRESH_TOKEN_URL = 'http://localhost:5000/api/v1/auth/refreshToken';
const BASE_URL = 'http://localhost:5000/api/v1/';

function getCurrentAccessToken() {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  return accessToken;
}

function getCurrentRefreshToken() {
  const refreshToken = useSelector((state: RootState) => state.auth.refreshToken);
  return refreshToken;
}

function setRefreshedTokens(tokens: { accessToken: string; refreshToken: string }) {
  const dispatch = useDispatch();
  dispatch(setTokens(tokens));
}

function logout() {
  const dispatch = useDispatch();
  dispatch(logoutSuccess());
}

export function createAxiosClient({
  options,
  getCurrentAccessToken,
  getCurrentRefreshToken,
  refreshTokenUrl,
  logout,
  setRefreshedTokens,
}: {
  options?: AxiosRequestConfig;
  getCurrentAccessToken: () => string | null;
  getCurrentRefreshToken: () => string | null;
  refreshTokenUrl: string;
  logout: () => void;
  setRefreshedTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
}): AxiosInstance {
  const client = axios.create(options);

  client.interceptors.request.use(
    (config) => {
      if (config.headers?.authorization !== false) {
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

export const client = createAxiosClient({
  options: {
    baseURL: BASE_URL,
    timeout: 300000,
    headers: {
      'Content-Type': 'application/json',
    },
  },
  getCurrentAccessToken,
  getCurrentRefreshToken,
  refreshTokenUrl: REFRESH_TOKEN_URL,
  logout,
  setRefreshedTokens,
});
