import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUserData } from '../src/api/models/LoginResponse';

export class UserDataManager {
  private static readonly USER_DATA_KEY = 'userData';
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';

  static async saveUserData(userData: IUserData): Promise<void> {
    try {
      await AsyncStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  }

  static async getUserData(): Promise<IUserData | null> {
    try {
      const userDataString = await AsyncStorage.getItem(this.USER_DATA_KEY);
      return userDataString ? JSON.parse(userDataString) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  static async saveTokens(accessToken?: string, refreshToken?: string): Promise<void> {
    try {
      if (accessToken) {
        await AsyncStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
      }
      if (refreshToken) {
        await AsyncStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      }
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw error;
    }
  }

  static async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.ACCESS_TOKEN_KEY);
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
      const accessToken = await this.getAccessToken();
      const userData = await this.getUserData();
      return !!(accessToken && userData);
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  }
} 