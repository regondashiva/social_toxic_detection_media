import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from './models/User.js'
import Post from './models/Post.js'

// MongoDB Atlas connection with your specific IP
const MONGODB_URI = 'mongodb+srv://regondashiva65_db_user:TtXX8YMvDzZI3MLM@cluster0.fthrw9h.mongodb.net/?appName=Cluster0';

// Enhanced sample data with more realistic content
const sampleUsers = [
  {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    avatar: 'https://ui-avatars.com/api/?name=testuser&background=random',
    bio: 'Love photography and travel 📸✈️',
    followers: [],
    following: [],
    posts: 0,
    verified: false
  },
  {
    username: 'demo',
    email: 'demo@example.com',
    password: 'demo123',
    avatar: 'https://ui-avatars.com/api/?name=demo&background=random',
    bio: 'Foodie and adventure seeker 🍔🏔️',
    followers: [],
    following: [],
    posts: 0,
    verified: false
  },
  {
    username: 'socialhub_admin',
    email: 'admin@socialhub.com',
    password: 'admin123',
    avatar: 'https://ui-avatars.com/api/?name=admin&background=blue',
    bio: 'Official SocialHub account 🎯',
    followers: [],
    following: [],
    posts: 0,
    verified: true
  },
  {
    username: 'photographer_pro',
    email: 'photo@example.com',
    password: 'photo123',
    avatar: 'https://ui-avatars.com/api/?name=photographer&background=purple',
    bio: 'Professional photographer 📷',
    followers: [],
    following: [],
    posts: 0,
    verified: false
  },
  {
    username: 'travel_blogger',
    email: 'travel@example.com',
    password: 'travel123',
    avatar: 'https://ui-avatars.com/api/?name=travel&background=green',
    bio: 'Traveling the world ✈️🌍',
    followers: [],
    following: [],
    posts: 0,
    verified: false
  },
  {
    username: 'foodie_life',
    email: 'foodie@example.com',
    password: 'foodie123',
    avatar: 'https://ui-avatars.com/api/?name=foodie&background=orange',
    bio: 'Food critic and recipe developer 🍳👨‍🍳',
    followers: [],
    following: [],
    posts: 0,
    verified: false
  },
  {
    username: 'fitness_guru',
    email: 'fitness@example.com',
    password: 'fitness123',
    avatar: 'https://ui-avatars.com/api/?name=fitness&background=red',
    bio: 'Personal trainer and nutritionist 💪🥗',
    followers: [],
    following: [],
    posts: 0,
    verified: false
  },
  {
    username: 'art_creative',
    email: 'art@example.com',
    password: 'art123',
    avatar: 'https://ui-avatars.com/api/?name=art&background=pink',
    bio: 'Digital artist and creative director 🎨🖌️',
    followers: [],
    following: [],
    posts: 0,
    verified: false
  }
];

const samplePosts = [
  {
    caption: 'Welcome to SocialHub! 🎉 Your first post - Building amazing social connections and sharing moments that matter',
    image: 'https://picsum.photos/seed/welcome/400/400.jpg',
    mediaType: 'image',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['welcome', 'socialhub', 'community']
  },
  {
    caption: 'Morning coffee ritual ☕ #coffeelover #morningvibes #perfectstart',
    image: 'https://picsum.photos/seed/coffee/400/400.jpg',
    mediaType: 'image',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['coffee', 'morning', 'lifestyle']
  },
  {
    caption: 'Beautiful sunset today! 🌅 Nature never disappoints #sunset #photography #nature',
    image: 'https://picsum.photos/seed/sunset/400/400.jpg',
    mediaType: 'image',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['sunset', 'nature', 'photography']
  },
  {
    caption: 'Travel vlog - Paris adventure ✈️🗼️ Eiffel Tower at night is magical! #paris #travel #eiffeltower',
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
    isVisible: true,
    tags: ['paris', 'travel', 'video']
  },
  {
    caption: 'Amazing dance moves! 💃🕺 Friday night vibes #dance #weekend #music',
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
    isVisible: true,
    tags: ['dance', 'reel', 'music']
  },
  {
    caption: 'Street photography 📸 Capturing life in the city #streetphoto #urban #photography',
    image: 'https://picsum.photos/seed/street/400/400.jpg',
    mediaType: 'image',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['street', 'photography', 'urban']
  },
  {
    caption: 'Food coma alert! 🍕🍔 Best pizza in town #foodie #pizza #delicious',
    image: 'https://picsum.photos/seed/food/400/400.jpg',
    mediaType: 'image',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['food', 'pizza', 'foodie']
  },
  {
    caption: 'Workout complete! 💪 Fitness journey continues #gym #fitness #motivation',
    image: 'https://picsum.photos/seed/gym/400/400.jpg',
    mediaType: 'image',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['fitness', 'gym', 'workout']
  },
  {
    caption: 'Beach day! 🏖️ Ocean vibes and sandy toes #beach #summer #ocean',
    image: 'https://picsum.photos/seed/beach/400/400.jpg',
    mediaType: 'image',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['beach', 'summer', 'ocean']
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
    isVisible: true,
    tags: ['hiking', 'mountains', 'adventure']
  },
  {
    caption: 'Art studio vibes 🎨 Creating something new every day #art #creative #studio',
    image: 'https://picsum.photos/seed/art/400/400.jpg',
    mediaType: 'image',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['art', 'creative', 'studio']
  },
  {
    caption: 'Healthy breakfast bowl 🥗 Starting the day right #healthy #breakfast #nutrition',
    image: 'https://picsum.photos/seed/healthy/400/400.jpg',
    mediaType: 'image',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['healthy', 'breakfast', 'nutrition']
  },
  {
    caption: 'City lights at night 🌃 Urban exploration #city #nightlights #urban',
    image: 'https://picsum.photos/seed/city/400/400.jpg',
    mediaType: 'image',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['city', 'night', 'urban']
  },
  {
    caption: 'Cooking experiment 🍳 Trying new recipes in the kitchen #cooking #recipe #chef',
    image: 'https://picsum.photos/seed/cooking/400/400.jpg',
    mediaType: 'image',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['cooking', 'recipe', 'chef']
  },
  {
    caption: 'Yoga morning flow 🧘‍♀️ Finding inner peace #yoga #meditation #wellness',
    image: 'https://picsum.photos/seed/yoga/400/400.jpg',
    mediaType: 'image',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['yoga', 'meditation', 'wellness']
  }
];

