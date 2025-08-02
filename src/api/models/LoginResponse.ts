// src/api/models/LoginResponse.ts

interface LoginResponseData {
  success?: boolean;
  message?: string;
  token?: string;
  refreshToken?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export default class LoginResponse {
  public success: boolean;
  public message: string;
  public token: string | null;
  public refreshToken: string | null;
  public user: any | null;

  constructor(data: LoginResponseData) {
    this.success = data.success || false;
    this.message = data.message || '';
    this.token = data.token || null;
    this.refreshToken = data.refreshToken || null;
    this.user = data.user || null;
  }

  isSuccessful(): boolean {
    return this.success === true;
  }

  hasToken(): boolean {
    return !!this.token;
  }

  getUserData(): any {
    return this.user;
  }
}
