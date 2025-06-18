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
        const { title, category, description, level } = req.body;
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

        const newCourse = new Course({
            title,
            category,
            description,
            level,
            sections,
            image // Save image path in the document
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
        const { title, type, summary } = req.body;
        let fileUrl = null;
        if (req.file) {
            fileUrl = `/uploads/${req.file.filename}`;
        }

        // Build lesson object
        const lesson = {
            title,
            type,
            summary,
        };
        if (fileUrl) {
            lesson.fileUrl = fileUrl;
        }

        // Find course and section, then push lesson
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        const section = course.sections.id(sectionId);
        if (!section) return res.status(404).json({ message: "Section not found" });

        section.lessons.push(lesson);
        await course.save();

        res.status(200).json(course);
    } catch (error) {
        console.error("Error adding lesson:", error);
        res.status(500).json({ message: "Failed to add lesson. Please check the backend logs for details." });
    }
};

module.exports = {
    addCourse,
    getCourses,
    updateCourse,
    deleteCourse,
    getStatistics,
    addLessonToSection // <-- add this export
};