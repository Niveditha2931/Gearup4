import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyLearning = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;
    fetch(`/api/student/${user._id}/my-courses`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch enrolled courses");
        return res.json();
      })
      .then(data => {
        // If backend returns only course IDs, fetch course details for each
        if (Array.isArray(data) && typeof data[0] === "string") {
          Promise.all(
            data.map(id =>
              fetch(`/api/courses/${id}`).then(res => res.json())
            )
          ).then(fullCourses => setCourses(fullCourses));
        } else {
          setCourses(data || []);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container my-5">
      <h2 className="mb-4">My Learning</h2>
      {courses.length === 0 ? (
        <div className="text-muted">No courses found.</div>
      ) : (
        <div className="row">
          {courses.map(course => (
            <div
              className="col-md-3 mb-4"
              key={course._id}
              onClick={() => navigate(`/course-detail/${course._id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="card h-100 shadow-sm text-center">
                <img
                  src={course.image || "https://via.placeholder.com/300x180?text=No+Image"}
                  alt={course.title}
                  className="card-img-top"
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
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