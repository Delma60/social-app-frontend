import { useAuthStore } from "@/libs/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_GAP = 2;
const ITEM_SIZE = (SCREEN_WIDTH - GRID_GAP * 2) / 3;

// --- MOCK FALLBACK DATA ---
// This is used just in case the Zustand user hasn't loaded yet
const FALLBACK_PROFILE = {
  username: "Dele",
  handle: "@dele_codes",
  avatarUrl: "https://i.pravatar.cc/150?img=11",
  bio: "Full-Stack Dev (Laravel/Next.js) 💻\nLocal Hotspot & ISP Reseller 📶\nPassionate about sustainable aquaculture 🐟",
  location: "Ota, Ogun State",
  stats: { posts: 142, followers: "2.8k", following: 315 },
};

const MOCK_POSTS = [
  {
    id: "1",
    type: "reel",
    views: "1.2k",
    image:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870e1?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "2",
    type: "deal",
    price: "₦15k",
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "3",
    type: "reel",
    views: "850",
    image:
      "https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "4",
    type: "reel",
    views: "3.4k",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "5",
    type: "deal",
    price: "₦5k",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "6",
    type: "reel",
    views: "210",
    image:
      "https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?q=80&w=400&auto=format&fit=crop",
  },
];

// --- COMPONENTS ---
const GridItem = ({ item }: { item: any }) => (
  <Pressable style={styles.gridItem}>
    <Image source={{ uri: item.image }} style={styles.gridImage} />
    {item.type === "reel" ? (
      <View style={styles.gridBadgeLeft}>
        <Ionicons name="play" size={12} color="#fff" />
        <Text style={styles.gridBadgeText}>{item.views}</Text>
      </View>
    ) : (
      <View style={styles.gridBadgeDeal}>
        <Text style={styles.gridDealText}>{item.price}</Text>
      </View>
    )}
  </Pressable>
);

