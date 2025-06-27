const express = require('express');
const multer = require('multer');
const path = require('path');
const { 
  addCourse, 
  getCourses, 
  getStatistics, 
  updateCourse,
  deleteCourse, 
  addLessonToSection,
  getSections,
  deleteSection,
  deleteLesson,
  toggleCourseEnabled,
  toggleSectionEnabled,
  toggleLessonEnabled,
  addQuizToSection,
  toggleQuizEnabled
} = require('../controllers/courseController');

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/add', upload.single('image'), addCourse);
router.get('/all', getCourses);
router.get('/statistics', getStatistics);
router.put('/update/:id', updateCourse);
router.delete('/delete/:id', deleteCourse);

// Enable/Disable course
router.patch('/toggle-enabled/:id', toggleCourseEnabled);

// Enable/Disable section
router.patch('/toggle-section-enabled/:courseId/:sectionId', toggleSectionEnabled);

// Enable/Disable lesson
router.patch('/toggle-lesson-enabled/:courseId/:sectionId/:lessonId', toggleLessonEnabled);

// Enable/Disable quiz in section
router.patch('/toggle-quiz-enabled/:courseId/:sectionId/:quizId', toggleQuizEnabled);

// Delete section from course
router.delete('/delete-section/:courseId/:sectionId', deleteSection);

// Delete lesson from section in course
router.delete('/delete-lesson/:courseId/:sectionId/:lessonId', deleteLesson);

router.put(
  '/add-lesson/:courseId/:sectionId',
  upload.single('file'),
  addLessonToSection
);
router.get('/sections/:id', getSections);

// Add Quiz to Section
router.post(
  '/add-quiz/:courseId/:sectionId',
  addQuizToSection
);

// To update a section or quiz/lesson inside a section, you should use the updateCourse endpoint with the updated nested structure.
// Example: router.put('/update/:id', updateCourse);

// Update a lesson in a section
router.put('/update-lesson/:courseId/:sectionId/:lessonId', async (req, res) => {
  const { courseId, sectionId, lessonId } = req.params;
  const update = req.body;
  try {
    const course = await require('../models/Course').findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    const section = course.sections.id(sectionId);
    if (!section) return res.status(404).json({ message: "Section not found" });
    const lesson = section.lessons.id(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    Object.assign(lesson, update);
    course.markModified("sections");
    await course.save();
    res.status(200).json({ message: "Lesson updated", lesson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a quiz in a section
router.put('/update-quiz/:courseId/:sectionId/:quizId', async (req, res) => {
  const { courseId, sectionId, quizId } = req.params;
  const update = req.body;
  try {
    const course = await require('../models/Course').findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    const section = course.sections.id(sectionId);
    if (!section) return res.status(404).json({ message: "Section not found" });
    const quiz = section.quizzes.id(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    Object.assign(quiz, update);
    course.markModified("sections");
    await course.save();
    res.status(200).json({ message: "Quiz updated", quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
