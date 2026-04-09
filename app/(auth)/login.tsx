import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/libs/stores/auth-store";
import { useLogin } from "@/libs/api/auth";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();

  // Local form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // API mutation
  const loginMutation = useLogin();

  // Zustand global state
  const { loginAsDemo } = useAuthStore();

  const handleDemoLogin = () => {
    loginAsDemo();
    router.replace("/(tabs)");
  };

  const handleLogin = async () => {
    // Validate
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
    if (!password) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    try {
      await loginMutation.mutateAsync({
        email: email.trim(),
        password,
      });

      // Success - user is logged in and redirected by the hook
      router.replace("/(tabs)");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      Alert.alert("Login Error", errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.container}>
          {/* 1. BRANDING & HEADER */}
          <View style={styles.headerContainer}>
            <View style={styles.logoBox}>
              <Ionicons name="infinite" size={36} color="#ffffff" />
            </View>
            <Text style={styles.welcomeText}>Welcome back, Dele</Text>
            <Text style={styles.subText}>
              Log in to connect with your local circle.
            </Text>
          </View>

          {/* 2. STANDARD FORM INPUTS */}
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#94a3b8"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!loginMutation.isPending}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#94a3b8"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#94a3b8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#94a3b8"
                />
              </Pressable>
            </View>

            <Pressable style={styles.forgotPasswordBtn}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </Pressable>

            {/* Login Button - Now Connected to API */}
            <Pressable
              onPress={handleLogin}
              disabled={loginMutation.isPending}
              style={({ pressed }) => [
                styles.loginButton,
                {
                  backgroundColor: loginMutation.isPending
                    ? "#64748b"
                    : pressed
                      ? "#1e293b"
                      : "#0f172a",
                  opacity: loginMutation.isPending ? 0.7 : 1,
                },
              ]}
            >
              {loginMutation.isPending ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.loginButtonText}>Log In</Text>
              )}
            </Pressable>

            {loginMutation.isError && (
              <View
                style={{
                  marginTop: 12,
                  padding: 12,
                  backgroundColor: "#fee2e2",
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#991b1b", fontSize: 14 }}>
                  {(loginMutation.error as any)?.response?.data?.message ||
                    "Login failed"}
                </Text>
              </View>
            )}
          </View>

          {/* 3. DIVIDER */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>DEVELOPMENT</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* 4. DEMO LOGIN ACTION */}
          <View style={styles.socialContainer}>
            <Pressable
              onPress={handleDemoLogin}
              style={({ pressed }) => [
                styles.demoButton,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Ionicons name="flash" size={20} color="#ffffff" />
              <Text style={styles.demoButtonText}>Quick Demo Login</Text>
            </Pressable>
          </View>

          {/* 5. FOOTER */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Pressable onPress={() => router.push("/signup")}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  // -- Branding --
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#1DA1F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#1DA1F2",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 8,
  },
  subText: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
  },

  // -- Form --
  formContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    marginBottom: 16,
    paddingHorizontal: 14,
    height: 56,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#0f172a",
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPasswordBtn: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#1DA1F2",
    fontSize: 14,
    fontWeight: "600",
  },
  loginButton: {
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // -- Divider --
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e8f0",
  },
  dividerText: {
    paddingHorizontal: 16,
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  // -- Demo Login --
  socialContainer: {
    gap: 12,
  },
  demoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: 14,
    backgroundColor: "#8b5cf6", // Distinct Purple for Dev/Demo mode
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  demoButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 8,
  },

  // -- Footer --
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  footerText: {
    color: "#64748b",
    fontSize: 15,
  },
  signUpText: {
    color: "#1DA1F2",
    fontSize: 15,
    fontWeight: "bold",
  },
});
