import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import User from './models/User.js'
import Post from './models/Post.js'

dotenv.config()

// Sample data for MongoDB
const sampleUsers = [
  {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    avatar: 'https://ui-avatars.com/api/?name=testuser&background=random',
    bio: 'Love photography and travel 📸✈️',
    followers: [],
    following: []
  },
  {
    username: 'demo',
    email: 'demo@example.com',
    password: 'demo123',
    avatar: 'https://ui-avatars.com/api/?name=demo&background=random',
    bio: 'Foodie and adventure seeker 🍔🏔️',
    followers: [],
    following: []
  },
  {
    username: 'socialhub_admin',
    email: 'admin@socialhub.com',
    password: 'admin123',
    avatar: 'https://ui-avatars.com/api/?name=admin&background=blue',
    bio: 'Official SocialHub account 🎯',
    followers: [],
    following: []
  },
  {
    username: 'photographer_pro',
    email: 'photo@example.com',
    password: 'photo123',
    avatar: 'https://ui-avatars.com/api/?name=photographer&background=purple',
    bio: 'Professional photographer 📷',
    followers: [],
    following: []
  },
  {
    username: 'travel_blogger',
    email: 'travel@example.com',
    password: 'travel123',
    avatar: 'https://ui-avatars.com/api/?name=travel&background=green',
    bio: 'Traveling the world ✈️🌍',
    followers: [],
    following: []
  }
];

const samplePosts = [
  {
    caption: 'Welcome to SocialHub! 🎉 Your first post - Building amazing social connections',
    image: 'https://picsum.photos/seed/welcome/400/400.jpg',
    mediaType: 'image',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true
  },
  {
    caption: 'Coffee time ☕ #morning #coffeelover #perfectstart',
    image: 'https://picsum.photos/seed/coffee/400/400.jpg',
    mediaType: 'image',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true
  },
  {
    caption: 'Beautiful sunset today! 🌅 Nature never disappoints #sunset #photography',
    image: 'https://picsum.photos/seed/sunset/400/400.jpg',
    mediaType: 'image',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true
  },
  {
    caption: 'Travel vlog - Paris adventure ✈️🗼️ Eiffel Tower at night is magical! #paris #travel',
    video: 'https://sample-videos.com/zip-10/videos/1231/314240_720p.mp4',
    mediaType: 'video',
    duration: 120,
    thumbnail: 'https://picsum.photos/seed/paris/400/400.jpg',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true
  },
  {
    caption: 'Amazing dance moves! 💃🕺 Friday night vibes #dance #weekend',
    video: 'https://sample-videos.com/zip-10/videos/1231/314240_720p.mp4',
    mediaType: 'reel',
    duration: 30,
    thumbnail: 'https://picsum.photos/seed/dance/400/400.jpg',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true
  },
  {
    caption: 'Street photography 📸 Capturing life in the city #streetphoto #urban',
    image: 'https://picsum.photos/seed/street/400/400.jpg',
    mediaType: 'image',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true
  },
  {
    caption: 'Food coma alert! 🍕🍔 Best pizza in town #foodie #pizza',
    image: 'https://picsum.photos/seed/food/400/400.jpg',
    mediaType: 'image',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true
  },
  {
    caption: 'Workout complete! 💪 Fitness journey continues #gym #fitness',
    image: 'https://picsum.photos/seed/gym/400/400.jpg',
    mediaType: 'image',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true
  },
  {
    caption: 'Beach day! 🏖️ Ocean vibes and sandy toes #beach #summer',
    image: 'https://picsum.photos/seed/beach/400/400.jpg',
    mediaType: 'image',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true
  },
  {
    caption: 'Mountain hiking 🏔️ Reached the summit! #hiking #mountains #adventure',
    image: 'https://picsum.photos/seed/mountain/400/400.jpg',
    mediaType: 'image',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true
  }
];

const sampleComments = [
  { text: 'Amazing shot! 📸', author: 'photographer_pro' },
  { text: 'Love this! ❤️', author: 'demo' },
  { text: 'Great content! 👏', author: 'travel_blogger' },
  { text: 'Wow! So beautiful 😍', author: 'testuser' },
  { text: 'Inspiring! ✨', author: 'socialhub_admin' },
  { text: 'Nice work! Keep it up 💪', author: 'photographer_pro' },
  { text: 'This is awesome! 🔥', author: 'demo' },
  { text: 'Beautiful capture! 🌅', author: 'travel_blogger' },
  { text: 'Love the vibes! 🎵', author: 'testuser' },
  { text: 'Perfect! 👌', author: 'socialhub_admin' },
  { text: 'यह बहुत अच्छी है! 👍', author: 'demo' },
  { text: 'ఈ ఫోటో చాలా బాగుంది! 📸', author: 'testuser' },
  { text: '¡Qué bonito! 😊', author: 'travel_blogger' },
  { text: 'Très belle photo! 🇫🇷', author: 'photographer_pro' }
];

async function seedMongoDB() {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected to MongoDB Atlas');
    
    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('🗑️ Cleared existing data');
    
    // Insert users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`👤 Created user: ${user.username}`);
    }
    
    // Create some follow relationships
    createdUsers[0].following.push(createdUsers[1]._id, createdUsers[2]._id);
    createdUsers[1].followers.push(createdUsers[0]._id);
    createdUsers[2].followers.push(createdUsers[0]._id);
    await createdUsers[0].save();
    await createdUsers[1].save();
    await createdUsers[2].save();
    
    // Insert posts with random authors
    const createdPosts = [];
    for (let i = 0; i < samplePosts.length; i++) {
      const postData = samplePosts[i];
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      
      const post = new Post({
        ...postData,
        author: randomUser._id
      });
      
      // Add random comments to posts
      const numComments = Math.floor(Math.random() * 5);
      for (let j = 0; j < numComments; j++) {
        const randomCommentUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const randomComment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
        
        post.comments.push({
          _id: new mongoose.Types.ObjectId(),
          author: randomCommentUser._id,
          text: randomComment.text,
          toxicityScore: 0,
          toxicityCategories: {},
          createdAt: new Date()
        });
      }
      
      // Add random likes
      const numLikes = Math.floor(Math.random() * createdUsers.length);
      const shuffledUsers = [...createdUsers].sort(() => Math.random() - 0.5);
      for (let k = 0; k < numLikes; k++) {
        post.likedBy.push(shuffledUsers[k]._id);
      }
      post.likes = numLikes;
      
      await post.save();
      createdPosts.push(post);
      console.log(`📸 Created post: ${postData.caption.substring(0, 30)}...`);
    }
    
    console.log(`\n✅ Database seeded successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   📸 Posts: ${createdPosts.length}`);
    console.log(`   💬 Total Comments: ${createdPosts.reduce((sum, post) => sum + post.comments.length, 0)}`);
    console.log(`   ❤️ Total Likes: ${createdPosts.reduce((sum, post) => sum + post.likes, 0)}`);
    
    // Update user stats
    for (const user of createdUsers) {
      const userPosts = await Post.find({ author: user._id });
      const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);
      const totalComments = userPosts.reduce((sum, post) => sum + post.comments.length, 0);
      
      console.log(`👤 ${user.username}: ${userPosts.length} posts, ${totalLikes} likes, ${totalComments} comments`);
    }
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seed function
seedMongoDB();
