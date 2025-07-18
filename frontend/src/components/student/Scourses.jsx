import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Scourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetch("/api/courses/all")
      .then(res => res.json())
      .then(data => {
        setCourses(data); // data is an array of courses
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, []);

  if (isError) return <h1>Some error occurred while fetching courses.</h1>;

  return (
    <div className="bg-light">
      <div className="container p-6">
        <h2 className="font-bold text-3xl text-center mb-10">Our Courses</h2>
        <div className="row">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div className="col-md-3 mb-4" key={index}>
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="placeholder-glow">
                        <span className="placeholder col-12 mb-2"></span>
                        <span className="placeholder col-8"></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : courses.map(course => (
                <div className="col-md-3 mb-4" key={course._id}>
                  <Link to={`/course-detail/${course._id}`} className="text-decoration-none text-dark">
                    <div className="card h-100">
                      <img
                        src={course.image || "https://via.placeholder.com/300x180?text=No+Image"}
                        alt={course.title}
                        className="card-img-top"
                        style={{ height: "180px", objectFit: "cover" }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{course.title}</h5>
                        <p className="card-text">{course.description}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="badge bg-primary">{course.level}</span>
                          <span className="fw-bold">{course.status}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Scourses;