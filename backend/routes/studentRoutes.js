const express = require("express");
const Student = require("../models/Student");
const Enrollment = require("../models/Enrollment");
const AcademicRecord = require("../models/AcademicRecord");
const Attendance = require("../models/Attendance");

const router = express.Router();

// Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get student details with enrollments and academic records
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const enrollments = await Enrollment.find({ student: student._id });
    const academicRecords = await AcademicRecord.find({ student: student._id });
    const attendance = await Attendance.find({ student: student._id });

    res.json({
      student,
      enrollments,
      academicRecords,
      attendance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new student
router.post("/", async (req, res) => {
  const {
    fullName,
    dateOfBirth,
    email,
    contactNumber,
    course,
    paymentAmount,
    batch,
  } = req.body;

  // Generate student ID (e.g., STU + random 3 digits)
  const studentId = "STU" + Math.floor(Math.random() * 900 + 100);

  try {
    // Create student
    const student = new Student({
      studentId,
      fullName,
      dateOfBirth,
      email,
      contactNumber,
      batch,
    });

    const newStudent = await student.save();

    // Create enrollment
    if (course) {
      const enrollment = new Enrollment({
        student: newStudent._id,
        course,
        paymentAmount: paymentAmount || 0,
      });

      await enrollment.save();
    }

    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update student
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete student
router.delete("/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    // Also delete related records
    await Enrollment.deleteMany({ student: req.params.id });
    await AcademicRecord.deleteMany({ student: req.params.id });
    await Attendance.deleteMany({ student: req.params.id });

    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
