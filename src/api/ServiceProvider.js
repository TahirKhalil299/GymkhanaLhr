// src/api/ServiceProvider.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from './ApiService';
import { RequestType } from './RequestTypes';
import { HTTP_STATUS } from './constants';
import Response from './utils/Response';
import { showAlert } from './utils/alerts'; // You'll need to implement this

class ServiceProvider {
  constructor() {
    this.currentRequest = null;
  }

  async sendApiCall(requestPromise, tag, listener) {
    try {
      listener?.onRequestStarted?.();
      
      const response = await requestPromise;
      
      if (response.status >= 200 && response.status < 300) {
        const parsedResponse = new Response(response.data);
        listener?.onRequestSuccess?.(parsedResponse, JSON.stringify(response.data), tag);
      } else {
        this.handleErrorResponse(response, tag, listener);
      }
    } catch (error) {
      this.handleFailure(error, tag, listener);
    } finally {
      listener?.onRequestEnded?.();
    }
  }

  handleErrorResponse(response, tag, listener) {
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

  handleBadRequest(tag, listener, response) {
    listener?.onError?.(response, response.StatusDesc, tag);
    if (tag === RequestType.REFRESH_TOKEN) {
      this.showResetPreferencesDialog();
    }
  }

  handleUnauthorizedRequest(tag, listener) {
    if (tag === RequestType.REFRESH_TOKEN) {
      this.showResetPreferencesDialog();
    } else {
      this.refreshTokenAndRetry(tag, listener);
    }
  }

  async refreshTokenAndRetry(tag, listener) {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');
      
      const response = await ApiService.refreshToken({ token: refreshToken });
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

  showResetPreferencesDialog() {
    showAlert(
      'Session Expired',
      'Your session has expired. Please log in again.',
      [{
        text: 'OK',
        onPress: () => this.resetAppPreferences(),
      }]
    );
  }

  async resetAppPreferences() {
    try {
      await AsyncStorage.clear();
      // Navigate to login screen
      // navigationRef.navigate('Login'); // You'll need to set up navigation
    } catch (error) {
      console.error('Error resetting preferences:', error);
    }
  }

  handleFailure(error, tag, listener) {
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

  cancelCurrentRequest() {
    if (this.currentRequest) {
      // Cancel the request using axios cancel token if needed
      console.log('Cancelling current request');
      this.currentRequest = null;
    }
  }
}

export default new ServiceProvider();