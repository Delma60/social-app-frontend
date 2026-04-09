import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from "react-native";
import { router } from "expo-router";
import { useRegister } from "@/libs/api/auth";

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const registerMutation = useRegister();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await registerMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        username: formData.username || formData.email.split("@")[0],
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });

      // Registration successful, user is automatically logged in
      Alert.alert("Success", "Account created successfully!");
      router.replace("/(tabs)");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Registration failed";
      const validationErrors = error.response?.data?.errors || {};

      // Handle validation errors from backend
      if (Object.keys(validationErrors).length > 0) {
        const backendErrors: Record<string, string> = {};
        Object.keys(validationErrors).forEach((key) => {
          backendErrors[key] = validationErrors[key][0];
        });
        setErrors(backendErrors);
      } else {
        Alert.alert("Error", errorMessage);
      }
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 py-8">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900">Create Account</Text>
          <Text className="text-gray-600 mt-2">Join our community today</Text>
        </View>

        {/* Form Fields */}
        <View className="space-y-4">
          {/* Name Field */}
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-2">Full Name</Text>
            <TextInput
              className={`px-4 py-3 border rounded-lg text-gray-900 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="John Doe"
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              editable={!registerMutation.isPending}
            />
            {errors.name && <Text className="text-red-500 text-sm mt-1">{errors.name}</Text>}
          </View>

          {/* Email Field */}
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-2">Email</Text>
            <TextInput
              className={`px-4 py-3 border rounded-lg text-gray-900 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="john@example.com"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!registerMutation.isPending}
            />
            {errors.email && <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>}
          </View>

          {/* Username Field */}
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-2">Username (optional)</Text>
            <TextInput
              className={`px-4 py-3 border rounded-lg text-gray-900 ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="johndoe"
              value={formData.username}
              onChangeText={(value) => handleInputChange("username", value)}
              autoCapitalize="none"
              editable={!registerMutation.isPending}
            />
            {errors.username && <Text className="text-red-500 text-sm mt-1">{errors.username}</Text>}
            <Text className="text-gray-500 text-xs mt-1">If blank, will use email prefix</Text>
          </View>

          {/* Password Field */}
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-2">Password</Text>
            <TextInput
              className={`px-4 py-3 border rounded-lg text-gray-900 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              secureTextEntry
              editable={!registerMutation.isPending}
            />
            {errors.password && <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>}
            <Text className="text-gray-500 text-xs mt-1">At least 8 characters</Text>
          </View>

          {/* Confirm Password Field */}
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-2">Confirm Password</Text>
            <TextInput
              className={`px-4 py-3 border rounded-lg text-gray-900 ${
                errors.password_confirmation ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
              value={formData.password_confirmation}
              onChangeText={(value) => handleInputChange("password_confirmation", value)}
              secureTextEntry
              editable={!registerMutation.isPending}
            />
            {errors.password_confirmation && (
              <Text className="text-red-500 text-sm mt-1">{errors.password_confirmation}</Text>
            )}
          </View>
        </View>

        {/* Register Button */}
        <TouchableOpacity
          onPress={handleRegister}
          disabled={registerMutation.isPending}
          className={`mt-8 py-3 rounded-lg flex-row justify-center items-center ${
            registerMutation.isPending ? "bg-blue-400" : "bg-blue-600"
          }`}
        >
          {registerMutation.isPending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Register Error */}
        {registerMutation.isError && (
          <View className="mt-4 p-4 bg-red-100 rounded-lg">
            <Text className="text-red-800">
              {(registerMutation.error as any)?.response?.data?.message ||
                "An error occurred during registration"}
            </Text>
          </View>
        )}

        {/* Login Link */}
        <View className="mt-6 flex-row justify-center">
          <Text className="text-gray-600">Already have an account? </Text>
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/login")}
            disabled={registerMutation.isPending}
          >
            <Text className="text-blue-600 font-semibold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
