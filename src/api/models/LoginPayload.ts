// src/api/models/LoginPayload.ts

export default class LoginPayload {
  public email: string;
  public password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  toJSON(): object {
    return {
      email: this.email,
      password: this.password,
    };
  }
}
