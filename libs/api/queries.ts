import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import apiClient from './client';

// ==================== USER QUERIES ====================

export const useGetUser = (userId: string, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/users/${userId}`);
      return data;
    },
    ...options,
  });
};

export const useGetCurrentUser = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const { data } = await apiClient.get('/user');
      return data;
    },
    ...options,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData: any) => {
      const { data } = await apiClient.put('/user', userData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

// ==================== POSTS/FEED QUERIES ====================

export const useGetPosts = (page = 1, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['posts', page],
    queryFn: async () => {
      const { data } = await apiClient.get('/posts', { params: { page } });
      return data;
    },
    ...options,
  });
};

export const useGetUserPosts = (userId: string, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['posts', 'user', userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/users/${userId}/posts`);
      return data;
    },
    ...options,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postData: any) => {
      const { data } = await apiClient.post('/posts', postData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      await apiClient.delete(`/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

// ==================== COMMENTS QUERIES ====================

export const useGetPostComments = (postId: string, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/posts/${postId}/comments`);
      return data;
    },
    ...options,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      const { data } = await apiClient.post(`/posts/${postId}/comments`, { content });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
    },
  });
};

// ==================== LIKES QUERIES ====================

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      const { data } = await apiClient.post(`/posts/${postId}/like`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useUnlikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      const { data } = await apiClient.post(`/posts/${postId}/unlike`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

// ==================== FOLLOW QUERIES ====================

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await apiClient.post(`/users/${userId}/follow`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await apiClient.post(`/users/${userId}/unfollow`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};
