const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/leaderboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  leetcodeUsername: { type: String, default: null },
  gfgUsername: { type: String, default: null },
  points: {
    leetcode: { type: Number, default: 0 },
    gfg: { type: Number, default: 0 },
    college: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
}, { timestamps: true });

// Platform schema (used to store platform-specific scores separately if needed)
const platformSchema = new mongoose.Schema({
  rollNo: { type: String, required: true },
  username: { type: String, required: true },
  points: { type: Number, default: 0 },
}, { timestamps: true });

// Models
const User = mongoose.model('User', userSchema);
const LeetCode = mongoose.model('LeetCode', platformSchema);
const GFG = mongoose.model('GFG', platformSchema);
const College = mongoose.model('College', platformSchema);

// Export models
module.exports = { User, LeetCode, GFG, College };
