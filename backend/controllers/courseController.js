const Course = require("../models/Course");

const getCourses= async (req, res) => {
    try {
        const courses = await Course.find()
        .populate("instructor")
        .populate("sections")
        .populate("enrolledStudents");

        res.send(courses);
    } catch (error) {
        res.status(500).send({message:error.message});
    }
};

const addCourse = async (req, res) => {
    try {
        // For multipart/form-data, fields are in req.body, file in req.file
        const { title, category, description, level, status } = req.body;
        let sections = [];
        if (req.body.sections) {
            try {
                sections = JSON.parse(req.body.sections);
            } catch (e) {
                sections = [];
            }
        }

        // Save image path if file uploaded
        let image = null;
        if (req.file) {
            image = `/uploads/${req.file.filename}`;
        }

        // Default status to "Active" if not provided
        const newCourse = new Course({
            title,
            category,
            description,
            level,
            status: status || "Free",
            sections,
            image
        });

        const savedCourse = await newCourse.save();
        res.status(201).send(savedCourse);
    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).send({ message: "Failed to add course. Please check the backend logs for details." });
    }
};

const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCourse = await Course.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCourse) {
            return res.status(404).send({ message: "Course not found" });
        }
        res.status(200).send(updatedCourse); // Return the updated course
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Delete a course
const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCourse = await Course.findByIdAndDelete(id);
        if (!deletedCourse) {
            return res.status(404).send({ message: "Course not found" });
        }
        res.status(200).send({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const getStatistics = async (req, res) => {
    try {
        const totalCourses = await Course.countDocuments();
        const activeStudents = await Course.aggregate([
            { $unwind: "$enrolledStudents" },
            { $group: { _id: null, count: { $sum: 1 } } },
        ]);
        const courseRevenue = await Course.aggregate([
            { $match: { status: "Paid" } },
            { $group: { _id: null, totalRevenue: { $sum: "$price" } } },
        ]);
        const newEnrollments = await Course.aggregate([
            { $unwind: "$enrolledStudents" },
            {
                $match: {
                    "enrolledStudents.enrollmentDate": {
                        $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
                    },
                },
            },
            { $group: { _id: null, count: { $sum: 1 } } },
        ]);

        res.status(200).send({
            totalCourses,
            activeStudents: activeStudents[0]?.count || 0,
            courseRevenue: courseRevenue[0]?.totalRevenue || 0,
            newEnrollments: newEnrollments[0]?.count || 0,
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Add this function:
const addLessonToSection = async (req, res) => {
    try {
        const { courseId, sectionId } = req.params;
        const { title, type, summary, videoUrl } = req.body;
        let fileUrl = null;
        if (req.file) {
            fileUrl = `/uploads/${req.file.filename}`;
        }

        // Validate required fields
        if (!title || !type) {
            return res.status(400).json({ message: "Title and type are required for a lesson." });
        }

        // Build lesson object
        const lesson = {
            title,
            type,
            summary,
        };
        if (type === "Video" && videoUrl) {
            lesson.videoUrl = videoUrl;
        }
        if (fileUrl) {
            lesson.fileUrl = fileUrl;
        }

        // Find course and section
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        const section = course.sections.id(sectionId);
        if (!section) return res.status(404).json({ message: "Section not found" });

        // Add lesson to section
        section.lessons.push(lesson);

        // Mark modified for nested array
        course.markModified("sections");

        await course.save();

        res.status(200).json({
            message: "Lesson added successfully",
            lesson: section.lessons[section.lessons.length - 1],
            courseId,
            sectionId
        });
    } catch (error) {
        console.error("Error adding lesson:", error);
        res.status(500).json({ message: "Failed to add lesson. Please check the backend logs for details." });
    }
};

// Add Quiz to Section
const addQuizToSection = async (req, res) => {
    try {
        const { courseId, sectionId } = req.params;
        const { quizTitle, instructions, questions } = req.body;

        if (!quizTitle || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ message: "Quiz title and questions are required." });
        }

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        const section = course.sections.id(sectionId);
        if (!section) return res.status(404).json({ message: "Section not found" });

        section.quizzes.push({
            title: quizTitle,
            instructions,
            questions
        });

        course.markModified("sections");
        await course.save();

        res.status(201).json({
            message: "Quiz added successfully",
            quiz: section.quizzes[section.quizzes.length - 1],
            courseId,
            sectionId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSections = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.status(200).json({ sections: course.sections });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

// Delete a section from a course
const deleteSection = async (req, res) => {
    try {
        const { courseId, sectionId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        const section = course.sections.id(sectionId);
        if (!section) return res.status(404).json({ message: "Section not found" });

        section.remove();
        course.markModified("sections");
        await course.save();

        res.status(200).json({ message: "Section deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a lesson from a section in a course
const deleteLesson = async (req, res) => {
    try {
        const { courseId, sectionId, lessonId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        const section = course.sections.id(sectionId);
        if (!section) return res.status(404).json({ message: "Section not found" });

        const lesson = section.lessons.id(lessonId);
        if (!lesson) return res.status(404).json({ message: "Lesson not found" });

        lesson.remove();
        course.markModified("sections");
        await course.save();

        res.status(200).json({ message: "Lesson deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Enable/Disable a course
const toggleCourseEnabled = async (req, res) => {
    try {
        const { id } = req.params;
        const { enabled } = req.body;
        const course = await Course.findByIdAndUpdate(id, { enabled }, { new: true });
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.status(200).json({ message: `Course ${enabled ? "enabled" : "disabled"} successfully`, course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Enable/Disable a section
const toggleSectionEnabled = async (req, res) => {
    try {
        const { courseId, sectionId } = req.params;
        const { enabled } = req.body;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });
        const section = course.sections.id(sectionId);
        if (!section) return res.status(404).json({ message: "Section not found" });
        section.enabled = enabled;
        course.markModified("sections");
        await course.save();
        res.status(200).json({ message: `Section ${enabled ? "enabled" : "disabled"} successfully`, section });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Enable/Disable a lesson
const toggleLessonEnabled = async (req, res) => {
    try {
        const { courseId, sectionId, lessonId } = req.params;
        const { enabled } = req.body;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });
        const section = course.sections.id(sectionId);
        if (!section) return res.status(404).json({ message: "Section not found" });
        const lesson = section.lessons.id(lessonId);
        if (!lesson) return res.status(404).json({ message: "Lesson not found" });
        lesson.enabled = enabled;
        course.markModified("sections");
        await course.save();
        res.status(200).json({ message: `Lesson ${enabled ? "enabled" : "disabled"} successfully`, lesson });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Toggle enable/disable a quiz in a section
const toggleQuizEnabled = async (req, res) => {
    try {
        const { courseId, sectionId, quizId } = req.params;
        const { enabled } = req.body;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });
        const section = course.sections.id(sectionId);
        if (!section) return res.status(404).json({ message: "Section not found" });
        const quiz = section.quizzes.id(quizId);
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });
        quiz.enabled = enabled;
        course.markModified("sections");
        await course.save();
        res.status(200).json({ message: `Quiz ${enabled ? "enabled" : "disabled"} successfully`, quiz });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addCourse,
    getCourses,
    updateCourse,
    deleteCourse,
    getStatistics,
    addLessonToSection,
    addQuizToSection,
    getSections,
    deleteSection,
    deleteLesson,
    toggleCourseEnabled,
    toggleSectionEnabled,
    toggleLessonEnabled,
    toggleQuizEnabled,
};