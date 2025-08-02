// src/api/utils/ApiClient.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { BASE_URL } from '../constants';
import { authInterceptor } from '../interceptors/AuthInterceptor';
import {
    errorLoggingInterceptor,
    requestLoggingInterceptor,
    responseLoggingInterceptor
} from '../interceptors/LoggingInterceptor';
import { networkInterceptor } from '../interceptors/NetworkInterceptor';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 seconds
});

// Request interceptors
apiClient.interceptors.request.use(requestLoggingInterceptor);
apiClient.interceptors.request.use(authInterceptor);
apiClient.interceptors.request.use(networkInterceptor);

// Response interceptors
apiClient.interceptors.response.use(responseLoggingInterceptor, errorLoggingInterceptor);

interface ApiClientInterface {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
}

const ApiClient: ApiClientInterface = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
    apiClient.get<T>(url, config),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
    apiClient.post<T>(url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
    apiClient.put<T>(url, data, config),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
    apiClient.delete<T>(url, config),
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
    apiClient.patch<T>(url, data, config),
};

export default ApiClient; 