export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  isLoginSuccess: boolean;
  failureMessage: string;
  userName: string;
  token: string;
  roles: string[];
}

export interface User {
  userName: string;
  roles: string[];
}