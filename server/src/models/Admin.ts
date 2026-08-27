import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  username: string;
  passwordHash: string;
  name: string;
  bio: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: 'Story Writer' },
    bio: { type: String, default: 'A quiet place for stories, thoughts, memories, and moments worth keeping.' },
    avatarUrl: { type: String, default: '' }
  },
  { timestamps: true }
);

export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
