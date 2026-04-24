import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caption: String,
  image: String,
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    _id: mongoose.Schema.Types.ObjectId,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    toxicityScore: Number,
    toxicityCategories: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now }
  }],
  toxicityScore: {
    type: Number,
    default: 0
  },
  toxicityFlag: Boolean,
  flaggedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isVisible: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Post', postSchema)
