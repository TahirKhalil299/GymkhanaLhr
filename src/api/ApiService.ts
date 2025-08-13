// src/api/ApiService.ts

import { API_CREDENTIALS, ENDPOINTS } from './constants';
import ApiClient from './utils/ApiClient';

// Type definitions
interface RefreshTokenPayload {
  token: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  // Add other profile fields as needed
}

interface ApiConfig {
  headers?: Record<string, string>;
  timeout?: number;
  // Add other axios config options as needed
}

interface ApiResponse<T = any> {
  status: number;
  data: T;
  statusText: string;
}

// Create a static API service object with methods
const ApiService = {
  // Authentication endpoints
  refreshToken: (payload: RefreshTokenPayload): Promise<ApiResponse> => 
    ApiClient.post(ENDPOINTS.AUTH.REFRESH_TOKEN, payload),
  
  login: (credentials: LoginCredentials): Promise<ApiResponse> => 
    ApiClient.post(ENDPOINTS.AUTH.LOGIN, credentials),
  
  logout: (): Promise<ApiResponse> => 
    ApiClient.post(ENDPOINTS.AUTH.LOGOUT),

  // Currency endpoints
  getCurrencyRates: (): Promise<ApiResponse> => {
    const queryParams = new URLSearchParams({
      User_ID: API_CREDENTIALS.userId,
      User_Password: API_CREDENTIALS.userPassword,
      Auth_Token: API_CREDENTIALS.authToken,
      Customer_Code: API_CREDENTIALS.customerCode,
    });

    return ApiClient.get(`${ENDPOINTS.CURRENCY.GET_RATES}?${queryParams.toString()}`);
  },




    // Currency endpoints
// Currency endpoints
getDealList: (partyITypeRef: string): Promise<ApiResponse> => {
  const queryParams = new URLSearchParams({
    User_ID: API_CREDENTIALS.userId,
    User_Password: API_CREDENTIALS.userPassword,
    Auth_Token: API_CREDENTIALS.authToken,
    Customer_Code: API_CREDENTIALS.customerCode,
    Party_ITypeRef: partyITypeRef // Add the parameter here
  });

  return ApiClient.get(`${ENDPOINTS.DEAL_LIST}?${queryParams.toString()}`);
},




  getBranchesList: (): Promise<ApiResponse> => {
    const queryParams = new URLSearchParams({
      User_ID: API_CREDENTIALS.userId,
      User_Password: API_CREDENTIALS.userPassword,
      Auth_Token: API_CREDENTIALS.authToken,
      Customer_Code: API_CREDENTIALS.customerCode,
    });

       return ApiClient.get(`${ENDPOINTS.NETWORK_BRANCHES.GET_BRANCHES}?${queryParams.toString()}`);
  },





  // Currency endpoints
  getBranchesName: (): Promise<ApiResponse> => {
    const queryParams = new URLSearchParams({
      User_ID: API_CREDENTIALS.userId,
      User_Password: API_CREDENTIALS.userPassword,
      Auth_Token: API_CREDENTIALS.authToken,
      Customer_Code: API_CREDENTIALS.customerCode,
    });

    return ApiClient.get(`${ENDPOINTS.BRANCHES}?${queryParams.toString()}`);
  },


    getPurposeList: (cStatus: string,roType: string,cType: string): Promise<ApiResponse> => {
    const queryParams = new URLSearchParams({
      User_ID: API_CREDENTIALS.userId,
      User_Password: API_CREDENTIALS.userPassword,
      Auth_Token: API_CREDENTIALS.authToken,
      Customer_Code: API_CREDENTIALS.customerCode,
      CStatus: cStatus,
      ROType: roType,
      CType: cType
    });

    return ApiClient.get(`${ENDPOINTS.PURPOSES}?${queryParams.toString()}`);
  },



  // User endpoints
  getUserProfile: (): Promise<ApiResponse<UserProfile>> => 
    ApiClient.get(ENDPOINTS.USER.PROFILE),
  
  updateUserProfile: (profileData: Partial<UserProfile>): Promise<ApiResponse> => 
    ApiClient.put(ENDPOINTS.USER.UPDATE_PROFILE, profileData),

  // Generic methods
  get: <T = any>(url: string, config?: ApiConfig): Promise<ApiResponse<T>> => 
    ApiClient.get(url, config),
  
  post: <T = any>(url: string, data?: any, config?: ApiConfig): Promise<ApiResponse<T>> => 
    ApiClient.post(url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: ApiConfig): Promise<ApiResponse<T>> => 
    ApiClient.put(url, data, config),
  
  delete: <T = any>(url: string, config?: ApiConfig): Promise<ApiResponse<T>> => 
    ApiClient.delete(url, config),
  
  patch: <T = any>(url: string, data?: any, config?: ApiConfig): Promise<ApiResponse<T>> => 
    ApiClient.patch(url, data, config),
};

export default ApiService; 