// src/api/ServiceProvider.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from './ApiService';
import { RequestType } from './RequestTypes';
import { HTTP_STATUS } from './constants';
import Response from './utils/Response';
import { showAlert } from './utils/alerts';

// Type definitions
export interface ApiListener {
  onRequestStarted?: () => void;
  onRequestSuccess?: (response: Response, data: string, tag: string) => void;
  onRequestFailure?: (error: string, message: string, errors: any[], tag: string) => void;
  onRequestEnded?: () => void;
  onError?: (response: Response, message: string, tag: string) => void;
  onRefreshSuccess?: () => void;
  onRefreshFailure?: () => void;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  data: any;
}

export interface RefreshTokenResponse {
  status: number;
  data: {
    accessToken: string;
  };
}

export default class ServiceProvider {
  protected currentRequest: any = null;

  async sendApiCall(
    requestPromise: Promise<ApiResponse>, 
    tag: string, 
    listener?: ApiListener
  ): Promise<void> {
    try {
      listener?.onRequestStarted?.();
      
      const response = await requestPromise;
      
      if (response.status >= 200 && response.status < 300) {
        const parsedResponse = new Response(response.data);
        listener?.onRequestSuccess?.(parsedResponse, JSON.stringify(response.data), tag);
      } else {
        this.handleErrorResponse(response, tag, listener);
      }
    } catch (error: any) {
      this.handleFailure(error, tag, listener);
    } finally {
      listener?.onRequestEnded?.();
    }
  }

  // Generic request method that can be used by subclasses
  protected async request(
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    endpoint: string,
    data?: any,
    tag?: string,
    listener?: ApiListener
  ): Promise<any> {
    let requestPromise: Promise<ApiResponse>;
    
    switch (method) {
      case 'get':
        requestPromise = ApiService.get(endpoint);
        break;
      case 'post':
        requestPromise = ApiService.post(endpoint, data);
        break;
      case 'put':
        requestPromise = ApiService.put(endpoint, data);
        break;
      case 'delete':
        requestPromise = ApiService.delete(endpoint);
        break;
      case 'patch':
        requestPromise = ApiService.patch(endpoint, data);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
    
    await this.sendApiCall(requestPromise, tag || endpoint, listener);
    return requestPromise;
  }

  protected handleErrorResponse(
    response: ApiResponse, 
    tag: string, 
    listener?: ApiListener
  ): void {
    console.error(`API Error - ${response.status}: ${response.statusText}`, response.data);
    
    const errorResponse = new Response(response.data);
    
    switch (response.status) {
      case HTTP_STATUS.BAD_REQUEST:
        this.handleBadRequest(tag, listener, errorResponse);
        break;
      case HTTP_STATUS.UNAUTHORIZED:
        this.handleUnauthorizedRequest(tag, listener);
        break;
      case HTTP_STATUS.NOT_FOUND:
        listener?.onRequestFailure?.(
          response.status.toString(),
          'Resource not found',
          [],
          tag
        );
        break;
      case HTTP_STATUS.TOO_MANY_REQUESTS:
        listener?.onRequestFailure?.(
          response.status.toString(),
          'Too many requests, please try again later',
          [],
          tag
        );
        break;
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        listener?.onRequestFailure?.(
          response.status.toString(),
          'Server encountered an error, please try again later',
          [],
          tag
        );
        break;
      default:
        listener?.onError?.(errorResponse, errorResponse.StatusDesc, tag);
    }
  }

  protected handleBadRequest(
    tag: string, 
    listener?: ApiListener, 
    response?: Response
  ): void {
    if (response) {
      listener?.onError?.(response, response.StatusDesc, tag);
    }
    if (tag === RequestType.REFRESH_TOKEN) {
      this.showResetPreferencesDialog();
    }
  }

  protected handleUnauthorizedRequest(tag: string, listener?: ApiListener): void {
    if (tag === RequestType.REFRESH_TOKEN) {
      this.showResetPreferencesDialog();
    } else {
      this.refreshTokenAndRetry(tag, listener);
    }
  }

  private async refreshTokenAndRetry(tag: string, listener?: ApiListener): Promise<void> {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');
      
      const response: RefreshTokenResponse = await ApiService.refreshToken({ token: refreshToken });
      if (response.status === HTTP_STATUS.OK) {
        await AsyncStorage.setItem('accessToken', response.data.accessToken);
        // You might want to retry the original request here
        listener?.onRefreshSuccess?.();
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.showResetPreferencesDialog();
      listener?.onRefreshFailure?.();
    }
  }

  private showResetPreferencesDialog(): void {
    showAlert(
      'Session Expired',
      'Your session has expired. Please log in again.',
      [{
        text: 'OK',
        onPress: () => this.resetAppPreferences(),
      }]
    );
  }

  private async resetAppPreferences(): Promise<void> {
    try {
      await AsyncStorage.clear();
      // Navigate to login screen
      // navigationRef.navigate('Login'); // You'll need to set up navigation
    } catch (error) {
      console.error('Error resetting preferences:', error);
    }
  }

  private handleFailure(error: any, tag: string, listener?: ApiListener): void {
    if (error.name === 'NoConnectivityError') {
      showAlert('Connection Error', error.message);
      return;
    }

    const errorMessage = error.message || 'Unknown error occurred';
    console.error(`API Failure - ${tag}:`, error);
    
    listener?.onRequestFailure?.(
      errorMessage,
      'Something went wrong',
      [],
      tag
    );
  }

  cancelCurrentRequest(): void {
    if (this.currentRequest) {
      // Cancel the request using axios cancel token if needed
      console.log('Cancelling current request');
      this.currentRequest = null;
    }
  }
}

// Export a singleton instance for backward compatibility
export const serviceProvider = new ServiceProvider(); 