// --- USER TYPES ---

export interface UserStats {
  posts: number | string;
  followers: number | string;
  following: number | string;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string; // e.g., "@tolu_tech"
  avatarUrl: string;
  bio: string;
  location: string;
  isVerified: boolean;
  whatsappNumber?: string; // Crucial for the direct-message routing
  stats: UserStats;
}

// --- CONTENT TYPES ---

export type ContentType = 'reel' | 'deal' | 'social';

// The base interface that all posts share
export interface BasePost {
  id: string;
  creatorId: string; // Links back to UserProfile.id
  type: ContentType;
  createdAt: string; // ISO date string
  locationTag?: string;
}

// 1. Social Reel (Video Content)
export interface SocialReel extends BasePost {
  type: 'reel';
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  views: string | number;
  likes: string | number;
  comments: string | number;
  audioTrack?: string;
}

// 2. Commerce Deal (Marketplace Content)
export interface CommerceDeal extends BasePost {
  type: 'deal';
  imageUrl: string;
  title: string;
  description: string;
  price: string; // e.g., "₦28,000"
  isNegotiable: boolean;
  whatsappEnabled: boolean;
  status: 'available' | 'sold';
}

// A Union Type representing anything that can show up in a feed/grid
export type FeedItem = SocialReel | CommerceDeal;