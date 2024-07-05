import mongoose from 'mongoose';
import { type } from 'os';

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true, // є обов'язоквим
    },
    email: {
      type: String,
      required: true,
      unique: true, // має бути унікальна пошта
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', UserSchema);
