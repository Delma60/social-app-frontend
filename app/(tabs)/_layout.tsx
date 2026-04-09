import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const { bottom } = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1DA1F2", // X (Twitter) Blue
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0.5,
          borderTopColor: "#eee",
          height: 60 + bottom,
          paddingBottom: Platform.OS === "ios" ? bottom : 8,
          paddingTop: 8,
        },
        headerShown: false,
      }}
    >
      {/* 1. TIKTOK LAYER: The Feed */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "play-circle" : "play-circle-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* 2. X/TWITTER LAYER: Trending */}
      <Tabs.Screen
        name="trending"
        options={{
          title: "Trending",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* 3. IG/FB LAYER: Create (The center button) */}
      <Tabs.Screen
        name="create"
        options={{
          title: "Post",
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle" size={32} color="#E1306C" /> // IG Pink/Red
          ),
        }}
      />

      {/* 4. WHATSAPP LAYER: Chats */}
      <Tabs.Screen
        name="messages"
        options={{
          title: "Chats",
          tabBarBadge: 3, // WhatsApp-style notification badge
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "chatbubbles" : "chatbubbles-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* 5. INSTAGRAM LAYER: Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
