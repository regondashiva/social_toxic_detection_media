import mongoose from 'mongoose'
import User from './models/User.js'
import Post from './models/Post.js'

const MONGODB_URI = 'mongodb+srv://regondashiva65_db_user:TtXX8YMvDzZI3MLM@cluster0.fthrw9h.mongodb.net/?appName=Cluster0';

// Additional video content
const videoPosts = [
  {
    caption: 'Morning yoga flow 🧘‍♀️ Start your day with mindfulness #yoga #wellness #morningroutine',
    video: 'https://sample-videos.com/zip-10/videos/1231/314240_720p.mp4',
    mediaType: 'video',
    duration: 180,
    thumbnail: 'https://picsum.photos/seed/yoga/400/400.jpg',
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
    video: 'https://sample-videos.com/zip-10/videos/1231/314240_720p.mp4',
    mediaType: 'video',
    duration: 300,
    thumbnail: 'https://picsum.photos/seed/cooking/400/400.jpg',
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
    caption: 'Tech review 📱 Latest smartphone unboxing #tech #review #unboxing',
    video: 'https://sample-videos.com/zip-10/videos/1231/314240_720p.mp4',
    mediaType: 'video',
    duration: 420,
    thumbnail: 'https://picsum.photos/seed/tech/400/400.jpg',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['tech', 'review', 'smartphone', 'unboxing']
  },
  {
    caption: 'Workout routine 💪 Full body training session #gym #fitness #workout',
    video: 'https://sample-videos.com/zip-10/videos/1231/314240_720p.mp4',
    mediaType: 'video',
    duration: 240,
    thumbnail: 'https://picsum.photos/seed/workout/400/400.jpg',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['gym', 'fitness', 'workout', 'training']
  },
  {
    caption: 'Travel vlog 🏝️ Exploring Tokyo streets #travel #japan #tokyo',
    video: 'https://sample-videos.com/zip-10/videos/1231/314240_720p.mp4',
    mediaType: 'video',
    duration: 360,
    thumbnail: 'https://picsum.photos/seed/tokyo/400/400.jpg',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['travel', 'japan', 'tokyo', 'vlog']
  }
];

// Additional reels content
const reelPosts = [
  {
    caption: 'Quick dance challenge 💃 Can you do this? #dance #challenge #reels',
    video: 'https://sample-videos.com/zip-10/videos/1231/314240_720p.mp4',
    mediaType: 'reel',
    duration: 15,
    thumbnail: 'https://picsum.photos/seed/dance1/400/400.jpg',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['dance', 'challenge', 'reels', 'trending']
  },
  {
    caption: 'Food hack 🍕 30-second pizza recipe #foodhack #cooking #quick',
    video: 'https://sample-videos.com/zip-10/videos/1231/314240_720p.mp4',
    mediaType: 'reel',
    duration: 30,
    thumbnail: 'https://picsum.photos/seed/pizza/400/400.jpg',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['food', 'hack', 'pizza', 'recipe']
  },
  {
    caption: 'Fashion tips 👗 Outfit change transition #fashion #style #ootd',
    video: 'https://sample-videos.com/zip-10/videos/1231/314240_720p.mp4',
    mediaType: 'reel',
    duration: 20,
    thumbnail: 'https://picsum.photos/seed/fashion/400/400.jpg',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['fashion', 'style', 'ootd', 'outfit']
  },
  {
    caption: 'Pet moments 🐕 Cute cat reactions #pets #cats #cute',
    video: 'https://sample-videos.com/zip-10/videos/1231/314240_720p.mp4',
    mediaType: 'reel',
    duration: 12,
    thumbnail: 'https://picsum.photos/seed/cats/400/400.jpg',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['pets', 'cats', 'cute', 'animals']
  },
  {
    caption: 'Gaming highlights 🎮 Epic gaming moments #gaming #esports #highlights',
    video: 'https://sample-videos.com/zip-10/videos/1231/314240_720p.mp4',
    mediaType: 'reel',
    duration: 45,
    thumbnail: 'https://picsum.photos/seed/gaming/400/400.jpg',
    likes: 0,
    likedBy: [],
    comments: [],
    toxicityScore: 0,
    toxicityFlag: false,
    flaggedBy: [],
    isVisible: true,
    tags: ['gaming', 'esports', 'highlights', 'video games']
  }
];

