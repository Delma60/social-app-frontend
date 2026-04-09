import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { apiClient } from "../api"; // Make sure your apiClient handles setting the Bearer token in headers!
import { User } from "../api/types";

interface AuthState {
  user: User | null;
  authToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  errors: Record<string, string> | null;

  // Actions
  setUser: (user: User | null) => void;
  setAuthToken: (token: string | null) => void;
  clearAuth: () => void;
  checkAuth: () => Promise<void>;
  login: (data: Partial<User>) => Promise<boolean>;
  register: (data: Partial<User>) => Promise<boolean>;
  setErrors: (errors: Record<string, string> | null) => void;
  logout: () => void;
  loginAsDemo: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  authToken: null,
  isAuthenticated: false,
  isLoading: true, // Starts true so app can check auth on boot without flashing the login screen
  errors: null,

  setErrors: (errors) => set({ errors }),

  setUser: (user) => {
    set({
      user,
      isAuthenticated: user !== null,
    });
  },

  setAuthToken: (token) => {
    set({
      authToken: token,
      isAuthenticated: token !== null,
    });

    if (token) {
      AsyncStorage.setItem("authToken", token);
    } else {
      AsyncStorage.removeItem("authToken");
    }
  },

  clearAuth: () => {
    set({
      user: null,
      authToken: null,
      isAuthenticated: false,
      errors: null,
    });
    AsyncStorage.removeItem("authToken");
    AsyncStorage.removeItem("user");
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const userJson = await AsyncStorage.getItem("user");

      if (token && userJson) {
        const user = JSON.parse(userJson);
        set({
          user,
          authToken: token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Auth check error:", error);
      set({ isLoading: false });
    }
  },

  register: async (data) => {
    set({ isLoading: true, errors: null });
    try {
      // Send registration data to Laravel
      const response = await apiClient.post("/auth/register", data); 
      
      // Destructure exactly what your Laravel AuthController returns
      const { user, token } = response.data;

      // Update Zustand State
      set({
        user,
        authToken: token,
        isAuthenticated: true,
        isLoading: false,
      });

      // Persist to storage so user stays logged in
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      return true; // Return true so your SignUpScreen can trigger the router.replace()
    } catch (error: any) {
      console.log("Registration error:", error);
      
      // Capture Laravel Validation Errors (422) or general errors
      const message = error.response?.data?.message || "Registration failed.";
      const validationErrors = error.response?.data?.errors || { general: message };
      
      set({ errors: validationErrors, isLoading: false });
      return false;
    }
  },

  login: async (data) => {
    set({ isLoading: true, errors: null });
    try {
      // Send login data to Laravel
      const response = await apiClient.post("/auth/login", data);
      
      const { user, token } = response.data;

      set({
        user,
        authToken: token,
        isAuthenticated: true,
        isLoading: false,
      });

      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      return true; 
    } catch (error: any) {
      console.log("Login error:", error);
      
      const message = error.response?.data?.message || "Invalid credentials.";
      set({ errors: { general: message }, isLoading: false });
      return false;
    }
  },

  logout: () => {
    set({
      user: null,
      authToken: null,
      isAuthenticated: false,
      errors: null,
    });
    AsyncStorage.removeItem("authToken");
    AsyncStorage.removeItem("user");
    
    // Optionally: Make an API call to Laravel to revoke the token
    apiClient.post('/logout');
  },

  // Mock demo user for testing
  loginAsDemo: () => {
    const demoUser: User = {
      id: "usr_123",
      name: "Demo User",
      email: "demo@example.com",
      username: "demouser",
      bio: "Demo account",
      avatar_url: "https://i.pravatar.cc/150?img=12",
      followers_count: 1200,
      following_count: 300,
      posts_count: 65,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const demoToken = "demo-token-123";

    set({
      user: demoUser,
      authToken: demoToken,
      isAuthenticated: true,
    });
  },
}));