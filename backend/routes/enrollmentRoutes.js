const express = require("express");
const { getEnrollments, enrollStudent } = require("../controllers/enrollmentController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, isAdmin, getEnrollments); // Admin can view enrollments
router.post("/", verifyToken, enrollStudent); // Any user can enroll in a course

module.exports = router;
