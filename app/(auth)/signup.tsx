import { useAuthStore } from "@/libs/stores/auth-store";
import { UserProfile } from "@/libs/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const router = useRouter();

  // Local form state
  const [username, setUsername] = useState("");
  const [identifier, setIdentifier] = useState(""); // Email or Phone
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof UserProfile, string>>
  >({});

  // Zustand global state (for demo purposes)
  const { loginAsDemo, login } = useAuthStore();

  // Auto-generate the handle: lowercase, replace spaces and special characters with underscores
  const generatedHandle = username
    ? "@" +
      username
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
    : "";

  const handleSignUp = () => {
    // Pass the auto-generated handle to your API
    console.log("Signing up:", {
      username,
      handle: generatedHandle,
      identifier,
    });
    const {} = login({
      username,
      handle: generatedHandle,
      identifier,
      password,
    });
    // loginAsDemo();
    // router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Header with Back Button */}
        <View style={styles.topNav}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* 1. BRANDING & HEADER */}
          <View style={styles.headerContainer}>
            <Text style={styles.welcomeText}>Join the Circle</Text>
            <Text style={styles.subText}>
              Create an account to discover deals and trends in your area.
            </Text>
          </View>

          {/* 2. FORM INPUTS */}
          <View style={styles.formContainer}>
            {/* Username Input */}
            <View
              style={[styles.inputWrapper, { marginBottom: username ? 8 : 16 }]}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color="#94a3b8"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#94a3b8"
                autoCapitalize="words"
                value={username}
                onChangeText={setUsername}
              />
            </View>

            {/* Real-time Handle Preview */}
            {username.length > 0 && (
              <Text style={styles.handlePreview}>
                Your handle will be:{" "}
                <Text style={styles.handleHighlight}>{generatedHandle}</Text>
              </Text>
            )}

            {/* Email / Phone Input */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="call-outline"
                size={20}
                color="#94a3b8"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number or Email"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={identifier}
                onChangeText={setIdentifier}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#94a3b8"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Create Password"
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

            {/* Terms of Service Text */}
            <Text style={styles.termsText}>
              By signing up, you agree to our{" "}
              <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>

            {/* Sign Up Button */}
            <Pressable
              onPress={handleSignUp}
              style={({ pressed }) => [
                styles.signupButton,
                { backgroundColor: pressed ? "#1e293b" : "#0f172a" },
              ]}
            >
              <Text style={styles.signupButtonText}>Create Account</Text>
            </Pressable>
          </View>

          {/* 3. FOOTER (Log In) */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => router.replace("/login")}>
              <Text style={styles.loginText}>Log In</Text>
            </Pressable>
          </View>
        </ScrollView>
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
  topNav: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // -- Branding --
  headerContainer: {
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subText: {
    fontSize: 15,
    color: "#64748b",
    lineHeight: 22,
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

  // -- Handle Preview --
  handlePreview: {
    fontSize: 13,
    color: "#64748b",
    marginLeft: 4,
    marginBottom: 16,
  },
  handleHighlight: {
    color: "#1DA1F2",
    fontWeight: "600",
  },

  termsText: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  termsLink: {
    color: "#0f172a",
    fontWeight: "bold",
  },

  signupButton: {
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
  signupButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // -- Footer --
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "auto",
    paddingTop: 20,
  },
  footerText: {
    color: "#64748b",
    fontSize: 15,
  },
  loginText: {
    color: "#1DA1F2",
    fontSize: 15,
    fontWeight: "bold",
  },
});
