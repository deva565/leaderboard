const mongoose = require('mongoose');
const User = require('./models/user'); // Adjust path to your User model

async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/leaderboard', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

async function printDatabase() {
  try {
    await connectToDatabase();
    const users = await User.find();
    console.log('Current Data in the Database:');
    console.log(users);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

printDatabase();
