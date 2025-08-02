// src/api/interceptors/AuthInterceptor.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosRequestConfig } from 'axios';
import { API_KEY } from '../constants';

export const authInterceptor = async (request: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
  const token = await AsyncStorage.getItem('accessToken');
  
  // Check if this request requires auth (you can add custom logic here)
  const requiresAuth = true; // Default or determine based on request
  
  if (requiresAuth && token) {
    if (request.headers) {
      request.headers.Authorization = `Bearer ${token}`;
    } else {
      request.headers = { Authorization: `Bearer ${token}` };
    }
  } else {
    if (request.headers) {
      request.headers['x-api-key'] = API_KEY;
    } else {
      request.headers = { 'x-api-key': API_KEY };
    }
  }
  
  return request;
}; 