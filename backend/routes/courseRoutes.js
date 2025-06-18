const express = require('express');
const multer = require('multer');
const path = require('path');
const { addCourse, getCourses, getStatistics, updateCourse, deleteCourse, addLessonToSection } = require('../controllers/courseController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Use multer middleware for /add
router.post('/add', upload.single('image'), addCourse);
router.get('/all', getCourses);
router.get('/statistics', getStatistics);
router.put('/update/:id', updateCourse);
router.delete('/delete/:id', deleteCourse);
router.put(
  '/add-lesson/:courseId/:sectionId',
  upload.single('file'),
  addLessonToSection
);

module.exports = router;
