import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { apiClient } from "../api";
import { User } from "../api/types";

interface AuthState {
  user: User | null;
  authToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setAuthToken: (token: string | null) => void;
  clearAuth: () => void;
  checkAuth: () => Promise<void>;
  login: (data: Partial<User>) => Promise<unknown>;
  logout: () => void;
  loginAsDemo: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  authToken: null,
  isAuthenticated: false,
  isLoading: true,

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

    // Persist token
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

  login: async (data) => {
    try {
      const url = apiClient.defaults.baseURL;
      console.log("API URL in auth store:", url);
      const response = await apiClient.post("/auth/register", data);
    } catch (error) {
        console.log(error)
    }
    // set({
    //   user,
    //   authToken: token,
    //   isAuthenticated: true,
    // });

    // // Persist to storage
    // AsyncStorage.setItem("authToken", token);
    // AsyncStorage.setItem("user", JSON.stringify(user));
  },

  logout: () => {
    set({
      user: null,
      authToken: null,
      isAuthenticated: false,
    });
    AsyncStorage.removeItem("authToken");
    AsyncStorage.removeItem("user");
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
      // cover_url: null,
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
