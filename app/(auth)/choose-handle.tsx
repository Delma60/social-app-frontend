import { useGenerateHandle } from "@/libs/api/auth";
import { useAuthStore } from "@/libs/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChooseHandleScreen() {
  // Grab data passed from the Register screen
  const { data } = useLocalSearchParams<{ data: string }>();
  const formData = data ? JSON.parse(data) : { email: "", password: "" };

  const [selectedUsername, setSelectedUsername] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);

  const { register, isLoading } = useAuthStore();
  const generateHandleMutation = useGenerateHandle();

  // Compute the final handle formatting
  const computedHandle = selectedUsername ? `@${selectedUsername}` : "";

  // Fetch suggestions immediately when screen loads
  useEffect(() => {
    if (formData.email) {
      setIsGenerating(true);
      const emailPrefix = formData.email.split("@")[0];

      generateHandleMutation
        .mutateAsync(formData)
        .then((response) => {
          if (
            response.data?.suggestions &&
            response.data.suggestions.length > 0
          ) {
            setSuggestions(response.data.suggestions);
            // AUTO-SELECT THE FIRST SUGGESTION
            setSelectedUsername(response.data.suggestions[0]);
          } else {
            // Fallback if API returns empty array
            const fallback = emailPrefix
              .toLowerCase()
              .replace(/[^a-z0-9_]/g, "");
            setSuggestions([fallback, `${fallback}_1`, `${fallback}_99`]);
            setSelectedUsername(fallback);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch suggestions", error);
          // Fallback on error so the user isn't stuck
          const fallback = formData.email
            .split("@")[0]
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, "");
          setSuggestions([fallback]);
          setSelectedUsername(fallback);
        })
        .finally(() => setIsGenerating(false));
    }
  }, [data]);

  const handleRegister = async () => {
    if (!selectedUsername) return;
    register({
      ...formData,
      handle: computedHandle,
    }, {
     onSuccess(data) {
       router.replace("/(auth)/verify-email");
     },
     onError(error) {
        console.log(error)
        Alert.alert("Registration Failed", "This handle might be taken or invalid. Please select another one.");
     },
    });

    
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          disabled={isLoading}
        >
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Pick your Handle</Text>
            <Text style={styles.headerSubtitle}>
              We've generated some unique options for you.
            </Text>
          </View>

          {isGenerating ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.loadingText}>
                Finding the perfect handles...
              </Text>
            </View>
          ) : (
            <View style={styles.selectionArea}>
              {/* Hero Display of the currently selected handle */}
              <View style={styles.heroHandleBox}>
                <Text style={styles.heroHandleLabel}>
                  Your new handle will be
                </Text>
                <Text style={styles.heroHandleText}>{computedHandle}</Text>
              </View>

              <Text style={styles.optionsLabel}>Or choose an alternative:</Text>

              {/* Selectable Options List */}
              <View style={styles.optionsList}>
                {suggestions.map((suggestion, index) => {
                  const isSelected = selectedUsername === suggestion;
                  return (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.7}
                      disabled={isLoading}
                      onPress={() => setSelectedUsername(suggestion)}
                      style={[
                        styles.optionCard,
                        isSelected
                          ? styles.optionCardActive
                          : styles.optionCardInactive,
                      ]}
                    >
                      <View style={styles.optionContent}>
                        <Text
                          style={[
                            styles.optionText,
                            isSelected
                              ? styles.optionTextActive
                              : styles.optionTextInactive,
                          ]}
                        >
                          @{suggestion}
                        </Text>
                      </View>

                      {/* Custom Radio Button Indicator */}
                      <View
                        style={[
                          styles.radioCircle,
                          isSelected && styles.radioCircleActive,
                        ]}
                      >
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Footer Button (Always stays at bottom) */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          onPress={handleRegister}
          disabled={isLoading || isGenerating}
          style={[
            styles.submitButton,
            isLoading || isGenerating
              ? styles.submitButtonDisabled
              : styles.submitButtonActive,
          ]}
        >
          {isLoading ? (
            <>
              <ActivityIndicator size="small" color="white" />
              <Text style={[styles.submitButtonText, { marginLeft: 8 }]}>
                Finalizing...
              </Text>
            </>
          ) : (
            <Text style={styles.submitButtonText}>Complete Registration</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#ffffff" },
  topNav: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },

  // -- Layout --
  scrollView: { flex: 1, backgroundColor: "#ffffff" },
  scrollContent: { flexGrow: 1, paddingBottom: 24 }, // Extra padding at bottom for smooth scrolling
  contentContainer: { flex: 1, paddingHorizontal: 24 },

  header: { marginTop: 16, marginBottom: 32 },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 8,
    lineHeight: 22,
  },

  // -- Loading State --
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: "#64748b",
    fontWeight: "500",
  },

  // -- Selection Area --
  selectionArea: { flex: 1 },

  heroHandleBox: {
    backgroundColor: "#eff6ff",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  heroHandleLabel: {
    fontSize: 12,
    color: "#0369a1",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  heroHandleText: { fontSize: 24, fontWeight: "bold", color: "#1d4ed8" },

  optionsLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 12,
  },
  optionsList: { gap: 12 },

  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 14,
    borderWidth: 2,
  },
  optionCardInactive: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
  },
  optionCardActive: {
    backgroundColor: "#f8fafc",
    borderColor: "#2563eb",
  },

  optionContent: { flex: 1 },
  optionText: { fontSize: 17, fontWeight: "600" },
  optionTextInactive: { color: "#334155" },
  optionTextActive: { color: "#1e40af" },

  // -- Custom Radio Button --
  radioCircle: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleActive: { borderColor: "#2563eb" },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#2563eb",
  },

  // -- Sticky Footer --
  stickyFooter: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24, // Keeps it comfortably off the bottom edge
    backgroundColor: "#ffffff", // Prevents scroll content from bleeding underneath
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonActive: {
    backgroundColor: "#0f172a",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: { backgroundColor: "#94a3b8" },
  submitButtonText: { color: "#ffffff", fontWeight: "bold", fontSize: 16 },
});
