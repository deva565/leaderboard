const { User } = require('./database');
const ExcelJS = require('exceljs');
const path = require('path');

async function addUsersFromExcel() {
  try {
    // Create a new workbook and read the Excel file from the uploads folder
    const workbook = new ExcelJS.Workbook();
    const filePath = path.join(__dirname, 'uploads', 'user.xlsx'); // Adjusted path to the uploads folder
    await workbook.xlsx.readFile(filePath);

    // Access the first sheet
    const worksheet = workbook.getWorksheet(1);

    // Loop through each row in the sheet (starting from row 2 to skip headers)
    for (let row = 2; row <= worksheet.rowCount; row++) {
      const userData = worksheet.getRow(row).values;
      
      // Assuming columns in Excel: Name, Roll No, Department, Leetcode Username, GFG Username, College Points
      const [_, name, rollNo, department, leetcodeUsername, gfgUsername, collegePoints] = userData;

      // Create a new user from Excel data
      const newUser = new User({
        name,
        rollNo,
        department,
        leetcodeUsername,
        gfgUsername,
        points: {
          college: collegePoints || 0, // Use 0 if no points are provided
        },
      });

      // Save the user to the database
      await newUser.save();
      console.log(`User ${name} added successfully!`);
    }

  } catch (error) {
    console.error('Error adding users:', error.message);
  }
}

addUsersFromExcel();
