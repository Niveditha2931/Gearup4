const express = require('express');
const { addCourse, getCourses } = require('../controllers/courseController');

const router = express.Router();

router.post('/add', addCourse);
router.get('/all', getCourses);
router.put("/update/:id", updateCourse);
router.delete("/delete/:id", deleteCourse);

module.exports = router;
