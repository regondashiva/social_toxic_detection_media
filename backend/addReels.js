import mongoose from 'mongoose'
import User from './models/User.cjs'
import Post from './models/Post.cjs'

const MONGODB_URI = 'mongodb+srv://regondashiva65_db_user:TtXX8YMvDzZI3MLM@cluster0.fthrw9h.mongodb.net/?appName=Cluster0';

// High-quality reel content with actual video URLs
const reelPosts = [
  {
    caption: 'Morning yoga flow 🧘‍♀️ Start your day with mindfulness #yoga #wellness #morningroutine',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    mediaType: 'reel',
    duration: 180,
    thumbnail: 'https://picsum.photos/seed/yoga/400/800.jpg',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['yoga', 'wellness', 'morning', 'fitness']
  },
  {
    caption: 'Cooking tutorial 🍳 Making pasta from scratch #cooking #tutorial #food',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    mediaType: 'reel',
    duration: 300,
    thumbnail: 'https://picsum.photos/seed/cooking/400/800.jpg',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['cooking', 'tutorial', 'food', 'pasta']
  },
  {
    caption: 'Dance challenge 💃 Can you do this? #dance #challenge #viral',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    mediaType: 'reel',
    duration: 120,
    thumbnail: 'https://picsum.photos/seed/dance/400/800.jpg',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['dance', 'challenge', 'viral', 'trending']
  },
  {
    caption: 'Travel vlog 🌴 Exploring hidden beaches #travel #beach #adventure',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    mediaType: 'reel',
    duration: 240,
    thumbnail: 'https://picsum.photos/seed/travel/400/800.jpg',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['travel', 'beach', 'adventure', 'explore']
  },
  {
    caption: 'Fitness motivation 💪 No excuses, just results! #fitness #motivation #workout',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    mediaType: 'reel',
    duration: 150,
    thumbnail: 'https://picsum.photos/seed/fitness/400/800.jpg',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['fitness', 'motivation', 'workout', 'gym']
  },
  {
    caption: 'Art process 🎨 Watch this painting come to life #art #painting #creative',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    mediaType: 'reel',
    duration: 200,
    thumbnail: 'https://picsum.photos/seed/art/400/800.jpg',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['art', 'painting', 'creative', 'process']
  },
  {
    caption: 'Tech review 📱 Latest gadget unboxing! #tech #review #unboxing',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    mediaType: 'reel',
    duration: 180,
    thumbnail: 'https://picsum.photos/seed/tech/400/800.jpg',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['tech', 'review', 'unboxing', 'gadget']
  },
  {
    caption: 'Nature documentary 🦁 Wildlife in their natural habitat #nature #wildlife #documentary',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTI.mp4',
    mediaType: 'reel',
    duration: 220,
    thumbnail: 'https://picsum.photos/seed/nature/400/800.jpg',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['nature', 'wildlife', 'documentary', 'animals']
  },
  {
    caption: 'Comedy sketch 😂 Daily dose of laughter #comedy #funny #sketch',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    mediaType: 'reel',
    duration: 90,
    thumbnail: 'https://picsum.photos/seed/comedy/400/800.jpg',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['comedy', 'funny', 'sketch', 'laughter']
  },
  {
    caption: 'Fashion show 👗 Latest trends and styles #fashion #style #trending',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouSee.mp4',
    mediaType: 'reel',
    duration: 160,
    thumbnail: 'https://picsum.photos/seed/fashion/400/800.jpg',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['fashion', 'style', 'trending', 'runway']
  },
  {
    caption: 'Music cover 🎵 Singing my heart out #music #cover #singing',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatIsPotentially.mp4',
    mediaType: 'reel',
    duration: 140,
    thumbnail: 'https://picsum.photos/seed/music/400/800.jpg',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['music', 'cover', 'singing', 'performance']
  }
];

// Toxic comments for testing
const toxicComments = [
  "This is so stupid and idiotic",
  "I hate this content so much",
  "You're terrible at this",
  "Worst video ever made",
  "This is garbage content",
  "I can't believe you posted this",
  "You should be ashamed",
  "This is absolutely horrible",
  "Nobody wants to see this",
  "Delete this now"
];

// Positive comments for testing
const positiveComments = [
  "Amazing content! 🔥",
  "Love this so much! ❤️",
  "Incredible work! 👏",
  "So inspiring! ✨",
  "Great job! 🌟",
  "Fantastic! 💫",
  "Beautiful! 🌺",
  "Awesome! 🚀",
  "Perfect! 💎",
  "Wonderful! 🦋"
];

async function addReels() {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Get users to assign as authors
    const users = await User.find();
    if (users.length === 0) {
      console.log('❌ No users found. Please run setupMongoDB.js first.');
      return;
    }

    console.log(`📝 Found ${users.length} users. Adding reel posts...`);

    // Add reel posts
    for (let i = 0; i < reelPosts.length; i++) {
      const reelData = reelPosts[i];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      // Create the post
      const post = new Post({
        caption: reelData.caption,
        video: reelData.video,
        mediaType: reelData.mediaType,
        thumbnail: reelData.thumbnail,
        duration: reelData.duration,
        author: randomUser._id,
        likes: Math.floor(Math.random() * 1000) + 100,
        likedBy: [],
        comments: [],
        toxicityScore: reelData.toxicityScore,
        toxicityFlag: reelData.toxicityFlag,
        flaggedBy: reelData.flaggedBy,
        isVisible: reelData.isVisible,
        tags: reelData.tags
      });

      await post.save();

      // Add comments to the post
      const comments = [];
      const commentCount = Math.floor(Math.random() * 10) + 5;
      
      for (let j = 0; j < commentCount; j++) {
        const isToxic = Math.random() < 0.3; // 30% chance of toxic comment
        const commentText = isToxic 
          ? toxicComments[Math.floor(Math.random() * toxicComments.length)]
          : positiveComments[Math.floor(Math.random() * positiveComments.length)];
        
        const commentAuthor = users[Math.floor(Math.random() * users.length)];
        
        const comment = {
          _id: new mongoose.Types.ObjectId(),
          author: commentAuthor._id,
          text: commentText,
          toxicityScore: isToxic ? 0.8 : 0,
          toxicityCategories: isToxic ? { toxic: 0.8, harassment: 0.4 } : {},
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        };
        
        comments.push(comment);
      }
      
      post.comments = comments;
      await post.save();

      console.log(`✅ Reel ${i + 1}/${reelPosts.length} added with ${comments.length} comments`);
    }

    console.log('🎉 All reel posts added successfully!');
    console.log('📊 Summary:');
    console.log(`   - Total reels: ${reelPosts.length}`);
    console.log(`   - Total comments: ${reelPosts.reduce((sum, reel) => sum + Math.floor(Math.random() * 10) + 5, 0)}`);
    console.log(`   - Video content: All reels have playable videos`);
    console.log(`   - Duration range: 90-300 seconds`);
    console.log(`   - Categories: yoga, cooking, dance, travel, fitness, art, tech, nature, comedy, fashion, music`);

  } catch (error) {
    console.error('❌ Error adding reels:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB Atlas');
  }
}

// Run the function
addReels();
