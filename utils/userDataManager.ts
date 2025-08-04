import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUserData } from '../src/api/models/LoginResponse';

export class UserDataManager {
  private static readonly USER_DATA_KEY = 'userData';
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';

  static async saveUserData(userData: IUserData): Promise<void> {
    try {
      console.log('UserDataManager: Saving user data:', userData);
      await AsyncStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
      console.log('UserDataManager: User data saved successfully');
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  }

  static async getUserData(): Promise<IUserData | null> {
    try {
      console.log('UserDataManager: Getting user data...');
      const userDataString = await AsyncStorage.getItem(this.USER_DATA_KEY);
      console.log('UserDataManager: User data string retrieved:', userDataString ? 'exists' : 'null');
      if (userDataString) {
        const parsedData = JSON.parse(userDataString);
        console.log('UserDataManager: Parsed user data:', parsedData);
        return parsedData;
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  static async saveTokens(accessToken?: string, refreshToken?: string): Promise<void> {
    try {
      console.log('UserDataManager: Saving tokens - accessToken:', accessToken ? 'present' : 'missing', 'refreshToken:', refreshToken ? 'present' : 'missing');
      if (accessToken) {
        await AsyncStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
        console.log('UserDataManager: Access token saved');
      }
      if (refreshToken) {
        await AsyncStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
        console.log('UserDataManager: Refresh token saved');
      }
      console.log('UserDataManager: Tokens saved successfully');
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw error;
    }
  }

  static async getAccessToken(): Promise<string | null> {
    try {
      console.log('UserDataManager: Getting access token...');
      const token = await AsyncStorage.getItem(this.ACCESS_TOKEN_KEY);
      console.log('UserDataManager: Access token retrieved:', token ? 'exists' : 'null');
      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  static async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.USER_DATA_KEY,
        this.ACCESS_TOKEN_KEY,
        this.REFRESH_TOKEN_KEY
      ]);
    } catch (error) {
      console.error('Error clearing user data:', error);
      throw error;
    }
  }

  static async isLoggedIn(): Promise<boolean> {
    try {
      console.log('UserDataManager: Checking login status...');
      const accessToken = await this.getAccessToken();
      const userData = await this.getUserData();
      console.log('UserDataManager: accessToken exists:', !!accessToken, 'userData exists:', !!userData);
      
      // Consider logged in if we have user data (since your API doesn't return tokens)
      const isLoggedIn = !!userData;
      console.log('UserDataManager: Is logged in:', isLoggedIn);
      return isLoggedIn;
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  }
} 