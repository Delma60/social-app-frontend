import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { 
  View, Text, TextInput, Pressable, StyleSheet, 
  ScrollView, Image, Switch, KeyboardAvoidingView, Platform 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreatePostScreen() {
  const [caption, setCaption] = useState("");
  const [allowDMs, setAllowDMs] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [saveToDevice, setSaveToDevice] = useState(false);

  // Mock selected video thumbnail
  const videoThumbnail = "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=300&auto=format&fit=crop"; 

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* 1. HEADER */}
        <View style={styles.header}>
          <Pressable style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#111827" />
          </Pressable>
          <Text style={styles.headerTitle}>Post</Text>
          <View style={{ width: 28 }} /> {/* Spacer for centering */}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          
          {/* 2. CAPTION & THUMBNAIL SPLIT (Classic TikTok/IG Layout) */}
          <View style={styles.topSection}>
            <View style={styles.captionContainer}>
              <TextInput
                style={styles.captionInput}
                placeholder="Describe your post... Add hashtags or mention creators."
                placeholderTextColor="#9ca3af"
                multiline
                maxLength={500}
                value={caption}
                onChangeText={setCaption}
              />
            </View>
            
            <Pressable style={styles.thumbnailContainer}>
              <Image source={{ uri: videoThumbnail }} style={styles.thumbnailImage} />
              <View style={styles.thumbnailOverlay}>
                <Text style={styles.thumbnailText}>Select Cover</Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.separator} />

          {/* 3. SETTINGS LIST */}
          <View style={styles.settingsGroup}>
            
            {/* Location Tag */}
            <Pressable style={styles.settingRow}>
              <View style={styles.settingIconLeft}>
                <Ionicons name="location-outline" size={24} color="#111827" />
              </View>
              <Text style={styles.settingLabel}>Add Location</Text>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>Ota, Ogun</Text>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            </Pressable>

            {/* Tag People */}
            <Pressable style={styles.settingRow}>
              <View style={styles.settingIconLeft}>
                <Ionicons name="person-add-outline" size={24} color="#111827" />
              </View>
              <Text style={styles.settingLabel}>Tag People</Text>
              <View style={styles.settingRight}>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            </Pressable>

            {/* WhatsApp DM Toggle (The Local Remix) */}
            <View style={styles.settingRow}>
              <View style={styles.settingIconLeft}>
                <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingLabel}>Allow WhatsApp DMs</Text>
                <Text style={styles.settingSubLabel}>Viewers can message you directly</Text>
              </View>
              <Switch 
                value={allowDMs} 
                onValueChange={setAllowDMs}
                trackColor={{ false: "#e5e7eb", true: "#34d399" }}
                thumbColor={Platform.OS === 'ios' ? "#fff" : (allowDMs ? "#059669" : "#f3f4f6")}
              />
            </View>

            {/* Allow Comments */}
            <View style={styles.settingRow}>
              <View style={styles.settingIconLeft}>
                <Ionicons name="chatbubble-outline" size={24} color="#111827" />
              </View>
              <Text style={styles.settingLabel}>Allow Comments</Text>
              <Switch 
                value={allowComments} 
                onValueChange={setAllowComments}
                trackColor={{ false: "#e5e7eb", true: "#111827" }}
                thumbColor={Platform.OS === 'ios' ? "#fff" : (allowComments ? "#4b5563" : "#f3f4f6")}
              />
            </View>

            {/* Save to Device */}
            <View style={styles.settingRow}>
              <View style={styles.settingIconLeft}>
                <Ionicons name="download-outline" size={24} color="#111827" />
              </View>
              <Text style={styles.settingLabel}>Save to Device</Text>
              <Switch 
                value={saveToDevice} 
                onValueChange={setSaveToDevice}
                trackColor={{ false: "#e5e7eb", true: "#111827" }}
                thumbColor={Platform.OS === 'ios' ? "#fff" : (saveToDevice ? "#4b5563" : "#f3f4f6")}
              />
            </View>

          </View>
        </ScrollView>

        {/* 4. BOTTOM ACTION BAR */}
        <View style={styles.bottomBar}>
          <Pressable style={styles.draftButton}>
            <Ionicons name="folder-outline" size={20} color="#111827" />
            <Text style={styles.draftButtonText}>Drafts</Text>
          </Pressable>
          
          <Pressable style={styles.postButton}>
            <Ionicons name="paper-plane" size={18} color="#fff" />
            <Text style={styles.postButtonText}>Post</Text>
          </Pressable>
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
  
  // -- Header --
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },

  // -- Top Section (Caption & Thumbnail) --
  topSection: {
    flexDirection: "row",
    padding: 16,
    minHeight: 160,
  },
  captionContainer: {
    flex: 1,
    paddingRight: 16,
  },
  captionInput: {
    fontSize: 16,
    color: "#111827",
    lineHeight: 24,
    textAlignVertical: "top",
  },
  thumbnailContainer: {
    width: 100,
    height: 140,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#e5e7eb",
    position: "relative",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  thumbnailOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 6,
    alignItems: "center",
  },
  thumbnailText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "600",
  },

  separator: {
    height: 8,
    backgroundColor: "#f9fafb",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
  },

  // -- Settings List --
  settingsGroup: {
    paddingVertical: 8,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingIconLeft: {
    width: 32,
    alignItems: "flex-start",
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  settingSubLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingValue: {
    fontSize: 15,
    color: "#4b5563",
    marginRight: 8,
  },

  // -- Bottom Action Bar --
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    backgroundColor: "#ffffff",
  },
  draftButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  draftButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  postButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1DA1F2", // Or your brand color
    paddingVertical: 14,
    borderRadius: 12,
  },
  postButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});