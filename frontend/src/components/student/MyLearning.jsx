import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MyLearning = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Get userId from localStorage (set at login)
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;
    fetch(`/api/students/${user._id}/my-courses`)
      .then(res => res.json())
      .then(data => setCourses(data || []));
  }, []);

  return (
    <div className="container my-5">
      <h2 className="mb-4">My Learning</h2>
      {courses.length === 0 ? (
        <div>No courses found.</div>
      ) : (
        <div className="row">
          {courses.map(course => (
            <div className="col-md-4 mb-4" key={course._id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">{course.description}</p>
                  <Link to={`/course-progress/${course._id}`} className="btn btn-primary">
                    Continue Learning
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLearning;