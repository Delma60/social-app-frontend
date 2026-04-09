import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './client';
import { useAuthStore } from '@/libs/stores/auth-store';

// ==================== LOGIN & AUTHENTICATION ====================

export const useLogin = () => {
  const queryClient = useQueryClient();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (responseData) => {
      // Backend returns: { success, message, data: { user, token } }
      const { user, token } = responseData.data;
      
      if (user && token) {
        login(user, token);
        // Update axios header with token
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // Invalidate queries to refetch with new auth
        queryClient.invalidateQueries();
      }
    },
    onError: (error: any) => {
      console.error('Login error:', error.response?.data?.message || error.message);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (userData: {
      name: string;
      email: string;
      password: string;
      password_confirmation: string;
      username?: string;
    }) => {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    },
    onSuccess: (responseData) => {
      // Backend returns: { success, message, data: { user, token } }
      const { user, token } = responseData.data;
      
      if (user && token) {
        login(user, token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        queryClient.invalidateQueries();
      }
    },
    onError: (error: any) => {
      console.error('Register error:', error.response?.data?.message || error.message);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
    onSuccess: () => {
      clearAuth();
      delete apiClient.defaults.headers.common['Authorization'];
      queryClient.clear();
    },
    onError: (error: any) => {
      console.error('Logout error:', error.response?.data?.message || error.message);
      // Clear auth anyway even if logout fails
      clearAuth();
      delete apiClient.defaults.headers.common['Authorization'];
    },
  });
};

export const useRefreshToken = () => {
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/auth/refresh');
      return response.data;
    },
    onSuccess: (responseData) => {
      // Backend returns: { success, data: { token } }
      const { token } = responseData.data;
      
      if (token && user) {
        login(user, token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    },
    onError: (error: any) => {
      console.error('Token refresh error:', error.response?.data?.message || error.message);
    },
  });
};

// ==================== HANDLE GENERATION ====================

export const useGenerateHandle = () => {
  return useMutation({
    mutationFn: async (input: { name?: string; email?: string }) => {
      const response = await apiClient.post('/auth/generate-handle', input);
      return response.data;
    },
    onError: (error: any) => {
      console.error('Handle generation error:', error.response?.data?.message || error.message);
    },
  });
};