// Toxic comments for testing AI moderation
const toxicComments = [
  {
    text: 'You are such an idiot and stupid person',
    toxicityScore: 0.85,
    toxicityCategories: {
      toxic: 0.9,
      severe_toxic: 0.1,
      obscene: 0.2,
      threat: 0.0,
      identity_hate: 0.0,
      harassment: 0.3,
      spam: 0.0
    },
    detectedKeywords: ['idiot', 'stupid']
  },
  {
    text: 'I will find you and kill you',
    toxicityScore: 1.0,
    toxicityCategories: {
      toxic: 0.7,
      severe_toxic: 1.0,
      obscene: 0.0,
      threat: 1.0,
      identity_hate: 0.0,
      harassment: 0.8,
      spam: 0.0
    },
    detectedKeywords: ['kill', 'find you']
  },
  {
    text: 'You fucking asshole, go to hell',
    toxicityScore: 0.9,
    toxicityCategories: {
      toxic: 0.9,
      severe_toxic: 0.3,
      obscene: 0.9,
      threat: 0.2,
      identity_hate: 0.0,
      harassment: 0.6,
      spam: 0.0
    },
    detectedKeywords: ['fucking', 'asshole', 'hell']
  },
  {
    text: 'तुम बहुत बेवकूफ हो, मैं तुम्हें मार दूंगा',
    toxicityScore: 0.95,
    toxicityCategories: {
      toxic: 0.8,
      severe_toxic: 0.9,
      obscene: 0.1,
      threat: 0.8,
      identity_hate: 0.0,
      harassment: 0.4,
      spam: 0.0
    },
    detectedKeywords: ['बेवकूफ', 'मार दूंगा']
  },
  {
    text: 'Tu chutiya hai, tera khoon kar dunga',
    toxicityScore: 0.98,
    toxicityCategories: {
      toxic: 0.9,
      severe_toxic: 0.95,
      obscene: 0.8,
      threat: 0.9,
      identity_hate: 0.0,
      harassment: 0.7,
      spam: 0.0
    },
    detectedKeywords: ['chutiya', 'khoon kar dunga']
  },
  {
    text: 'Eres un racista y un terrorista',
    toxicityScore: 0.88,
    toxicityCategories: {
      toxic: 0.7,
      severe_toxic: 0.3,
      obscene: 0.0,
      threat: 0.4,
      identity_hate: 0.9,
      harassment: 0.5,
      spam: 0.0
    },
    detectedKeywords: ['racista', 'terrorista']
  },
  {
    text: 'Congratulations! You won $1,000,000 lottery! Click here to claim',
    toxicityScore: 0.6,
    toxicityCategories: {
      toxic: 0.0,
      severe_toxic: 0.0,
      obscene: 0.0,
      threat: 0.0,
      identity_hate: 0.0,
      harassment: 0.0,
      spam: 0.95
    },
    detectedKeywords: ['congratulations', 'lottery', 'click here']
  },
  {
    text: 'నీ అమ్మ నాన్న...',
    toxicityScore: 0.85,
    toxicityCategories: {
      toxic: 0.8,
      severe_toxic: 0.4,
      obscene: 0.7,
      threat: 0.0,
      identity_hate: 0.0,
      harassment: 0.5,
      spam: 0.0
    },
    detectedKeywords: ['అమ్మ', 'నాన్న']
  },
  {
    text: 'Tu es un connard stupide',
    toxicityScore: 0.75,
    toxicityCategories: {
      toxic: 0.8,
      severe_toxic: 0.0,
      obscene: 0.7,
      threat: 0.0,
      identity_hate: 0.0,
      harassment: 0.2,
      spam: 0.0
    },
    detectedKeywords: ['connard', 'stupide']
  },
  {
    text: 'BC MC teri maa ki...',
    toxicityScore: 0.95,
    toxicityCategories: {
      toxic: 0.9,
      severe_toxic: 0.5,
      obscene: 0.9,
      threat: 0.0,
      identity_hate: 0.0,
      harassment: 0.7,
      spam: 0.0
    },
    detectedKeywords: ['bc', 'mc', 'teri maa ki']
  }
];

// Positive comments for balance
const positiveComments = [
  { text: 'Amazing video! 🎯' },
  { text: 'Love this content! ❤️' },
  { text: 'Great tutorial! 👏' },
  { text: 'So helpful! 🙏' },
  { text: 'Beautiful scenery! 🌅' },
  { text: 'Perfect! 👌' },
  { text: 'Inspiring! ✨' },
  { text: 'Thanks for sharing! 🙏' },
  { text: 'यह बहुत अच्छी है! 👍' },
  { text: 'ఈ వీడియో చాలా బాగుంది! 📸' },
  { text: '¡Excelente! 😊' },
  { text: 'Très bon! 🇫🇷' }
];

