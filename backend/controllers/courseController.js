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
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(201).send({ message: "Course created successfully" });
    } catch (error) {
        res.status(500).send({ message:error.message });
    }
};

const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCourse = await Course.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCourse) {
            return res.status(404).send({ message: "Course not found" });
        }
        res.status(200).send({ message: "Course updated successfully", course: updatedCourse });
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
module.exports={addCourse,getCourses,updateCourse,deleteCourse}