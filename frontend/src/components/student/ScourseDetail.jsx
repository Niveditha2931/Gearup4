import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ScourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const loadCourseData = async () => {
      setLoading(true);
      
      // Fetch course details
      await fetchCourseDetails();
      
      // Check enrollment status
      await checkEnrollmentStatus();
      
      setLoading(false);
    };

    loadCourseData();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      if (res.ok) {
        const data = await res.json();
        setCourse(data);
      } else {
        console.error("Failed to fetch course details");
      }
    } catch (err) {
      console.error("Error fetching course details:", err);
    }
  };

  const checkEnrollmentStatus = async () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || !user._id) {
      setIsEnrolled(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/enrollments/is-enrolled?student=${user._id}&course=${courseId}`
      );
      
      if (res.ok) {
        const data = await res.json();
        setIsEnrolled(data.isEnrolled || false);
      } else {
        setIsEnrolled(false);
      }
    } catch (err) {
      console.error("Error checking enrollment:", err);
      setIsEnrolled(false);
    }
  };

  const handleEnrollment = async () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const token = user?.token;

    if (!user || !token) {
      alert("Please log in to enroll in this course.");
      return;
    }

    if (isEnrolled) {
      // Already enrolled, just redirect to progress page
      navigate(`/course-progress/${courseId}`);
      return;
    }

    // Show confirmation dialog for enrollment
    const confirmEnroll = window.confirm("Do you want to enroll in this course?");
    if (!confirmEnroll) {
      return;
    }

    setEnrolling(true);

    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          student: user._id, 
          course: courseId 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Successful enrollment
        setIsEnrolled(true);
        alert("Successfully enrolled in the course!");
        navigate(`/course-progress/${courseId}`);
      } else if (res.status === 400 && 
                 (data?.error?.includes("already enrolled") || 
                  data?.message?.includes("already enrolled"))) {
        // Already enrolled (backend detected it)
        setIsEnrolled(true);
        alert("You are already enrolled in this course!");
        navigate(`/course-progress/${courseId}`);
      } else {
        // Other errors
        alert(data.error || data.message || "Failed to enroll in the course.");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      alert("Something went wrong during enrollment. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  const handleViewCourse = () => {
    navigate(`/course-progress/${courseId}`);
  };

  if (loading || !course) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading course details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row">
        {/* Left: Course details */}
        <div className="col-md-8">
          <img
            src={course.image || "https://via.placeholder.com/600x300?text=No+Image"}
            alt={course.title}
            className="img-fluid rounded mb-3"
            style={{ maxHeight: "300px", objectFit: "cover", width: "100%" }}
          />
          <h2>{course.title}</h2>
          <div className="mb-2 text-muted">
            Level: <b>{course.level}</b> | Status: <b>{course.status}</b>
          </div>
          <p>{course.description}</p>

          <h5 className="mt-4">Course Content</h5>
          <div className="accordion" id="courseAccordion">
            {course.sections && course.sections.length > 0 ? (
              course.sections.map((section, idx) => (
                <div className="accordion-item" key={section._id || idx}>
                  <h2 className="accordion-header" id={`heading${idx}`}>
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${idx}`}
                      aria-expanded="false"
                      aria-controls={`collapse${idx}`}
                    >
                      {section.title}{" "}
                      <span className="ms-2 text-muted" style={{ fontSize: "0.9em" }}>
                        ({section.lessons?.length || 0} lessons)
                      </span>
                    </button>
                  </h2>
                  <div
                    id={`collapse${idx}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`heading${idx}`}
                    data-bs-parent="#courseAccordion"
                  >
                    <div className="accordion-body">
                      <ul className="list-group list-group-flush">
                        {section.lessons && section.lessons.length > 0 ? (
                          section.lessons.map((lesson, lessonIdx) => (
                            <li 
                              className="list-group-item d-flex justify-content-between align-items-center" 
                              key={lesson._id || lessonIdx}
                            >
                              <span>{lesson.title}</span>
                              <small className="text-muted">
                                {lesson.duration || "Duration not specified"}
                              </small>
                            </li>
                          ))
                        ) : (
                          <li className="list-group-item text-muted">
                            No lessons in this section yet.
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="alert alert-info">
                No course content available yet. Content will be added soon!
              </div>
            )}
          </div>
        </div>

        {/* Right: Enroll/View Course */}
        <div className="col-md-4">
          <div className="card p-4 shadow-sm sticky-top" style={{ top: "80px" }}>
            <h3 className="fw-bold mb-3" style={{ color: "#7c3aed" }}>
              {course.status === "Paid" ? `₹${course.price || "Price not set"}` : "Free"}
            </h3>

            <div className="mb-4">
              {isEnrolled ? (
                <button
                  className="btn btn-success w-100 py-2"
                  onClick={handleViewCourse}
                  disabled={enrolling}
                >
                  <i className="fas fa-play-circle me-2"></i>
                  View Course
                </button>
              ) : (
                <button
                  className="btn btn-primary w-100 py-2"
                  onClick={handleEnrollment}
                  disabled={enrolling}
                >
                  {enrolling ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-graduation-cap me-2"></i>
                      Enroll in Course
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="course-stats">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Total Lectures:</span>
                <span className="fw-bold">
                  {course.sections?.reduce((acc, sec) => acc + (sec.lessons?.length || 0), 0) || 0}
                </span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Sections:</span>
                <span className="fw-bold">{course.sections?.length || 0}</span>
              </div>

              
            </div>

            {isEnrolled && (
              <div className="alert alert-success mt-3 text-center" role="alert">
                <i className="fas fa-check-circle me-2"></i>
                You are enrolled in this course!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScourseDetail;