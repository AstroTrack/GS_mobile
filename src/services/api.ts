import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from '../utils/getApiUrl';

const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 30000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@AstroTrack:token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setApiToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      await AsyncStorage.removeItem('@AstroTrack:token');
      await AsyncStorage.removeItem('@AstroTrack:user');
    }
    
    console.error('[API Error]:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data || error.message
    });
    return Promise.reject(error);
  }
);

export default api;
