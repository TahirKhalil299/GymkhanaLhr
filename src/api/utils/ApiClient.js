// src/api/utils/ApiClient.js

import axios from 'axios';
import { BASE_URL } from '../constants';
import { authInterceptor } from '../interceptors/AuthInterceptor';
import {
    errorLoggingInterceptor,
    requestLoggingInterceptor,
    responseLoggingInterceptor
} from '../interceptors/LoggingInterceptor';
import { networkInterceptor } from '../interceptors/NetworkInterceptor';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 seconds
});

// Request interceptors
apiClient.interceptors.request.use(requestLoggingInterceptor);
apiClient.interceptors.request.use(authInterceptor);
apiClient.interceptors.request.use(networkInterceptor);

// Response interceptors
apiClient.interceptors.response.use(responseLoggingInterceptor, errorLoggingInterceptor);

export default {
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),
  patch: (url, data, config) => apiClient.patch(url, data, config),
};