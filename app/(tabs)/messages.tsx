import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Image, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- MOCK DATA ---
const MOCK_CHATS = [
  {
    id: "1",
    user: "Ota Aquatics",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    lastMessage: "Yes, the 50kg bags are still available. I can deliver to Sango tomorrow morning.",
    time: "10:42 AM",
    unreadCount: 2,
    isOnline: true,
    type: "deal",
    contextImage: "https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?q=80&w=150&auto=format&fit=crop", 
  },
  {
    id: "2",
    user: "Toluwanimi",
    avatarUrl: "https://i.pravatar.cc/150?img=33",
    lastMessage: "Are you still at the Toll Gate? The traffic map is showing dark red.",
    time: "9:15 AM",
    unreadCount: 0,
    isOnline: false,
    type: "social",
    contextImage: null,
  },
  {
    id: "3",
    user: "Dele_Dev",
    avatarUrl: "https://i.pravatar.cc/150?img=15",
    lastMessage: "I saw your post about the MikroTik config. How much do you charge for a 5km radius setup?",
    time: "Yesterday",
    unreadCount: 1,
    isOnline: true,
    type: "deal",
    contextImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: "4",
    user: "Mama Fish",
    avatarUrl: "https://i.pravatar.cc/150?img=44",
    lastMessage: "Thanks for the update! 🙌",
    time: "Tuesday",
    unreadCount: 0,
    isOnline: false,
    type: "social",
    contextImage: null,
  }
];

// --- COMPONENTS ---

// 1. Filter Pill Component
const FilterPill = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
  <Pressable 
    style={[styles.filterPill, active && styles.filterPillActive]} 
    onPress={onPress}
  >
    <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
  </Pressable>
);

// 2. Individual Chat Row Component
const ChatRow = ({ item }: { item: any }) => (
  <Pressable style={({ pressed }) => [styles.chatRow, { backgroundColor: pressed ? '#f8fafc' : '#ffffff' }]}>
    
    {/* Avatar with Online Indicator */}
    <View style={styles.avatarContainer}>
      <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
      {item.isOnline && <View style={styles.onlineBadge} />}
    </View>

    {/* Main Chat Content */}
    <View style={styles.chatContent}>
      <View style={styles.chatHeader}>
        <Text style={styles.userName} numberOfLines={1}>{item.user}</Text>
        <Text style={[styles.timeText, item.unreadCount > 0 && styles.timeTextUnread]}>
          {item.time}
        </Text>
      </View>
      
      <View style={styles.chatFooter}>
        <Text 
          style={[styles.lastMessage, item.unreadCount > 0 && styles.lastMessageUnread]} 
          numberOfLines={2}
        >
          {item.lastMessage}
        </Text>

        <View style={styles.rightIndicators}>
          {/* Unread Badge */}
          {item.unreadCount > 0 ? (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          ) : null}

          {/* Context Image Thumbnail (If chat started from a post/deal) */}
          {item.contextImage && item.unreadCount === 0 && (
            <Image source={{ uri: item.contextImage }} style={styles.contextThumbnail} />
          )}
        </View>
      </View>
    </View>
    
  </Pressable>
);

// --- MAIN SCREEN ---
export default function MessagesScreen() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Simple mock filter logic
  const filteredChats = MOCK_CHATS.filter(chat => {
    if (activeFilter === "Unread") return chat.unreadCount > 0;
    if (activeFilter === "Deals") return chat.type === "deal";
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      
      {/* 1. Header Area */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Pressable style={styles.newChatButton}>
          <Ionicons name="create-outline" size={24} color="#111827" />
        </Pressable>
      </View>

      {/* 2. Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#9ca3af" />
          <TextInput
            placeholder="Search messages..."
            style={styles.searchInput}
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* 3. Filter Pills */}
      <View style={styles.filtersContainer}>
        <FilterPill label="All" active={activeFilter === "All"} onPress={() => setActiveFilter("All")} />
        <FilterPill label="Unread" active={activeFilter === "Unread"} onPress={() => setActiveFilter("Unread")} />
        <FilterPill label="Deals" active={activeFilter === "Deals"} onPress={() => setActiveFilter("Deals")} />
      </View>

      {/* 4. Chat List */}
      <View style={styles.listContainer}>
        <FlashList
          data={filteredChats}
          renderItem={({ item }) => <ChatRow item={item} />}
          keyExtractor={(item) => item.id}
          estimatedItemSize={80}
          contentContainerStyle={{ paddingBottom: 20 }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>

    </SafeAreaView>
  );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  
  // -- Header --
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  newChatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },

  // -- Search --
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#111827",
  },

  // -- Filters --
  filtersContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: "#dcfce7", // WhatsApp light green
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  filterTextActive: {
    color: "#15803d", // WhatsApp dark green
  },

  // -- List --
  listContainer: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginLeft: 80, // Aligns exactly with the text, skipping the avatar
  },

  // -- Chat Row --
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e5e7eb",
  },
  onlineBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#25D366", // Active Green
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  chatContent: {
    flex: 1,
    justifyContent: "center",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    flex: 1,
    paddingRight: 8,
  },
  timeText: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "500",
  },
  timeTextUnread: {
    color: "#25D366", // Highlights time in green if unread
    fontWeight: "bold",
  },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    flex: 1,
    fontSize: 15,
    color: "#6b7280",
    lineHeight: 20,
    paddingRight: 12,
  },
  lastMessageUnread: {
    color: "#111827",
    fontWeight: "600",
  },
  
  // Right side indicators (Badge or Context Image)
  rightIndicators: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 24,
  },
  unreadBadge: {
    backgroundColor: "#25D366",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  contextThumbnail: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: "#e5e7eb",
  },
});