const express = require('express');
const mongoose = require('mongoose');
const { User, LeetCode, GFG, College } = require('./database');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/leaderboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err));

// Main Leaderboard Route (Paginated)
app.get('/main-leaderboard', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;

  try {
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await User.find()
      .sort({ 'points.total': -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ users, totalPages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Platform Leaderboard (Top 3)
app.get('/platform-leaderboard/:platform', async (req, res) => {
  const { platform } = req.params;
  const platforms = { leetcode: LeetCode, gfg: GFG, clg: College };

  if (!platforms[platform]) {
    return res.status(400).json({ error: 'Invalid platform' });
  }

  try {
    const leaderboard = await platforms[platform].find().sort({ points: -1 }).limit(3);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Details with Platform Points
app.get('/user/:rollNo', async (req, res) => {
  try {
    const rollNo = req.params.rollNo;
    const user = await User.findOne({ rollNo });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const leetPoints = await LeetCode.findOne({ rollNo }) || {};
    const gfgPoints = await GFG.findOne({ rollNo }) || {};
    const clgPoints = await College.findOne({ rollNo }) || {};

    res.json({
      user,
      leetPoints: leetPoints.points || 0,
      gfgPoints: gfgPoints.points || 0,
      clgPoints: clgPoints.points || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add User Data
app.post('/add-entry', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send('Entry added');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Import Users via Excel
const upload = multer({ dest: 'uploads/' });

app.post('/import-users', upload.single('file'), async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    for (const row of data) {
      const user = new User({
        rollNo: row.RollNo,
        name: row.Name,
        department: row.Department,
        points: {
          leetcode: row.LeetCode || 0,
          gfg: row.GFG || 0,
          college: row.College || 0,
          total: (row.LeetCode || 0) + (row.GFG || 0) + (row.College || 0),
        },
      });
      await user.save();
    }

    res.send('User data imported successfully');
  } catch (err) {
    res.status(500).send('Error importing user data');
  } finally {
    fs.unlinkSync(req.file.path); // Remove uploaded file
  }
});

// Export Users to Excel
app.get('/export-users', async (req, res) => {
  try {
    const users = await User.find();
    const userData = users.map(user => ({
      RollNo: user.rollNo,
      Name: user.name,
      Department: user.department,
      LeetCode: user.points.leetcode,
      GFG: user.points.gfg,
      College: user.points.college,
      Total: user.points.total,
    }));

    const worksheet = xlsx.utils.json_to_sheet(userData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Users');

    const filePath = path.join(__dirname, 'exports', `users_${Date.now()}.xlsx`);
    xlsx.writeFile(workbook, filePath);

    res.download(filePath, (err) => {
      if (err) {
        res.status(500).send('Error downloading file');
      }
      fs.unlinkSync(filePath); // Remove exported file after download
    });
  } catch (err) {
    res.status(500).send('Error exporting user data');
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
