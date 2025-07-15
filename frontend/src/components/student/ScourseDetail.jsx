import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BuyCourseButton from "./BuyCourseButton";

const ScourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    // Replace with your API call
    fetch(`/api/courses/${courseId}`)
      .then(res => res.json())
      .then(data => setCourse(data.course));
  }, [courseId]);

  if (!course) return <div>Loading...</div>;

  return (
    <div className="container my-5">
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <h4>Lectures</h4>
      <ul className="list-group mb-3">
        {course.lectures.map(lec => (
          <li className="list-group-item" key={lec._id}>
            {lec.lectureTitle}
          </li>
        ))}
      </ul>
      <Link to={`/course-progress/${course._id}`} className="btn btn-success">
        Start/Continue Course
      </Link>
      <BuyCourseButton/>
    </div>
  );
};

export default ScourseDetail;