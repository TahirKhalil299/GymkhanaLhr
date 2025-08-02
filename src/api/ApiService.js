// src/api/ApiService.js

import ApiClient from './utils/ApiClient';
import { ENDPOINTS } from './constants';

const ApiService = {
  // Authentication endpoints
  refreshToken: (payload) => ApiClient.post(ENDPOINTS.AUTH.REFRESH_TOKEN, payload),
  login: (credentials) => ApiClient.post(ENDPOINTS.AUTH.LOGIN, credentials),
  logout: () => ApiClient.post(ENDPOINTS.AUTH.LOGOUT),
  
  // User endpoints
  getUserProfile: () => ApiClient.get(ENDPOINTS.USER.PROFILE),
  updateUserProfile: (profileData) => ApiClient.put(ENDPOINTS.USER.UPDATE_PROFILE, profileData),
  
  // Generic methods
  get: (url, config) => ApiClient.get(url, config),
  post: (url, data, config) => ApiClient.post(url, data, config),
  put: (url, data, config) => ApiClient.put(url, data, config),
  delete: (url, config) => ApiClient.delete(url, config),
  patch: (url, data, config) => ApiClient.patch(url, data, config),
};

export default ApiService;