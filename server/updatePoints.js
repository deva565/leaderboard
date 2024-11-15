const mongoose = require('mongoose');
const { User } = require('./database');
const axios = require('axios');
const cheerio = require('cheerio');

async function fetchLeetCodePoints(username) {
  try {
    const url = `https://leetcode.com/${username}/`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Get the counts of solved problems for each difficulty
    const stats = $('div.profile__container .panel-body ul li span');
    
    const easySolved = parseInt($(stats[0]).text().trim(), 10) || 0;
    const mediumSolved = parseInt($(stats[1]).text().trim(), 10) || 0;
    const hardSolved = parseInt($(stats[2]).text().trim(), 10) || 0;

    // Calculate total points
    const totalPoints = (easySolved * 1) + (mediumSolved * 3) + (hardSolved * 5);

    return {
      total: totalPoints
    };
  } catch (error) {
    console.error(`Failed to fetch LeetCode points for ${username}:`, error);
    return {total: 0 };
  }
}

// Example usage
async function fetchGFGPoints(username) {
  try {
    const url = `https://www.geeksforgeeks.org/user/${username}/`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const points = $('.scoreCard_head_left--score__oSi_x').first().text().trim();
    return parseInt(points, 10) || 0;
  } catch (error) {
    console.error(`Failed to fetch GFG points for ${username}:`, error);
    return 0;
  }
}

async function updatePoints() {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('Waiting for database connection...');
      await new Promise(resolve => mongoose.connection.once('connected', resolve));
    }
    console.log('Database connection confirmed');

    const users = await User.find();
    console.log(`Found ${users.length} users to update`);

    const bulkOperations = users.map(async user => {
      let gfgPoints = 0;
      let solvedProblems=0;
      // if (user.gfgUsername) {
      //   console.log(`Fetching points for ${user.gfgUsername}`);
      //   gfgPoints = await fetchGFGPoints(user.gfgUsername);
      //   console.log(`Fetched points for ${user.gfgUsername}: ${gfgPoints}`);
      // }
      if (user.leetcodeUsername){
        console.log(`Fetching points for ${user.leetcodeUsername}`);
        solvedProblems = await fetchLeetCodePoints(user.leetcodeUsername);
        console.log(`Fetched points for ${user.leetcodeUsername}: ${solvedProblems}`);
      }

      const totalPoints = 0 + gfgPoints + 0;

      return {
        updateOne: {
          filter: { _id: user._id },
          update: {
            $set: {
              'points.college': 0,
              // 'points.leetcode' : solvedProblems,
              'points.gfg': gfgPoints,
              'points.total': totalPoints,
            },
          },
        },
      };
    });
    const resolvedOperations = await Promise.all(bulkOperations);
    const bulkWriteResult = await User.bulkWrite(resolvedOperations);

    console.log('Bulk update result:', bulkWriteResult);

    const finalUsers = await User.find();
    console.log('Final point totals:', finalUsers.map(u => ({
      name: u.name,
      points: u.points,
    })));
  } catch (err) {
    console.error('Error updating points:', err);
    throw err;
  }
}

console.log('Starting points update...');
updatePoints()
  .then(() => {
    console.log('Update completed successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Fatal error in updatePoints:', err);
    process.exit(1);
  });
