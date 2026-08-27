export type LanguageType = 'en' | 'hi' | 'mixed';
export type StatusType = 'DRAFT' | 'PUBLIC' | 'PRIVATE';

export type FontType = 
  | 'inter' 
  | 'georgia' 
  | 'merriweather' 
  | 'lora' 
  | 'playfair' 
  | 'noto-sans-devanagari' 
  | 'noto-serif-devanagari' 
  | 'mukta' 
  | 'hind';

export interface Story {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  images: string[];
  language: LanguageType;
  fontFamily: FontType;
  category: string;
  tags: string[];
  status: StatusType;
  readingTime: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
}

export interface DashboardStats {
  total: number;
  published: number;
  drafts: number;
  private: number;
}
