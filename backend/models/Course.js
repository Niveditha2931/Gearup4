const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    category: {
        type: String,
        required: true,
        ref:"User"
    },
    instructor: { 
        type: String, 
        required: true,
        ref:"User"
    },
    sections: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: "Section" 
    }],
    enrolledStudents: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    }],
    status: {
        type: String, 
        enum: ["Free", "Paid"], 
        default:"Free"
    },
    actions: {
        type: [String],
        enum: ["View Course", "Edit Course", "Manage Sections", "Mark Pending", "Delete"],
    },
});

module.exports = mongoose.model("Course", CourseSchema);
