import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage } from './storage';

describe('storage', () => {
  beforeEach(() => {
    // localStorageをクリア
    localStorage.clear();
    // モックをリセット
    vi.clearAllMocks();
  });

  describe('getToken', () => {
    it('トークンが存在する場合、トークンを返す', () => {
      localStorage.setItem('auth_token', 'test-token-123');
      expect(storage.getToken()).toBe('test-token-123');
    });

    it('トークンが存在しない場合、nullを返す', () => {
      expect(storage.getToken()).toBeNull();
    });
  });

  describe('setToken', () => {
    it('トークンをlocalStorageに保存する', () => {
      storage.setToken('new-token-456');
      expect(localStorage.getItem('auth_token')).toBe('new-token-456');
    });

    it('既存のトークンを上書きする', () => {
      localStorage.setItem('auth_token', 'old-token');
      storage.setToken('new-token');
      expect(localStorage.getItem('auth_token')).toBe('new-token');
    });
  });

  describe('removeToken', () => {
    it('トークンをlocalStorageから削除する', () => {
      localStorage.setItem('auth_token', 'token-to-remove');
      storage.removeToken();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('トークンが存在しない場合でもエラーにならない', () => {
      expect(() => storage.removeToken()).not.toThrow();
    });
  });

  describe('clearAll', () => {
    it('localStorageの全データをクリアする', () => {
      localStorage.setItem('auth_token', 'test-token');
      localStorage.setItem('other_key', 'other-value');
      
      storage.clearAll();
      
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('other_key')).toBeNull();
      expect(localStorage.length).toBe(0);
    });

    it('空のlocalStorageをクリアしてもエラーにならない', () => {
      expect(() => storage.clearAll()).not.toThrow();
    });
  });

  describe('統合テスト', () => {
    it('トークンのライフサイクル全体が正しく動作する', () => {
      // トークンが存在しない
      expect(storage.getToken()).toBeNull();
      
      // トークンを設定
      storage.setToken('lifecycle-token');
      expect(storage.getToken()).toBe('lifecycle-token');
      
      // トークンを削除
      storage.removeToken();
      expect(storage.getToken()).toBeNull();
    });

    it('clearAllが他のキーも含めて全てクリアする', () => {
      storage.setToken('token-1');
      localStorage.setItem('user_data', 'some-data');
      localStorage.setItem('preferences', 'some-prefs');
      
      expect(localStorage.length).toBe(3);
      
      storage.clearAll();
      
      expect(localStorage.length).toBe(0);
      expect(storage.getToken()).toBeNull();
    });
  });
});
