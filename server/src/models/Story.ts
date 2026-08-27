import mongoose, { Schema, Document } from 'mongoose';

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

export interface IStory extends Document {
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
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StorySchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    featuredImage: { type: String, default: '' },
    images: [{ type: String }],
    language: { 
      type: String, 
      enum: ['en', 'hi', 'mixed'], 
      default: 'en' 
    },
    fontFamily: { 
      type: String, 
      enum: [
        'inter', 
        'georgia', 
        'merriweather', 
        'lora', 
        'playfair', 
        'noto-sans-devanagari', 
        'noto-serif-devanagari', 
        'mukta', 
        'hind'
      ], 
      default: 'georgia' 
    },
    category: { type: String, default: 'General', trim: true },
    tags: [{ type: String, trim: true }],
    status: { 
      type: String, 
      enum: ['DRAFT', 'PUBLIC', 'PRIVATE'], 
      default: 'DRAFT',
      index: true
    },
    readingTime: { type: Number, default: 1 },
    publishedAt: { type: Date }
  },
  { timestamps: true }
);

export const Story = mongoose.model<IStory>('Story', StorySchema);
