import mongoose from 'mongoose';
import  CommentSchema  from './Comment.js';

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // є обов'язоквим
    },
    text: {
      type: String,
      required: true,
     
    },
    tags: {
      type: Array,
      default:[],
    },
    comments:[CommentSchema],
    commentsCount:{
      type:Number,
      default:0,
    },
    viewsCount: {
        type:Number,
        default:0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    imageUrl: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Post', PostSchema);
