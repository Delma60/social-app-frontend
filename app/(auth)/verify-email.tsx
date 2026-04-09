import { useGenerateHandle } from "@/libs/api/auth";
import { useAuthStore } from "@/libs/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProcessRegistrationScreen() {
  // 1. Grab data passed from the Register screen (Email & Password)
  const { data } = useLocalSearchParams<{ data: string }>();
  const formData = data ? JSON.parse(data) : null;

  const [statusText, setStatusText] = useState("Preparing your account...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register } = useAuthStore();
  const generateHandleMutation = useGenerateHandle();

  // Use a ref to prevent double-firing in strict mode
  const hasProcessed = useRef(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {!errorMessage ? (
          // --- LOADING STATE ---
          <View style={styles.centerContent}>
            <View style={styles.spinnerBox}>
              <ActivityIndicator size="large" color="#2563eb" />
            </View>
            <Text style={styles.title}>Just a moment</Text>
            <Text style={styles.subtitle}>{statusText}</Text>
          </View>
        ) : (
          // --- ERROR STATE ---
          <View style={styles.centerContent}>
            <View style={styles.errorIconBox}>
              <Ionicons name="close" size={40} color="#ef4444" />
            </View>
            <Text style={styles.title}>Oops, something went wrong</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>Go Back and Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#ffffff" },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: "center" },
  centerContent: { alignItems: "center", justifyContent: "center" },

  spinnerBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  errorIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fef2f2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: { fontSize: 16, color: "#6b7280", textAlign: "center" },
  errorText: {
    fontSize: 15,
    color: "#ef4444",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
  },

  backButton: {
    marginTop: 32,
    backgroundColor: "#111827",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  backButtonText: { color: "#ffffff", fontWeight: "600", fontSize: 16 },
});