// --- MAIN SCREEN ---
export default function ProfileScreen() {
  const router = useRouter();

  // Pull the active user from global state
  const { logout, user } = useAuthStore();

  // Use the global user if available, otherwise fallback to mock data
  // Assuming your Zustand user has 'name' (which you are using as username) and 'handle'
  const displayUsername = user?.name || FALLBACK_PROFILE.username;
  const displayHandle = user?.handle || FALLBACK_PROFILE.handle;
  const displayAvatar = user?.avatarUrl || FALLBACK_PROFILE.avatarUrl;
  const displayBio = user?.bio || FALLBACK_PROFILE.bio;
  const displayStats = user?.stats || FALLBACK_PROFILE.stats;

  const [activeTab, setActiveTab] = useState("posts");
  const [isMenuVisible, setMenuVisible] = useState(false);

  const displayedData =
    activeTab === "posts"
      ? MOCK_POSTS
      : MOCK_POSTS.filter((post) => post.type === "deal");

  const handleLogout = () => {
    setMenuVisible(false);
    logout();
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* 1. TOP NAV BAR (Uses Handle) */}
      <View style={styles.navBar}>
        <View style={styles.navLeft}>
          <Ionicons name="lock-closed-outline" size={16} color="#0f172a" />
          <Text style={styles.navHandle}>{displayHandle}</Text>
          <Ionicons name="chevron-down" size={16} color="#0f172a" />
        </View>
        <View style={styles.navRight}>
          <Pressable style={styles.navIcon}>
            <Ionicons name="add-circle-outline" size={28} color="#0f172a" />
          </Pressable>
          <Pressable
            style={styles.navIcon}
            onPress={() => setMenuVisible(true)}
          >
            <Ionicons name="menu-outline" size={30} color="#0f172a" />
          </Pressable>
        </View>
      </View>

      <FlashList
        data={displayedData}
        numColumns={3}
        renderItem={({ item }) => <GridItem item={item} />}
        keyExtractor={(item) => item.id}
        estimatedItemSize={ITEM_SIZE}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerWrapper}>
            {/* 2. AVATAR & STATS */}
            <View style={styles.profileStatsRow}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: displayAvatar }} style={styles.avatar} />
                <View style={styles.addStoryBadge}>
                  <Ionicons name="add" size={16} color="#fff" />
                </View>
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>{displayStats.posts}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>
                    {displayStats.followers}
                  </Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>
                    {displayStats.following}
                  </Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
              </View>
            </View>

            {/* 3. BIO CONTAINER (Username replaces Full Name) */}
            <View style={styles.bioContainer}>
              <View style={styles.usernameRow}>
                <Text style={styles.usernameText}>{displayUsername}</Text>
                {user?.isVerified && (
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color="#1DA1F2"
                    style={{ marginLeft: 4 }}
                  />
                )}
              </View>

              {displayBio ? (
                <Text style={styles.bioText}>{displayBio}</Text>
              ) : null}

              <View style={styles.linkRow}>
                <Ionicons name="location-outline" size={16} color="#64748b" />
                <Text style={styles.locationText}>
                  {user?.location || FALLBACK_PROFILE.location}
                </Text>
              </View>
            </View>

            {/* 4. ACTION BUTTONS */}
            <View style={styles.actionRow}>
              <Pressable style={styles.actionButtonPrimary}>
                <Text style={styles.actionButtonTextPrimary}>Edit Profile</Text>
              </Pressable>
              <Pressable style={styles.actionButtonSecondary}>
                <Text style={styles.actionButtonTextSecondary}>
                  Share Profile
                </Text>
              </Pressable>
              <Pressable style={styles.actionIconButton}>
                <Ionicons name="person-add-outline" size={18} color="#0f172a" />
              </Pressable>
            </View>

            {/* 5. CONTENT TABS */}
            <View style={styles.tabsRow}>
              <Pressable
                style={styles.tab}
                onPress={() => setActiveTab("posts")}
              >
                <Ionicons
                  name={activeTab === "posts" ? "grid" : "grid-outline"}
                  size={24}
                  color={activeTab === "posts" ? "#0f172a" : "#94a3b8"}
                />
                {activeTab === "posts" && (
                  <View style={styles.activeTabIndicator} />
                )}
              </Pressable>

              <Pressable
                style={styles.tab}
                onPress={() => setActiveTab("deals")}
              >
                <Ionicons
                  name={activeTab === "deals" ? "pricetag" : "pricetag-outline"}
                  size={24}
                  color={activeTab === "deals" ? "#0f172a" : "#94a3b8"}
                />
                {activeTab === "deals" && (
                  <View style={styles.activeTabIndicator} />
                )}
              </Pressable>

              <Pressable style={styles.tab}>
                <Ionicons name="bookmark-outline" size={24} color="#94a3b8" />
              </Pressable>
            </View>
          </View>
        }
      />

      {/* --- THE SLIDE-UP MENU MODAL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.dragIndicator} />

                <View style={styles.menuList}>
                  <Pressable style={styles.menuItem}>
                    <Ionicons
                      name="settings-outline"
                      size={24}
                      color="#0f172a"
                    />
                    <Text style={styles.menuText}>Settings & Privacy</Text>
                  </Pressable>

                  <Pressable style={styles.menuItem}>
                    <Ionicons name="time-outline" size={24} color="#0f172a" />
                    <Text style={styles.menuText}>Your Activity</Text>
                  </Pressable>

                  <Pressable style={styles.menuItem}>
                    <Ionicons name="wallet-outline" size={24} color="#0f172a" />
                    <Text style={styles.menuText}>Wallet & Earnings</Text>
                  </Pressable>

                  <Pressable style={styles.menuItem}>
                    <Ionicons
                      name="bookmark-outline"
                      size={24}
                      color="#0f172a"
                    />
                    <Text style={styles.menuText}>Saved Posts & Deals</Text>
                  </Pressable>

                  <View style={styles.menuDivider} />

                  <Pressable style={styles.menuItem} onPress={handleLogout}>
                    <Ionicons
                      name="log-out-outline"
                      size={24}
                      color="#ef4444"
                    />
                    <Text style={[styles.menuText, { color: "#ef4444" }]}>
                      Log Out
                    </Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#ffffff" },
  headerWrapper: { backgroundColor: "#ffffff" },

  // -- Nav Bar --
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  navLeft: { flexDirection: "row", alignItems: "center" },
  navHandle: {
    fontSize: 18, // Slightly smaller than full name was, perfectly fits a handle
    fontWeight: "bold",
    color: "#0f172a",
    marginHorizontal: 6,
  },
  navRight: { flexDirection: "row", alignItems: "center" },
  navIcon: { marginLeft: 16 },

  // -- Avatar & Stats --
  profileStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 4,
  },
  avatarContainer: { position: "relative", marginRight: 24 },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#f1f5f9",
  },
  addStoryBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1DA1F2",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  statsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 10,
  },
  statBox: { alignItems: "center" },
  statNumber: { fontSize: 18, fontWeight: "bold", color: "#0f172a" },
  statLabel: { fontSize: 13, color: "#0f172a", marginTop: 2 },

  // -- Bio Section (Username Focus) --
  bioContainer: { paddingHorizontal: 16, marginTop: 16 },
  usernameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  usernameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
  },
  bioText: { fontSize: 14, color: "#334155", lineHeight: 20 },
  linkRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  locationText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
    marginLeft: 4,
  },

  // -- Buttons --
  actionRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 8,
  },
  actionButtonPrimary: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionIconButton: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonTextPrimary: {
    color: "#0f172a",
    fontWeight: "bold",
    fontSize: 14,
  },
  actionButtonTextSecondary: {
    color: "#0f172a",
    fontWeight: "bold",
    fontSize: 14,
  },

  // -- Tabs --
  tabsRow: {
    flexDirection: "row",
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    position: "relative",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 1.5,
    backgroundColor: "#0f172a",
  },

  // -- Grid --
  gridItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE * 1.5,
    marginBottom: GRID_GAP,
    marginRight: GRID_GAP,
    backgroundColor: "#f1f5f9",
    position: "relative",
  },
  gridImage: { width: "100%", height: "100%" },
  gridBadgeLeft: {
    position: "absolute",
    bottom: 6,
    left: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  gridBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  gridBadgeDeal: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#25D366",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  gridDealText: { color: "#ffffff", fontSize: 11, fontWeight: "bold" },

  // -- Modal --
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#cbd5e1",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  menuList: { gap: 4 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0f172a",
    marginLeft: 14,
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 8,
  },
});
