import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  fetch("/api/student/courses/enabled")
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => setCourses(data.slice(0, 5)))
    .catch(error => console.error("Error fetching courses:", error));
}, []);


  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };

  return (
    <div className="py-5 text-center">
      <h1 className="mb-3">Find the Best Courses for You</h1>
      <p className="mb-4">Discover, Learn, and Upskill </p>
      <form onSubmit={searchHandler} className="d-flex justify-content-center mb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search Courses"
          className="form-control w-25"
        />
        <button type="submit" className="btn btn-primary ms-2">Search</button>
      </form>
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate("/courses")}
      >
        Explore Courses
      </button>
      {/* Grid of 5 courses */}
      <div className="container">
        <div className="row justify-content-center">
          {courses.map(course => (
            <div
              className="col-md-2 mb-4"
              key={course._id}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/course-detail/${course._id}`)}
            >
              <div className="card h-100 shadow-sm">
                <img
                  src={course.image || "https://via.placeholder.com/300x180?text=No+Image"}
                  alt={course.title}
                  className="card-img-top"
                  style={{ height: "120px", objectFit: "cover" }}
                />
                <div className="card-body p-2">
                  <h6 className="card-title mb-1" style={{ fontWeight: 600 }}>{course.title}</h6>
                  <div className="text-muted" style={{ fontSize: "0.9em" }}>
                    {course.level}
                  </div>
                  <div className="fw-bold mt-1" style={{ color: "#0d47a1" }}>
                    {course.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;