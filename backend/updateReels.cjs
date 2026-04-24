const mongoose = require('mongoose');
const Post = require('./models/Post');

// MongoDB connection
mongoose.connect('mongodb+srv://socialhub:socialhub123@socialhub.0x4kz.mongodb.net/socialhub?retryWrites=true&w=majority')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const reelVideos = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTI.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouSee.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatIsPotentially.mp4'
];

const updateReels = async () => {
  try {
    console.log('🔄 Updating posts to be reels...');
    
    // Get first 11 posts
    const posts = await Post.find().limit(11);
    console.log(`📝 Found ${posts.length} posts to update`);
    
    // Update each post to be a reel
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      
      // Update post to be a reel
      post.mediaType = 'reel';
      post.video = reelVideos[i];
      post.thumbnail = `https://picsum.photos/seed/reel${i + 1}/400/800.jpg`;
      post.duration = 180 + (i * 30);
      
      await post.save();
      console.log(`✅ Updated post ${post._id} to be a reel with video: ${reelVideos[i]}`);
    }
    
    console.log('🎉 All reel posts updated successfully!');
    
    // Verify the updates
    const reelPosts = await Post.find({ mediaType: 'reel' });
    console.log(`📊 Now have ${reelPosts.length} reel posts in database`);
    
    reelPosts.forEach((post, index) => {
      console.log(`🎬 Reel ${index + 1}: ${post.caption.substring(0, 30)}... | Video: ${post.video ? '✅' : '❌'}`);
    });
    
  } catch (error) {
    console.error('❌ Error updating reels:', error);
  } finally {
    mongoose.connection.close();
  }
};

updateReels();
