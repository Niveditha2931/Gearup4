const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register a new user (Admin/Instructor/Student)
const register = async (req, res) => {
    try {
        const { firstName,lastName, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        let newUser={...req.body,password:hashedPassword}
        const userDoc = new User(newUser);
        await userDoc.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).send({message:err.message});
    }
};

// User login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
};

app.get('/api/students', async (req, res) => {
    try {
      const students = await Student.find();
      res.json(students);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Get student details with enrollments and academic records
  app.get('/api/students/:id', async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) return res.status(404).json({ message: 'Student not found' });
      
      const enrollments = await Enrollment.find({ student: student._id });
      const academicRecords = await AcademicRecord.find({ student: student._id });
      const attendance = await Attendance.find({ student: student._id });
      
      res.json({
        student,
        enrollments,
        academicRecords,
        attendance
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Create new student
  app.post('/api/students', async (req, res) => {
    const { fullName, dateOfBirth, email, contactNumber, course, paymentAmount, batch } = req.body;
    
    // Generate student ID (e.g., STU + random 3 digits)
    const studentId = 'STU' + Math.floor(Math.random() * 900 + 100);
    
    try {
      // Create student
      const student = new Student({
        studentId,
        fullName,
        dateOfBirth,
        email,
        contactNumber,
        batch
      });
      
      const newStudent = await student.save();
      
      // Create enrollment
      if (course) {
        const enrollment = new Enrollment({
          student: newStudent._id,
          course,
          paymentAmount: paymentAmount || 0
        });
        
        await enrollment.save();
      }
      
      res.status(201).json(newStudent);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Update student
  app.put('/api/students/:id', async (req, res) => {
    try {
      const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(student);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Delete student
  app.delete('/api/students/:id', async (req, res) => {
    try {
      await Student.findByIdAndDelete(req.params.id);
      // Also delete related records
      await Enrollment.deleteMany({ student: req.params.id });
      await AcademicRecord.deleteMany({ student: req.params.id });
      await Attendance.deleteMany({ student: req.params.id });
      
      res.json({ message: 'Student deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  



module.exports={register,login}
