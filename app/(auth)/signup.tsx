import { useGenerateHandle } from "@/libs/api";
import { useAuthStore } from "@/libs/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    identifier: "",
    password: "",
    password_confirmation: "",
  });
  const [generatedHandle, setGeneratedHandle] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGeneratingHandle, setIsGeneratingHandle] = useState(false);


  // Local form state
  // const [username, setUsername] = useState("");
  // const [identifier, setIdentifier] = useState(""); // Email or Phone
  // const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Zustand global state (for demo purposes)
  const { register, errors, isLoading } = useAuthStore();
  const generateHandleMutation = useGenerateHandle();
  const handleGenerationTimer = useRef<NodeJS.Timeout | number | undefined>(undefined);

  // Auto-generate the handle: lowercase, replace spaces and special characters with underscores
  useEffect(() => {
    console.log("generating handle for:", formData.username)
    if (handleGenerationTimer.current) {
      clearTimeout(handleGenerationTimer.current);
    }

    if (formData.username && formData.username.trim().length > 0) {
      console.log("working")
      setIsGeneratingHandle(true);
      handleGenerationTimer.current = setTimeout(async () => {
        try {
          const response = await generateHandleMutation.mutateAsync({
            username: formData.username,
          });
          console.log("Handle generation response:", response.data.handle);
          setGeneratedHandle(response.data.handle);
          if (response.data?.suggestions) {
            setSuggestions(response.data.suggestions);
          }
        } catch (error) {
          console.error("Failed to generate handle suggestions:", error);
        } finally {
          setIsGeneratingHandle(false);
        }
      }, 500); // Debounce 500ms
    } else {
      setSuggestions([]);
    }

    return () => {
      if (handleGenerationTimer.current) {
        clearTimeout(handleGenerationTimer.current);
      }
    };
  }, [formData.username]);

  const handleSignUp = () => {
    // Pass the auto-generated handle to your API
    console.log("Signing up:", formData);
    // loginAsDemo();
    // router.replace("/(tabs)");
  };


  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setFormData((prev) => ({ ...prev, username: suggestion }));
    setSuggestions([]);
    // if (errors.username) {
    //   setErrors((prev) => ({ ...prev, username: "" }));
    // }
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
              style={[styles.inputWrapper, { marginBottom: formData.username ? 8 : 16 }]}
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
                value={formData.username}
                onChangeText={(value) => handleInputChange("username", value)}
              />
            </View>

            {/* Real-time Handle Preview */}
            {(generatedHandle && formData.username.length > 0) && (
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
                value={formData.identifier}
                onChangeText={(value) => handleInputChange("identifier", value)}
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
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
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
