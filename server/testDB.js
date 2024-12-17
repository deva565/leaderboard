const mongoose = require('mongoose');

async function testPermissions() {
  try {
    // Encode the password since it contains special characters
    const password = encodeURIComponent('deva7777@');
    
    // Connect with user credentials
    await mongoose.connect(`mongodb://devadev565:${password}@localhost:27017/leaderboard`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Test write permission
    const TestModel = mongoose.model('Test', new mongoose.Schema({ test: String }));
    
    // Try to write
    const testDoc = await TestModel.create({ test: 'test' });
    console.log('Write test successful:', testDoc);

    // Try to read
    const readDoc = await TestModel.findById(testDoc._id);
    console.log('Read test successful:', readDoc);

    // Try to update
    const updatedDoc = await TestModel.findByIdAndUpdate(
      testDoc._id,
      { test: 'updated' },
      { new: true }
    );
    console.log('Update test successful:', updatedDoc);

    // Try to delete
    await TestModel.findByIdAndDelete(testDoc._id);
    console.log('Delete test successful');

    console.log('All permission tests passed successfully!');
  } catch (error) {
    console.error('Permission test failed:', error);
  } finally {
    await mongoose.connection.close();
  }
}

testPermissions();