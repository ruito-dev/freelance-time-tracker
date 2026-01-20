import { apiClient } from './client';
import type { AuthResponse, LoginRequest, SignupRequest, User } from '../types/auth';
import { storage } from '../utils/storage';

export const authApi = {
  // サインアップ
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/signup', { user: data });
    if (response.data.token) {
      storage.setToken(response.data.token);
    }
    return response.data;
  },

  // ログイン
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/login', data);
    if (response.data.token) {
      storage.setToken(response.data.token);
    }
    return response.data;
  },

  // ログアウト
  logout: (): void => {
    storage.removeToken();
  },

  // 現在のユーザー情報取得
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/v1/auth/me');
    return response.data;
  },

  // トークンの有効性チェック
  isAuthenticated: (): boolean => {
    return !!storage.getToken();
  },
};
