export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  isLoginSuccess: boolean;
  failureMessage: string;
  username: string;
  token: string;
  roles: string[];
}

export interface User {
  username: string;
  roles: string[];
}