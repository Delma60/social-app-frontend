import { Ionicons } from "@expo/vector-icons";
import { FlashList, ViewToken } from "@shopify/flash-list";
import { router } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
// Adjust this to fit exactly above your bottom tab bar
const VIDEO_HEIGHT = SCREEN_HEIGHT - 90;

// --- MOCK DATA (Social First) ---
const MOCK_FEED = [
  {
    id: "1",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    creator: "Toluwanimi",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    caption:
      "Traffic at toll gate is crazy right now. Anyone heading to Sango should pass under the bridge instead. 🚗💨 #OtaTraffic #Update",
    audio: "Original Audio - Toluwanimi",
    likes: "14.2k",
    comments: "342",
    shares: "1.1k",
  },
  {
    id: "2",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    creator: "Mama Fish",
    avatarUrl: "https://i.pravatar.cc/150?img=33",
    caption:
      "Trying out this new local mix for the fingerlings. The growth rate so far has been insane! 🐟📈",
    audio: "Trending Song - Burna Boy",
    likes: "8,402",
    comments: "128",
    shares: "56",
  },
];

// --- THE SOCIAL REEL COMPONENT ---
const SocialReel = ({ item, isActive }: { item: any; isActive: boolean }) => {
  const player = useVideoPlayer(item.videoUrl, (player) => {
    player.loop = true;
    player.muted = false;
  });

  if (isActive) {
    player.play();
  } else {
    player.pause();
  }

  return (
    <View style={styles.reelContainer}>
      {/* 1. MEDIA: Pure Edge-to-Edge Video */}
      <VideoView
        style={StyleSheet.absoluteFill}
        player={player}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        contentFit="cover"
      />

      {/* 2. RIGHT SIDEBAR: Stacked Icons (Reels/Shorts Style) */}
      <View style={styles.rightSidebar}>
        <Pressable style={styles.sidebarIcon}>
          <Ionicons name="heart" size={32} color="#fff" />
          <Text style={styles.sidebarText}>{item.likes}</Text>
        </Pressable>

        <Pressable style={styles.sidebarIcon}>
          <Ionicons name="chatbubble-ellipses" size={30} color="#fff" />
          <Text style={styles.sidebarText}>{item.comments}</Text>
        </Pressable>

        {/* Keeping the WhatsApp Remix as the primary Share option */}
        <Pressable style={styles.sidebarIcon}>
          <View style={styles.whatsappShareBg}>
            <Ionicons name="logo-whatsapp" size={20} color="#fff" />
          </View>
          <Text style={styles.sidebarText}>{item.shares}</Text>
        </Pressable>

        <Pressable style={styles.sidebarIcon}>
          <Ionicons name="ellipsis-horizontal" size={26} color="#fff" />
        </Pressable>
      </View>

      {/* 3. BOTTOM INFO: Creator & Caption (Bottom Left) */}
      <View style={styles.bottomInfo}>
        {/* Creator Row */}
        <Pressable
          style={styles.creatorRow}
          onPress={() =>
            router.push({
              pathname: `/user/[id]`,
              params: { id: item.creator },
            })
          }
        >
          <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
          <Text style={styles.creatorName}>@{item.creator}</Text>
          <Pressable style={styles.followButton}>
            <Text style={styles.followText}>Follow</Text>
          </Pressable>
        </Pressable>

        {/* Caption */}
        <Text style={styles.captionText} numberOfLines={2}>
          {item.caption}
        </Text>

        {/* Audio Track */}
        <View style={styles.audioRow}>
          <Ionicons name="musical-notes" size={14} color="#fff" />
          <Text style={styles.audioText}>{item.audio}</Text>
        </View>
      </View>
    </View>
  );
};

// --- MAIN FEED SCREEN ---
export default function FeedScreen() {
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<any>[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  return (
    <View style={styles.mainContainer}>
      <FlashList
        data={MOCK_FEED}
        renderItem={({ item, index }) => (
          <SocialReel item={item} isActive={index === activeIndex} />
        )}
        keyExtractor={(item) => item.id}
        estimatedItemSize={VIDEO_HEIGHT}
        showsVerticalScrollIndicator={false}
        // --- IMMERSIVE SCROLL MECHANICS ---
        pagingEnabled={true}
        snapToInterval={VIDEO_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  reelContainer: {
    height: VIDEO_HEIGHT,
    width: SCREEN_WIDTH,
    backgroundColor: "#000",
  },

  // -- Right Sidebar (Like, Comment, Share) --
  rightSidebar: {
    position: "absolute",
    right: 12,
    bottom: 24,
    alignItems: "center",
    zIndex: 10,
  },
  sidebarIcon: {
    alignItems: "center",
    marginBottom: 22,
  },
  whatsappShareBg: {
    backgroundColor: "#25D366",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  sidebarText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // -- Bottom Info Area (Avatar, Caption, Audio) --
  bottomInfo: {
    position: "absolute",
    bottom: 24,
    left: 16,
    width: "75%", // Leaves room for the right sidebar
    zIndex: 10,
  },
  creatorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#fff",
    marginRight: 10,
  },
  creatorName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 12,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  followButton: {
    borderColor: "#fff",
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  followText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  captionText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  audioRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  audioText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 6,
    fontWeight: "500",
  },
});
