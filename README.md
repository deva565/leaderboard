# 📊 Leaderboard Project

**Description**  
This is a leaderboard application that manages, updates, and displays user scores. Built with a clean front-end interface and a server-side backend for data management, the project is organized to be scalable and efficient.

---

## 🚀 Features
- **Dynamic Leaderboard**: Updates and displays scores in real time.
- **Data Management**: Server-side scripts handle data storage, updates, and retrieval.
- **Easy Customization**: Modular structure for adding new features.
- **Interactive UI**: Clean front-end with HTML, CSS, and JavaScript.
- **JSON Dataset**: Structured data stored for performance and flexibility.

---

## 📂 Project Structure

```plaintext
📁 client/               # Frontend application (future expansion)
📁 node_modules/         # Node.js dependencies
📁 public/               # Public-facing static files
│   ├── index.html       # Main HTML page
│   ├── script.js        # Frontend JavaScript logic
│   └── style.css        # Stylesheet
📁 server/               # Backend server logic
│   ├── models/          # Models (data structure definitions)
│   ├── uploads/         # File uploads or data inputs
│   ├── database.js      # Database connection and handling
│   ├── dataset.json     # JSON file to store leaderboard data
│   ├── printDatabase.js # Script to display database content
│   ├── server.js        # Main server entry point
│   ├── testDB.js        # Database testing utilities
│   ├── updateData.js    # Script to update leaderboard data
│   └── updatePoints.js  # Script to update points dynamically
├── package.json         # Node.js project configuration
└── package-lock.json    # Lock file for dependencies
```
---
## 🛠️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** JSON file-based storage (dataset.json)
- **Version Control:** Git and GitHub
---
## 📥 Installation Instructions
Follow these steps to get the project up and running on your local machine.
**Clone the Repository**
```
git clone https://github.com/yourusername/leaderboard.git
cd leaderboard
```
**Install Dependencies**
```
npm install
```
**Run the Server**
```
node server/server.js
```
**Open the Project**

Open your browser and visit http://localhost:3000 (default port).

---
## 🌟 Usage
**View the Leaderboard:**

Open index.html in your browser to see the current leaderboard.

**Update Data:**

Use the updatePoints.js or updateData.js scripts to update scores.

The dataset.json file holds the current leaderboard data.

**Print the Database:**

Run printDatabase.js to display the leaderboard data in the terminal:
```
node server/printDatabase.js
```
---
## 🧪 Testing
You can test the database connectivity and updates using testDB.js.

Run the following command:
```
node server/testDB.js
```
---
## 🤝 Contributing
**Contributions are welcome! To contribute:** 

**1.** Fork the repository.

**2.** Create a new branch:

```
git checkout -b feature/your-feature-name
```
**3.** Commit your changes:
```
git commit -m "Add new feature XYZ"
```
**4.** Push to the branch:
```
git push origin feature/your-feature-name
```
**5.** Submit a Pull Request.

---

## 📧 Contact


**GitHub:** https://github.com/deva565

**Email:** devaannamalai56@gmail.com
