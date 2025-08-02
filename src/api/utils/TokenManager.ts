import AsyncStorage from '@react-native-async-storage/async-storage';

interface TokenData {
  accessToken: string;
  refreshToken: string;
}

export default class TokenManager {
  static async getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem('accessToken');
  }

  static async getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem('refreshToken');
  }

  static async saveTokens({ accessToken, refreshToken }: TokenData): Promise<void> {
    await AsyncStorage.multiSet([
      ['accessToken', accessToken],
      ['refreshToken', refreshToken]
    ]);
  }

  static async clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
  }
} 