const userSchema = new mongoose.Schema({
  name: String,
  rollNo: String,
  department: String,
  leetcodeUsername: String,
  gfgUsername: String,
  points: {
    college: Number,
    leetcode: Number,
    gfg: Number,
    total: Number,
  },
});

const User = mongoose.model('User', userSchema);
