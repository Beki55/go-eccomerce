// Auth API functions
import { apiClient, ApiResponse, handleApiError } from "./client";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export const authApi = {
  // Login user
  async login(credentials: LoginRequest): Promise<ApiResponse<User>> {
    const response = await apiClient.post<User>("/auth/login", credentials);
    if (response.error) {
      handleApiError(response.error);
    }
    return response;
  },

  // Register user
  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    const response = await apiClient.post<User>("/auth/register", userData);
    if (response.error) {
      handleApiError(response.error);
    }
    return response;
  },

  // Get current user
  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await apiClient.get<User>("/auth/me");
    if (response.error) {
      handleApiError(response.error);
    }
    return response;
  },

  // Logout user
  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>("/auth/logout");
    if (response.error) {
      handleApiError(response.error);
    }
    return response;
  },

  // Google login
  async googleLogin(token: string): Promise<ApiResponse<User>> {
    const response = await apiClient.post<User>("/auth/google", { token });
    if (response.error) {
      handleApiError(response.error);
    }
    return response;
  },
};