const sampleComments = [
  { text: 'Amazing shot! 📸', author: 'photographer_pro' },
  { text: 'Love this! ❤️', author: 'demo' },
  { text: 'Great content! 👏', author: 'travel_blogger' },
  { text: 'Wow! So beautiful 😍', author: 'testuser' },
  { text: 'Inspiring! ✨', author: 'socialhub_admin' },
  { text: 'Nice work! Keep it up 💪', author: 'fitness_guru' },
  { text: 'This is awesome! 🔥', author: 'foodie_life' },
  { text: 'Beautiful capture! 🌅', author: 'travel_blogger' },
  { text: 'Love the vibes! 🎵', author: 'art_creative' },
  { text: 'Perfect! 👌', author: 'demo' },
  { text: 'यह बहुत अच्छी है! 👍', author: 'testuser' },
  { text: 'ఈ ఫోటో చాలా బాగుంది! 📸', author: 'photographer_pro' },
  { text: '¡Qué bonito! 😊', author: 'travel_blogger' },
  { text: 'Très belle photo! 🇫🇷', author: 'art_creative' },
  { text: 'Fantastic! 🌟', author: 'fitness_guru' },
  { text: 'Delicious looking! 🍕', author: 'foodie_life' },
  { text: 'Motivating! 💯', author: 'socialhub_admin' },
  { text: 'Creative work! 🎨', author: 'art_creative' },
  { text: 'Stunning! 🤩', author: 'demo' },
  { text: 'Professional quality! 📷', author: 'photographer_pro' }
];

async function setupMongoDB() {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    console.log(`📍 Your IP: 175.101.27.148/32`);
    
    await mongoose.connect(MONGODB_URI);
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
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
      console.log(`👤 Created user: ${user.username} (${user.email})`);
    }
    
    // Create follow relationships
    createdUsers[0].following.push(createdUsers[1]._id, createdUsers[2]._id, createdUsers[3]._id);
    createdUsers[1].followers.push(createdUsers[0]._id);
    createdUsers[2].followers.push(createdUsers[0]._id, createdUsers[1]._id);
    createdUsers[3].followers.push(createdUsers[0]._id);
    
    await createdUsers[0].save();
    await createdUsers[1].save();
    await createdUsers[2].save();
    await createdUsers[3].save();
    
    // Insert posts with random authors and engagement
    const createdPosts = [];
    for (let i = 0; i < samplePosts.length; i++) {
      const postData = samplePosts[i];
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      
      const post = new Post({
        ...postData,
        author: randomUser._id
      });
      
      // Add random comments to posts
      const numComments = Math.floor(Math.random() * 8) + 2;
      for (let j = 0; j < numComments; j++) {
        const randomCommentUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const randomComment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
        
        post.comments.push({
          _id: new mongoose.Types.ObjectId(),
          author: randomCommentUser._id,
          text: randomComment.text,
          toxicityScore: 0,
          toxicityCategories: {},
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time in last week
        });
      }
      
      // Add random likes
      const numLikes = Math.floor(Math.random() * createdUsers.length) + 1;
      const shuffledUsers = [...createdUsers].sort(() => Math.random() - 0.5);
      for (let k = 0; k < numLikes; k++) {
        post.likedBy.push(shuffledUsers[k]._id);
      }
      post.likes = numLikes;
      
      await post.save();
      createdPosts.push(post);
      console.log(`📸 Created post: "${postData.caption.substring(0, 40)}..." by ${randomUser.username}`);
    }
    
    console.log(`\n✅ Database seeded successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   📸 Posts: ${createdPosts.length}`);
    console.log(`   💬 Total Comments: ${createdPosts.reduce((sum, post) => sum + post.comments.length, 0)}`);
    console.log(`   ❤️ Total Likes: ${createdPosts.reduce((sum, post) => sum + post.likes, 0)}`);
    
    console.log(`\n🔐 Login Credentials:`);
    console.log(`   Main User: test@example.com / password123`);
    console.log(`   Demo User: demo@example.com / demo123`);
    console.log(`   Admin: admin@socialhub.com / admin123`);
    
    // Update user stats
    console.log(`\n📈 User Statistics:`);
    for (const user of createdUsers) {
      const userPosts = await Post.find({ author: user._id });
      const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);
      const totalComments = userPosts.reduce((sum, post) => sum + post.comments.length, 0);
      
      console.log(`   👤 ${user.username}: ${userPosts.length} posts, ${totalLikes} likes, ${totalComments} comments`);
    }
    
    console.log(`\n🚀 Your MongoDB database is ready!`);
    console.log(`   Next step: Run 'node mongodb_server.js' to start the server`);
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    
    if (error.message.includes('IP not whitelisted')) {
      console.log(`\n🔧 SOLUTION:`);
      console.log(`1. Go to: https://cloud.mongodb.com/`);
      console.log(`2. Navigate to: Network Access → IP Access List`);
      console.log(`3. Add IP: 175.101.27.148/32`);
      console.log(`4. Wait 2-3 minutes for propagation`);
      console.log(`5. Run this script again`);
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the setup function
setupMongoDB();
