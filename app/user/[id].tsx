import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { View, Text, Pressable, StyleSheet, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 2;
// 3-column grid calculation
const ITEM_SIZE = (SCREEN_WIDTH - (GRID_GAP * 2)) / 3;

// --- MOCK DATA FOR GRID ---
const MOCK_PUBLIC_POSTS = [
  { id: "1", type: "reel", views: "14.2k", image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=400&auto=format&fit=crop" }, 
  { id: "2", type: "deal", price: "₦28k", image: "https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?q=80&w=400&auto=format&fit=crop" }, 
  { id: "3", type: "reel", views: "8.1k", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=400&auto=format&fit=crop" }, 
  { id: "4", type: "deal", price: "₦12k", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop" }, 
  { id: "5", type: "reel", views: "3k", image: "https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?q=80&w=400&auto=format&fit=crop" }, 
  { id: "6", type: "reel", views: "2.1k", image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=400&auto=format&fit=crop" }, 
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
export default function PublicProfileScreen() {
  const router = useRouter();
  // Grab the username from the previous screen
  const { id } = useLocalSearchParams<{ id: string }>(); 
  
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);

  const displayedData = activeTab === "posts" 
    ? MOCK_PUBLIC_POSTS 
    : MOCK_PUBLIC_POSTS.filter(post => post.type === "deal");

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      
      {/* 1. TOP NAV BAR (With Back Button) */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#0f172a" />
        </Pressable>
        
        <View style={styles.navCenter}>
          <Text style={styles.navUsername}>@{id}</Text>
          <Ionicons name="checkmark-circle" size={14} color="#1DA1F2" style={{ marginLeft: 4 }} />
        </View>

        <Pressable style={styles.moreBtn}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#0f172a" />
        </Pressable>
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
            
            {/* 2. PROFILE STATS */}
            <View style={styles.profileStatsRow}>
              <Image 
                source={{ uri: `https://ui-avatars.com/api/?name=${id}&background=0D8ABC&color=fff&size=150` }} 
                style={styles.avatar} 
              />
              
              <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>34</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>12.4k</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>412</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
              </View>
            </View>

            {/* 3. BIO SECTION */}
            <View style={styles.bioContainer}>
              <Text style={styles.fullName}>{id}</Text>
              <Text style={styles.bioText}>
                Based in Ota 📍{"\n"}Business inquiries & local deals.{"\n"}Fast response via DM!
              </Text>
              <View style={styles.linkRow}>
                <Ionicons name="link-outline" size={16} color="#1DA1F2" />
                <Text style={styles.linkText}>wa.me/message/{id}</Text>
              </View>
            </View>

            {/* 4. PUBLIC ACTION BUTTONS */}
            <View style={styles.actionRow}>
              <Pressable 
                style={[styles.actionButtonPrimary, isFollowing && styles.actionButtonFollowing]}
                onPress={() => setIsFollowing(!isFollowing)}
              >
                <Text style={[styles.actionButtonTextPrimary, isFollowing && styles.actionTextFollowing]}>
                  {isFollowing ? "Following" : "Follow"}
                </Text>
              </Pressable>
              
              <Pressable style={styles.actionButtonSecondary}>
                <Ionicons name="logo-whatsapp" size={16} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.actionButtonTextSecondary}>Message</Text>
              </Pressable>
            </View>

            {/* 5. TABS */}
            <View style={styles.tabsRow}>
              <Pressable style={styles.tab} onPress={() => setActiveTab("posts")}>
                <Ionicons 
                  name={activeTab === "posts" ? "grid" : "grid-outline"} 
                  size={24} 
                  color={activeTab === "posts" ? "#0f172a" : "#94a3b8"} 
                />
                {activeTab === "posts" && <View style={styles.activeTabIndicator} />}
              </Pressable>

              <Pressable style={styles.tab} onPress={() => setActiveTab("deals")}>
                <Ionicons 
                  name={activeTab === "deals" ? "pricetag" : "pricetag-outline"} 
                  size={24} 
                  color={activeTab === "deals" ? "#0f172a" : "#94a3b8"} 
                />
                {activeTab === "deals" && <View style={styles.activeTabIndicator} />}
              </Pressable>
            </View>

          </View>
        }
      />
    </SafeAreaView>
  );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  headerWrapper: {
    backgroundColor: "#ffffff",
  },

  // -- Top Nav --
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  backBtn: {
    padding: 8,
  },
  navCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  navUsername: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  moreBtn: {
    padding: 8,
  },

  // -- Profile Stats --
  profileStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 4,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#f1f5f9",
    marginRight: 24,
  },
  statsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 10,
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  statLabel: {
    fontSize: 13,
    color: "#475569",
    marginTop: 2,
  },

  // -- Bio --
  bioContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  fullName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  bioText: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 20,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  linkText: {
    fontSize: 14,
    color: "#1DA1F2",
    fontWeight: "500",
    marginLeft: 4,
  },

  // -- Action Buttons (Public View) --
  actionRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 8,
  },
  actionButtonPrimary: {
    flex: 1,
    backgroundColor: "#1DA1F2", // Twitter/Accent Blue
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonFollowing: {
    backgroundColor: "#f1f5f9", // Gray when following
  },
  actionButtonTextPrimary: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  actionTextFollowing: {
    color: "#0f172a",
  },
  actionButtonSecondary: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#25D366", // WhatsApp Green
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonTextSecondary: {
    color: "#ffffff",
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

  // -- Grid Items --
  gridItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE * 1.5,
    marginBottom: GRID_GAP,
    marginRight: GRID_GAP,
    backgroundColor: "#f1f5f9",
    position: "relative",
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
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
  gridDealText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "bold",
  },
});