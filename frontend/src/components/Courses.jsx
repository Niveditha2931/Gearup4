import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Courses.css";

function Courses() {
  const navigate = useNavigate();

  // State to toggle between course list and add new course form
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);

  // Sample course data
  const courses = [
    {
      id: 1,
      title: "Full Stack Web Development",
      category: "Technology",
      description: "Comprehensive program covering front-end and back-end development.",
      duration: "6 months",
      lessons: 120,
      maxStudents: 30,
      price: "$899",
      rating: 4.8,
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 2,
      title: "Business Administration",
      category: "Business",
      description: "Master the fundamentals of business management and leadership.",
      duration: "4 months",
      lessons: 80,
      maxStudents: 25,
      price: "$699",
      rating: 4.7,
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 3,
      title: "Digital Marketing",
      category: "Marketing",
      description: "Learn SEO, social media marketing, and content strategy.",
      duration: "4 months",
      lessons: 70,
      maxStudents: 30,
      price: "$699",
      rating: 4.7,
      image: "https://via.placeholder.com/300x200",
    },
  ];

  // Navigate to course details
  const handleViewDetails = (id) => {
    navigate(`/courses/${id}`);
  };

  return (
    <div className="courses-container m-0">
      {/* Stat Cards */}
      <div className="row mb-4">
        <div className="col">
          <div className="stat-card bg-primary text-white">
            <h5>Total Courses</h5>
            <h3>42</h3>
            <p>Active Programs</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-success text-white">
            <h5>Active Students</h5>
            <h3>856</h3>
            <p>Currently Enrolled</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-info text-white">
            <h5>Course Revenue</h5>
            <h3>$125K</h3>
            <p>This Month</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-warning text-white">
            <h5>New Enrollments</h5>
            <h3>68</h3>
            <p>Last 30 Days</p>
          </div>
        </div>
      </div>

      {/* Header with navigation buttons */}
      <div className="course-header d-flex justify-content-between align-items-center mb-4">
        <h4>Available Courses</h4>
        <div className="d-flex gap-3">
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowAddCourseForm(false)}
          >
            Course List
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowAddCourseForm(true)}
          >
            Add New Course
          </button>
        </div>
      </div>

      {/* Conditional rendering */}
      {showAddCourseForm ? (
        <div className="add-course-form">
          <h5>Course Information</h5>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="courseName" className="form-label">
                  Course Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="courseName"
                  placeholder="Enter course name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="department" className="form-label">
                  Department
                </label>
                <select className="form-select" id="department">
                  <option>Select Department</option>
                  <option>Technology</option>
                  <option>Business</option>
                  <option>Marketing</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="duration" className="form-label">
                  Duration
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="duration"
                  placeholder="Enter duration"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  rows="3"
                  placeholder="Enter course description"
                ></textarea>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end gap-3">
            <button className="btn btn-secondary">Cancel</button>
            <button className="btn btn-primary">Add Course</button>
          </div>
        </div>
      ) : (
        <div>
          {/* Course Categories */}
          <div className="course-categories mb-4">
            <h5>Course Categories</h5>
            <div className="d-flex gap-3">
              <button className="btn btn-primary">All</button>
              <button className="btn btn-outline-primary">Technology</button>
              <button className="btn btn-outline-primary">Business</button>
              <button className="btn btn-outline-primary">Design</button>
              <button className="btn btn-outline-primary">Language</button>
            </div>
          </div>

          {/* Course List */}
          <div className="row">
            {courses.map((course) => (
              <div className="col-md-4 mb-4" key={course.id}>
                <div className="card course-card">
                  <img
                    src={course.image}
                    className="card-img-top"
                    alt={course.title}
                  />
                  <div className="card-body">
                    <span className={`badge bg-primary mb-2`}>
                      {course.category}
                    </span>
                    <h5 className="card-title">{course.title}</h5>
                    <p className="card-text">{course.description}</p>
                    <ul className="list-unstyled">
                      <li>
                        <i className="fas fa-clock me-2"></i>Duration:{" "}
                        {course.duration}
                      </li>
                      <li>
                        <i className="fas fa-book me-2"></i>
                        {course.lessons} lessons
                      </li>
                      <li>
                        <i className="fas fa-users me-2"></i>Max Students:{" "}
                        {course.maxStudents}
                      </li>
                    </ul>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="price">{course.price}</span>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleViewDetails(course.id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;