const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ["Video", "Text", "PDF", "Document", "Image"], required: true },
    summary: { type: String },
});

const QuizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    instructions: { type: String },
});

const SectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    lessons: [LessonSchema],
    quizzes: [QuizSchema],
});

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true },
    sections: [SectionSchema],
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["Free", "Paid"], default: "Free" },
    image: { type: String },
});

module.exports = mongoose.model("Course", CourseSchema);
