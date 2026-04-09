// Common API response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
  cover_url?: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Post types
export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_liked?: boolean;
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface CreatePostRequest {
  content: string;
  image_url?: string;
}

// Comment types
export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  likes_count: number;
  is_liked?: boolean;
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentRequest {
  content: string;
}

// Follow types
export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

// Error types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Query options
export interface PaginationParams {
  page?: number;
  per_page?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  user_id?: string;
  [key: string]: string | number | undefined;
}