async function addMoreData() {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    console.log(`📍 Your IP: 175.101.27.148/32`);
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas!');
    
    // Get existing users
    const users = await User.find({});
    console.log(`👥 Found ${users.length} existing users`);
    
    // Add video posts
    console.log('\n📹 Adding video posts...');
    for (let i = 0; i < videoPosts.length; i++) {
      const videoData = videoPosts[i];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      const post = new Post({
        ...videoData,
        author: randomUser._id
      });
      
      await post.save();
      console.log(`📹 Added video: "${videoData.caption.substring(0, 40)}..." by ${randomUser.username}`);
    }
    
    // Add reel posts
    console.log('\n🎬 Adding reel posts...');
    for (let i = 0; i < reelPosts.length; i++) {
      const reelData = reelPosts[i];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      const post = new Post({
        ...reelData,
        author: randomUser._id
      });
      
      await post.save();
      console.log(`🎬 Added reel: "${reelData.caption.substring(0, 40)}..." by ${randomUser.username}`);
    }
    
    // Get all posts to add comments
    const allPosts = await Post.find({});
    console.log(`\n💬 Adding comments to ${allPosts.length} posts...`);
    
    // Add toxic comments to some posts
    for (let i = 0; i < Math.min(toxicComments.length, allPosts.length); i++) {
      const post = allPosts[i];
      const toxicComment = toxicComments[i];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      post.comments.push({
        _id: new mongoose.Types.ObjectId(),
        author: randomUser._id,
        text: toxicComment.text,
        toxicityScore: toxicComment.toxicityScore,
        toxicityCategories: toxicComment.toxicityCategories,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });
      
      await post.save();
      console.log(`⚠️ Added toxic comment: "${toxicComment.text.substring(0, 30)}..." (Score: ${toxicComment.toxicityScore})`);
    }
    
    // Add positive comments to other posts
    for (let i = toxicComments.length; i < Math.min(toxicComments.length + positiveComments.length, allPosts.length); i++) {
      const post = allPosts[i];
      const positiveComment = positiveComments[i - toxicComments.length];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      post.comments.push({
        _id: new mongoose.Types.ObjectId(),
        author: randomUser._id,
        text: positiveComment.text,
        toxicityScore: 0.0,
        toxicityCategories: {},
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });
      
      await post.save();
      console.log(`✅ Added positive comment: "${positiveComment.text}"`);
    }
    
    // Add some likes to posts
    console.log('\n❤️ Adding likes to posts...');
    for (let i = 0; i < Math.min(20, allPosts.length); i++) {
      const post = allPosts[i];
      const numLikes = Math.floor(Math.random() * users.length) + 1;
      const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
      
      for (let j = 0; j < numLikes; j++) {
        if (!post.likedBy.includes(shuffledUsers[j]._id)) {
          post.likedBy.push(shuffledUsers[j]._id);
        }
      }
      post.likes = numLikes;
      await post.save();
    }
    
    console.log(`\n✅ Additional data added successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   📹 Video Posts: ${videoPosts.length}`);
    console.log(`   🎬 Reel Posts: ${reelPosts.length}`);
    console.log(`   💬 Toxic Comments: ${Math.min(toxicComments.length, allPosts.length)}`);
    console.log(`   😊 Positive Comments: ${Math.min(positiveComments.length, allPosts.length - toxicComments.length)}`);
    console.log(`   ❤️ Total Posts: ${allPosts.length}`);
    
    const totalComments = allPosts.reduce((sum, post) => sum + post.comments.length, 0);
    const totalLikes = allPosts.reduce((sum, post) => sum + post.likes, 0);
    console.log(`   💬 Total Comments: ${totalComments}`);
    console.log(`   ❤️ Total Likes: ${totalLikes}`);
    
    console.log(`\n🧪 AI Moderation Test Data Ready:`);
    console.log(`   ⚠️ Toxic Comments: ${toxicComments.length} examples`);
    console.log(`   🌐 Languages: English, Hindi, Telugu, Hinglish, Spanish, French`);
    console.log(`   🎯 Toxicity Scores: 0.6 to 1.0 range`);
    
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error adding data:', error);
  }
}

addMoreData();
