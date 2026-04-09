import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View, StyleSheet, Dimensions, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Calculate grid item width: Screen width minus paddings (16*2) minus gap (16) divided by 2
const GRID_ITEM_WIDTH = (SCREEN_WIDTH - 48) / 2;

// --- MOCK DATA ---
const HERO_TREND = {
  id: "1",
  category: "LIVE ALERT",
  title: "Toll Gate Traffic Gridlock",
  subtitle: "Major delays on the Sango-Ota axis. Alternative routes advised.",
  imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=600&auto=format&fit=crop",
  color: "#ef4444", // Red for alert
};

const GRID_TRENDS = [
  {
    id: "2",
    category: "MARKET",
    title: "Catfish Feed Drops 10%",
    imageUrl: "https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "3",
    category: "TECH",
    title: "Airtel 5G Outage in Ota",
    imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "4",
    category: "COMMUNITY",
    title: "Covenant Uni Resumes",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "5",
    category: "BUSINESS",
    title: "New ISP Pricing Models",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop",
  }
];

const HOT_TOPICS = ["#SangoOta", "MikroTik Configs", "Fuel Price", "Spectranet", "Poultry Farming"];

// --- MAIN SCREEN ---
export default function TrendingScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      
      {/* 1. Header: Location & Search */}
      <View style={styles.headerContainer}>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={16} color="#1DA1F2" />
          <Text style={styles.locationText}>Ota, Ogun State</Text>
          <Ionicons name="chevron-down" size={14} color="#64748b" style={{ marginLeft: 4 }} />
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#94a3b8" />
          <TextInput
            placeholder="Explore your area..."
            style={styles.searchInput}
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 2. Quick Topic Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topicsScroll}>
          {HOT_TOPICS.map((topic, index) => (
            <Pressable key={index} style={styles.topicPill}>
              <Text style={styles.topicText}>{topic}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>What's Happening</Text>

        {/* 3. Hero Card (Full Width Bento Block) */}
        <Pressable style={({ pressed }) => [styles.heroCard, { opacity: pressed ? 0.8 : 1 }]}>
          <ImageBackground 
            source={{ uri: HERO_TREND.imageUrl }} 
            style={styles.cardImage}
            imageStyle={{ borderRadius: 20 }}
          >
            <View style={styles.darkOverlay}>
              <View style={[styles.categoryPill, { backgroundColor: HERO_TREND.color }]}>
                <Text style={styles.categoryText}>{HERO_TREND.category}</Text>
              </View>
              <View>
                <Text style={styles.heroTitle}>{HERO_TREND.title}</Text>
                <Text style={styles.heroSubtitle} numberOfLines={2}>{HERO_TREND.subtitle}</Text>
              </View>
            </View>
          </ImageBackground>
        </Pressable>

        {/* 4. Grid Cards (2-Column Bento Blocks) */}
        <View style={styles.gridContainer}>
          {GRID_TRENDS.map((item) => (
            <Pressable 
              key={item.id} 
              style={({ pressed }) => [styles.gridItem, { opacity: pressed ? 0.8 : 1 }]}
            >
              <ImageBackground 
                source={{ uri: item.imageUrl }} 
                style={styles.cardImage}
                imageStyle={{ borderRadius: 16 }}
              >
                <View style={styles.darkOverlay}>
                  <View style={[styles.categoryPill, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                  </View>
                  <Text style={styles.gridTitle} numberOfLines={2}>{item.title}</Text>
                </View>
              </ImageBackground>
            </Pressable>
          ))}
        </View>

      </ScrollView>
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
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginLeft: 6,
  },
  searchBar: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#0f172a",
    fontWeight: '500',
  },

  // -- Content Area --
  scrollContent: {
    paddingBottom: 40,
  },
  topicsScroll: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  topicPill: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  topicText: {
    color: '#334155',
    fontWeight: '600',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  // -- Bento Cards --
  cardImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)', // Dark gradient effect
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
  },
  categoryPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  
  // Hero Card
  heroCard: {
    height: 220,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },

  // Grid Cards
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: GRID_ITEM_WIDTH,
    height: 180, // Square-ish proportion
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  gridTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
});