
export interface Comment {
  id: string;
  handle: string;
  text: string;
  timestamp: string;
  avatarColor: string;
}

export interface Character {
  id: string;
  name: string;
  nameKr: string;
  handle: string;
  avatar: string;
  bio: string;
  systemPrompt: string;
  isVerified?: boolean;
  followers?: string;
  following?: string;
}

export interface Post {
  id: string;
  characterId: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  createdAt: number; // Added for sorting
  mockComments?: Comment[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  isAi: boolean;
}

export interface Story {
  id: string;
  characterId: string;
  imageUrl: string;
  viewed: boolean;
}

export type ViewState = 'home' | 'search' | 'chat' | 'profile';
