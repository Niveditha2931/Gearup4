const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
require('dotenv').config();
const lessonRoutes = require("./routes/lessonRoutes");
const quizRoutes = require("./routes/quizRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const reportRoutes = require('./routes/reportRoutes');
const settingsRoutes = require('./routes/settingsRoutes')
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes"); // Import student routes
const adminRoutes=require("./routes/adminRoutes") 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect Database
connectDB();


// Mock database (replace with actual database connection)
const students = [
  { id: 'STU001', name: 'John Doe', contact: '+91 98765 43210', course: 'JEE Main', batch: 'Morning', status: 'Active' },
  // ...other students...
];
const attendanceData = [
  { date: '2024-03-15', subject: 'Physics', status: 'Present', remarks: 'Good participation' },
  // ...other attendance records...
];
const testResults = [
  { date: '2024-03-10', subject: 'Mathematics', score: '85%', rank: 5, remarks: 'Good improvement' },
  // ...other test results...
];

// Attendance route
app.get('/api/attendance', (req, res) => {
  try {
    res.json(attendanceData); // Return mock attendance data
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch attendance data' });
  }
});

// Test Results route
app.get('/api/test-results', (req, res) => {
  try {
    res.json(testResults); // Return mock test results data
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch test results' });
  }
});

// Courses route
app.get('/api/courses/all', (req, res) => {
  try {
    const courses = [
      { id: 'COURSE001', name: 'JEE Main', description: 'Engineering entrance preparation' },
      { id: 'COURSE002', name: 'NEET', description: 'Medical entrance preparation' },
      // ...other courses...
    ];
    res.json(courses); // Return mock courses data
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
});

// Routes
app.use('/api/auth', authRoutes); // Use authRoutes for authentication-related routes
app.use('/api/students', studentRoutes); // Student routes
app.use('/api/admin',adminRoutes)
app.use('/api/courses', require('./routes/courseRoutes'));
app.use("/api", lessonRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/categories", categoryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);


// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use((err,req,res,next)=>{
    console.log("error Occured: ",err)
    res.send({message:err.message})
})