// src/api/interceptors/AuthInterceptor.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_KEY } from '../constants';

export const authInterceptor = async (request) => {
  const token = await AsyncStorage.getItem('accessToken');
  
  // Check if this request requires auth (you can add custom logic here)
  const requiresAuth = true; // Default or determine based on request
  
  if (requiresAuth && token) {
    request.headers.Authorization = `Bearer ${token}`;
  } else {
    request.headers['x-api-key'] = API_KEY; // Import API_KEY from constants
  }
  
  return request;
};