const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://regondashiva65_db_user:TtXX8YMvDzZI3MLM@cluster0.fthrw9h.mongodb.net/?appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB Atlas');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  console.log('🔄 Falling back to in-memory mode');
  require('./simple_server.js');
  return;
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:52590'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Import models
const User = require('./models/User.cjs');
const Post = require('./models/Post.cjs');

// Helper functions
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this', { expiresIn: '7d' });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Routes
// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      avatar: `https://ui-avatars.com/api/?name=${username}&background=random`
    });
    
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Post routes
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });
    
    const formattedPosts = posts.map(post => ({
      id: post._id,
      caption: post.caption,
      image: post.image,
      video: post.video,
      mediaType: post.mediaType,
      thumbnail: post.thumbnail,
      duration: post.duration,
      likes: post.likes,
      likedBy: post.likedBy,
      comments: post.comments,
      author: post.author,
      createdAt: post.createdAt
    }));
    
    res.json(formattedPosts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/posts', authenticateToken, async (req, res) => {
  try {
    const { caption, image, video, mediaType, thumbnail, duration } = req.body;
    
    const post = new Post({
      caption,
      image,
      video,
      mediaType: mediaType || 'image',
      thumbnail,
      duration,
      author: req.userId,
      likes: 0,
      likedBy: [],
      comments: []
    });
    
    await post.save();
    
    const populatedPost = await Post.findById(post._id).populate('author', 'username avatar');
    
    res.status(201).json({
      id: populatedPost._id,
      caption: populatedPost.caption,
      image: populatedPost.image,
      video: populatedPost.video,
      mediaType: populatedPost.mediaType,
      thumbnail: populatedPost.thumbnail,
      duration: populatedPost.duration,
      likes: populatedPost.likes,
      likedBy: populatedPost.likedBy,
      comments: populatedPost.comments,
      author: populatedPost.author,
      createdAt: populatedPost.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Like/Unlike posts
app.post('/api/posts/:id/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const userId = req.userId;
    const index = post.likedBy.indexOf(userId);
    
    if (index === -1) {
      post.likedBy.push(userId);
      post.likes += 1;
    } else {
      post.likedBy.splice(index, 1);
      post.likes -= 1;
    }
    
    await post.save();
    res.json({ likes: post.likes, liked: index === -1 });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Comment routes
app.post('/api/posts/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Call ML service for toxicity detection
    let toxicityData = {
      toxicityScore: 0,
      toxicityCategories: {},
      detectedKeywords: []
    };
    
    try {
      const mlResponse = await fetch('http://localhost:8000/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text, language: 'auto' })
      });
      
      if (mlResponse.ok) {
        const mlResult = await mlResponse.json();
        toxicityData = {
          toxicityScore: mlResult.toxicity_score,
          toxicityCategories: mlResult.categories,
          detectedKeywords: mlResult.detected_keywords || []
        };
        
        // Block highly toxic comments (score > 0.75)
        if (toxicityData.toxicityScore > 0.75) {
          return res.status(400).json({ 
            error: 'Comment blocked due to toxic content',
            toxicityScore: toxicityData.toxicityScore,
            toxicityCategories: toxicityData.toxicityCategories,
            detectedKeywords: toxicityData.detectedKeywords
          });
        }
      }
    } catch (error) {
      console.log('ML service error:', error.message);
      // Continue with default values if ML service fails
    }
    
    const comment = {
      _id: new mongoose.Types.ObjectId(),
      author: req.userId,
      text,
      ...toxicityData,
      createdAt: new Date()
    };
    
    post.comments.push(comment);
    await post.save();
    
    const populatedComment = await Post.findById(req.params.id)
      .populate('comments.author', 'username avatar')
      .select('comments');
    
    const newComment = populatedComment.comments[populatedComment.comments.length - 1];
    
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get comments for a post
app.get('/api/posts/:id/comments', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const populatedPost = await Post.findById(req.params.id)
      .populate('comments.author', 'username avatar')
      .select('comments');
    
    res.json(populatedPost.comments);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update comment
app.put('/api/posts/:postId/comments/:commentId', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Find the comment to update
    const commentIndex = post.comments.findIndex(c => c._id.toString() === req.params.commentId);
    if (commentIndex === -1) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Call ML service for toxicity detection of updated text
    let toxicityData = {
      toxicityScore: 0,
      toxicityCategories: {},
      detectedKeywords: []
    };
    
    try {
      const mlResponse = await fetch('http://localhost:8000/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text, language: 'auto' })
      });
      
      if (mlResponse.ok) {
        const mlResult = await mlResponse.json();
        toxicityData = {
          toxicityScore: mlResult.toxicity_score,
          toxicityCategories: mlResult.categories,
          detectedKeywords: mlResult.detected_keywords || []
        };
      }
    } catch (error) {
      console.log('ML service error:', error.message);
    }
    
    // Update the comment
    post.comments[commentIndex] = {
      ...post.comments[commentIndex],
      text,
      ...toxicityData,
      updatedAt: new Date()
    };
    
    await post.save();
    
    res.json({ message: 'Comment updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete comment
app.delete('/api/posts/:postId/comments/:commentId', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Remove the comment
    post.comments = post.comments.filter(c => c._id.toString() !== req.params.commentId);
    await post.save();
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Backend is running (MongoDB mode)',
    timestamp: new Date().toISOString(),
    database: 'MongoDB Atlas'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MongoDB Server running on port ${PORT}`);
  console.log(`📊 Database: MongoDB Atlas`);
  console.log(`🌐 Frontend URL: http://localhost:5173`);
});
