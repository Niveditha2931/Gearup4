import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ScourseProgress = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [currentLecture, setCurrentLecture] = useState(null);

  useEffect(() => {
    // Replace with your API call
    fetch(`/api/courses/${courseId}`)
      .then(res => res.json())
      .then(data => {
        setCourse(data.course);
        setCurrentLecture(data.course.lectures[0]);
      });
  }, [courseId]);

  if (!course) return <div>Loading...</div>;

  return (
    <div className="container my-5">
      <h2>{course.title} - Progress</h2>
      <div className="row">
        <div className="col-md-8">
          <h4>{currentLecture?.lectureTitle}</h4>
          <div className="ratio ratio-16x9 mb-3">
            {/* Replace with your video player if needed */}
            <iframe
              src={currentLecture?.videoUrl}
              title={currentLecture?.lectureTitle}
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <div className="col-md-4">
          <h5>Lectures</h5>
          <ul className="list-group">
            {course.lectures.map(lec => (
              <li
                key={lec._id}
                className={`list-group-item ${lec._id === currentLecture?._id ? "active" : ""}`}
                onClick={() => setCurrentLecture(lec)}
                style={{ cursor: "pointer" }}
              >
                {lec.lectureTitle}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScourseProgress;