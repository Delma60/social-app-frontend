// Example: Using the generate-handle endpoint in a signup form

import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useGenerateHandle } from "@/libs/api/auth";

export function HandleGeneratorExample() {
  const [input, setInput] = useState(""); // name or email
  const [selectedHandle, setSelectedHandle] = useState("");
  const generateMutation = useGenerateHandle();

  // Auto-generate handles when input changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim().length > 2) {
        generateMutation.mutate({
          name: input.includes("@") ? undefined : input,
          email: input.includes("@") ? input : undefined,
        });
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [input]);

  const suggestions = generateMutation.data?.data?.suggestions || [];
  const mainHandle = generateMutation.data?.data?.handle;

  const handleSelectHandle = (handle: string) => {
    setSelectedHandle(handle);
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
        Generate Username
      </Text>

      {/* Input Field */}
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
        }}
        placeholder="Enter name or email"
        value={input}
        onChangeText={setInput}
      />

      {/* Loading State */}
      {generateMutation.isPending && (
        <View style={{ alignItems: "center", marginVertical: 12 }}>
          <ActivityIndicator size="small" color="#0066ff" />
        </View>
      )}

      {/* Main Generated Handle */}
      {mainHandle && !generateMutation.isPending && (
        <View
          style={{
            backgroundColor: "#e0f2ff",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
            borderWidth: 2,
            borderColor: "#0066ff",
          }}
        >
          <Text style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
            Suggested Handle
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#0066ff" }}>
            @{mainHandle}
          </Text>
          <TouchableOpacity
            style={{ marginTop: 8 }}
            onPress={() => handleSelectHandle(mainHandle)}
          >
            <Text style={{ color: "#0066ff", fontWeight: "600" }}>Use This</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Handle Suggestions */}
      {suggestions.length > 0 && (
        <View>
          <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 8 }}>
            Other Suggestions
          </Text>
          <FlatList
            scrollEnabled={false}
            data={suggestions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 8,
                  borderWidth: selectedHandle === item ? 2 : 1,
                  borderColor: selectedHandle === item ? "#0066ff" : "#ddd",
                }}
                onPress={() => handleSelectHandle(item)}
              >
                <Text style={{ fontSize: 16, fontWeight: "500" }}>@{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Selected Handle Display */}
      {selectedHandle && (
        <View
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: "#f0fff4",
            borderRadius: 8,
            borderLeftWidth: 4,
            borderLeftColor: "#10b981",
          }}
        >
          <Text style={{ color: "#666", fontSize: 12 }}>
            Selected Username
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#10b981" }}>
            @{selectedHandle}
          </Text>
        </View>
      )}

      {/* Error State */}
      {generateMutation.isError && (
        <View
          style={{
            marginTop: 12,
            padding: 12,
            backgroundColor: "#fee2e2",
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#991b1b" }}>
            Error generating handles. Please try again.
          </Text>
        </View>
      )}
    </View>
  );
}
