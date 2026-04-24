import express from 'express'
import User from '../models/User.js'
import Post from '../models/Post.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    // Try to get users from database
    try {
      const users = await User.find().select('-password')
      res.json(users)
    } catch (dbError) {
      // Return mock users if database is not available
      const mockUsers = [
        {
          _id: '507f1f77bcf86cd799439012',
          username: 'demo_user',
          email: 'demo@socialhub.com',
          avatar: '',
          bio: 'Demo user for testing',
          followers: [],
          following: ['507f1f77bcf86cd799439014'],
          reputationScore: 100,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          verified: true,
          postsCount: 5,
          followersCount: 234,
          followingCount: 156,
          isOnline: true,
          lastSeen: new Date(),
          location: 'San Francisco, CA',
          website: 'socialhub.com/demo',
          birthday: new Date('1990-01-01'),
          gender: 'other',
          interests: ['technology', 'social media', 'AI', 'photography']
        },
        {
          _id: '507f1f77bcf86cd799439014',
          username: 'alice_demo',
          email: 'alice@socialhub.com',
          avatar: '',
          bio: 'Love exploring new platforms! 🚀',
          followers: ['507f1f77bcf86cd799439012'],
          following: [],
          reputationScore: 250,
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          verified: true,
          postsCount: 12,
          followersCount: 567,
          followingCount: 89,
          isOnline: true,
          lastSeen: new Date(Date.now() - 5 * 60 * 1000),
          location: 'New York, NY',
          website: 'alice.design',
          birthday: new Date('1992-05-15'),
          gender: 'female',
          interests: ['design', 'UX', 'art', 'travel']
        },
        {
          _id: '507f1f77bcf86cd799439016',
          username: 'bob_demo',
          email: 'bob@socialhub.com',
          avatar: '',
          bio: 'Tech enthusiast and coffee lover ☕',
          followers: ['507f1f77bcf86cd799439012'],
          following: ['507f1f77bcf86cd799439014'],
          reputationScore: 180,
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          verified: false,
          postsCount: 8,
          followersCount: 123,
          followingCount: 45,
          isOnline: false,
          lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
          location: 'Austin, TX',
          website: 'bobtech.blog',
          birthday: new Date('1988-03-22'),
          gender: 'male',
          interests: ['coding', 'coffee', 'gadgets', 'startups']
        },
        {
          _id: '507f1f77bcf86cd799439018',
          username: 'jane_demo',
          email: 'jane@socialhub.com',
          avatar: '',
          bio: 'Nature photographer 📸',
          followers: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439016'],
          following: [],
          reputationScore: 320,
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          verified: true,
          postsCount: 25,
          followersCount: 892,
          followingCount: 67,
          isOnline: false,
          lastSeen: new Date(Date.now() - 30 * 60 * 1000),
          location: 'Seattle, WA',
          website: 'janephotography.com',
          birthday: new Date('1995-08-10'),
          gender: 'female',
          interests: ['photography', 'nature', 'travel', 'wildlife']
        },
        {
          _id: '507f1f77bcf86cd799439021',
          username: 'tech_demo',
          email: 'tech@socialhub.com',
          avatar: '',
          bio: 'Full-stack developer | AI enthusiast',
          followers: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439014'],
          following: ['507f1f77bcf86cd799439018'],
          reputationScore: 450,
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          verified: true,
          postsCount: 18,
          followersCount: 1234,
          followingCount: 234,
          isOnline: true,
          lastSeen: new Date(Date.now() - 10 * 60 * 1000),
          location: 'San Jose, CA',
          website: 'techdev.io',
          birthday: new Date('1991-12-03'),
          gender: 'male',
          interests: ['AI', 'machine learning', 'blockchain', 'web3']
        },
        {
          _id: '507f1f77bcf86cd799439022',
          username: 'sarah_demo',
          email: 'sarah@socialhub.com',
          avatar: '',
          bio: 'Digital artist and creative mind 🎨',
          followers: [],
          following: ['507f1f77bcf86cd799439012'],
          reputationScore: 280,
          createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          verified: false,
          postsCount: 15,
          followersCount: 456,
          followingCount: 78,
          isOnline: true,
          lastSeen: new Date(Date.now() - 15 * 60 * 1000),
          location: 'Los Angeles, CA',
          website: 'sarahart.com',
          birthday: new Date('1993-07-20'),
          gender: 'female',
          interests: ['art', 'design', 'creativity', 'digital']
        },
        {
          _id: '507f1f77bcf86cd799439023',
          username: 'mike_demo',
          email: 'mike@socialhub.com',
          avatar: '',
          bio: 'Fitness coach and nutrition expert 💪',
          followers: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439018'],
          following: [],
          reputationScore: 195,
          createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
          verified: false,
          postsCount: 22,
          followersCount: 789,
          followingCount: 34,
          isOnline: false,
          lastSeen: new Date(Date.now() - 1 * 60 * 60 * 1000),
          location: 'Miami, FL',
          website: 'mikefitness.com',
          birthday: new Date('1987-11-15'),
          gender: 'male',
          interests: ['fitness', 'health', 'nutrition', 'motivation']
        },
        {
          _id: '507f1f77bcf86cd799439024',
          username: 'emma_demo',
          email: 'emma@socialhub.com',
          avatar: '',
          bio: 'Travel blogger exploring the world 🌍',
          followers: [],
          following: ['507f1f77bcf86cd799439014', '507f1f77bcf86cd799439021'],
          reputationScore: 310,
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          verified: true,
          postsCount: 35,
          followersCount: 1567,
          followingCount: 123,
          isOnline: true,
          lastSeen: new Date(Date.now() - 20 * 60 * 1000),
          location: 'Chicago, IL',
          website: 'emmatravels.com',
          birthday: new Date('1994-03-08'),
          gender: 'female',
          interests: ['travel', 'photography', 'culture', 'adventure']
        },
        {
          _id: '507f1f77bcf86cd799439025',
          username: 'john_demo',
          email: 'john@socialhub.com',
          avatar: '',
          bio: 'Software engineer and tech blogger 💻',
          followers: [],
          following: ['507f1f77bcf86cd799439016', '507f1f77bcf86cd799439021'],
          reputationScore: 265,
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          verified: false,
          postsCount: 18,
          followersCount: 234,
          followingCount: 67,
          isOnline: false,
          lastSeen: new Date(Date.now() - 3 * 60 * 60 * 1000),
          location: 'Boston, MA',
          website: 'johncode.com',
          birthday: new Date('1989-09-12'),
          gender: 'male',
          interests: ['coding', 'technology', 'software', 'innovation']
        },
        {
          _id: '507f1f77bcf86cd799439026',
          username: 'lisa_demo',
          email: 'lisa@socialhub.com',
          avatar: '',
          bio: 'Foodie and lifestyle influencer 🍕',
          followers: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439022'],
          following: [],
          reputationScore: 225,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          verified: false,
          postsCount: 28,
          followersCount: 890,
          followingCount: 45,
          isOnline: true,
          lastSeen: new Date(Date.now() - 25 * 60 * 1000),
          location: 'Portland, OR',
          website: 'lisaeats.com',
          birthday: new Date('1991-06-18'),
          gender: 'female',
          interests: ['food', 'lifestyle', 'cooking', 'restaurants']
        },
        {
          _id: '507f1f77bcf86cd799439027',
          username: 'david_demo',
          email: 'david@socialhub.com',
          avatar: '',
          bio: 'Music producer and DJ 🎵',
          followers: [],
          following: ['507f1f77bcf86cd799439018', '507f1f77bcf86cd799439024'],
          reputationScore: 340,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          verified: true,
          postsCount: 20,
          followersCount: 445,
          followingCount: 89,
          isOnline: false,
          lastSeen: new Date(Date.now() - 45 * 60 * 1000),
          location: 'Nashville, TN',
          website: 'davidmusic.com',
          birthday: new Date('1986-04-25'),
          gender: 'male',
          interests: ['music', 'production', 'DJ', 'entertainment']
        },
        {
          _id: '507f1f77bcf86cd799439028',
          username: 'anna_demo',
          email: 'anna@socialhub.com',
          avatar: '',
          bio: 'Yoga instructor and wellness coach 🧘',
          followers: [],
          following: ['507f1f77bcf86cd799439022', '507f1f77bcf86cd799439025'],
          following: [],
          reputationScore: 290,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          verified: false,
          postsCount: 16,
          followersCount: 678,
          followingCount: 34,
          isOnline: true,
          lastSeen: new Date(Date.now() - 5 * 60 * 1000),
          location: 'Denver, CO',
          website: 'annayoga.com',
          birthday: new Date('1992-10-30'),
          gender: 'female',
          interests: ['yoga', 'wellness', 'fitness', 'meditation']
        },
        {
          _id: '507f1f77bcf86cd799439029',
          username: 'chris_demo',
          email: 'chris@socialhub.com',
          avatar: '',
          bio: 'Entrepreneur and startup founder 🚀',
          followers: [],
          following: ['507f1f77bcf86cd799439021', '507f1f77bcf86cd799439023'],
          following: [],
          reputationScore: 410,
          createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
          verified: true,
          postsCount: 12,
          followersCount: 1890,
          followingCount: 156,
          isOnline: false,
          lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
          location: 'Austin, TX',
          website: 'chrisstartup.com',
          birthday: new Date('1988-08-14'),
          gender: 'male',
          interests: ['entrepreneurship', 'startups', 'business', 'innovation']
        },
        {
          _id: '507f1f77bcf86cd799439030',
          username: 'maria_demo',
          email: 'maria@socialhub.com',
          avatar: '',
          bio: 'Fashion designer and stylist 👗',
          followers: [],
          following: ['507f1f77bcf86cd799439024', '507f1f77bcf86cd799439027'],
          following: [],
          reputationScore: 275,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          verified: false,
          postsCount: 30,
          followersCount: 567,
          followingCount: 89,
          isOnline: true,
          lastSeen: new Date(Date.now() - 30 * 60 * 1000),
          location: 'New York, NY',
          website: 'mariafashion.com',
          birthday: new Date('1993-12-05'),
          gender: 'female',
          interests: ['fashion', 'design', 'style', 'creativity']
        }
      ]
      
      res.json(mockUsers)
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' })
  }
})

router.get('/:userId', async (req, res) => {
  try {
    // Try to get user from database
    try {
      const user = await User.findById(req.params.userId).select('-password')
      const posts = await Post.find({ author: req.params.userId })

      res.json({
        ...user.toObject(),
        posts
      })
    } catch (dbError) {
      // Return mock user profile if database is not available
      const mockUsers = {
        '507f1f77bcf86cd799439012': {
          _id: '507f1f77bcf86cd799439012',
          username: 'demo_user',
          email: 'demo@socialhub.com',
          avatar: '',
          bio: 'Demo user for testing',
          followers: [],
          following: ['507f1f77bcf86cd799439014'],
          reputationScore: 100,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          posts: [
            {
              _id: '507f1f77bcf86cd799439011',
              caption: 'Welcome to SocialHub! 🎉 This is a demo post to showcase the platform.',
              image: 'https://picsum.photos/seed/social1/600/400.jpg',
              likes: 42,
              comments: [],
              createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
            }
          ]
        },
        '507f1f77bcf86cd799439014': {
          _id: '507f1f77bcf86cd799439014',
          username: 'alice_demo',
          email: 'alice@socialhub.com',
          avatar: '',
          bio: 'Love exploring new platforms! 🚀',
          followers: ['507f1f77bcf86cd799439012'],
          following: [],
          reputationScore: 250,
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          posts: []
        },
        '507f1f77bcf86cd799439016': {
          _id: '507f1f77bcf86cd799439016',
          username: 'bob_demo',
          email: 'bob@socialhub.com',
          avatar: '',
          bio: 'Tech enthusiast and coffee lover ☕',
          followers: ['507f1f77bcf86cd799439012'],
          following: ['507f1f77bcf86cd799439014'],
          reputationScore: 180,
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          posts: []
        }
      }

      const userProfile = mockUsers[req.params.userId]
      if (userProfile) {
        res.json(userProfile)
      } else {
        res.status(404).json({ message: 'User not found' })
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile' })
  }
})

router.post('/:userId/follow', authMiddleware, async (req, res) => {
  try {
    // Try to follow user in database
    try {
      const user = await User.findById(req.params.userId)
      const currentUser = await User.findById(req.userId)

      if (!user.followers.includes(req.userId)) {
        user.followers.push(req.userId)
        currentUser.following.push(req.params.userId)
        await user.save()
        await currentUser.save()
      }

      res.json({ message: 'Followed successfully' })
    } catch (dbError) {
      // Return mock follow response if database is not available
      res.json({ message: 'Followed successfully (mock)' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to follow user' })
  }
})

router.post('/:userId/unfollow', authMiddleware, async (req, res) => {
  try {
    // Try to unfollow user in database
    try {
      const user = await User.findById(req.params.userId)
      const currentUser = await User.findById(req.userId)

      user.followers = user.followers.filter(id => !id.equals(req.userId))
      currentUser.following = currentUser.following.filter(id => !id.equals(req.params.userId))
      
      await user.save()
      await currentUser.save()

      res.json({ message: 'Unfollowed successfully' })
    } catch (dbError) {
      // Return mock unfollow response if database is not available
      res.json({ message: 'Unfollowed successfully (mock)' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to unfollow user' })
  }
})

export default router
