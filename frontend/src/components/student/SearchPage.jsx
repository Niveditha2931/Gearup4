import React, { useState } from "react";
import { Link } from "react-router-dom";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [courses, setCourses] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Replace with your API call
    fetch(`/api/courses/search?query=${query}`)
      .then(res => res.json())
      .then(data => setCourses(data.courses || []));
  };

  return (
    <div className="container my-5">
      <h2>Search Courses</h2>
      <form onSubmit={handleSearch} className="mb-4 d-flex">
        <input
          type="text"
          className="form-control me-2"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for courses"
        />
        <button className="btn btn-primary">Search</button>
      </form>
      <div>
        {courses.length === 0 ? (
          <div>No courses found.</div>
        ) : (
          <ul className="list-group">
            {courses.map(course => (
              <li className="list-group-item" key={course._id}>
                <Link to={`/course-detail/${course._id}`}>{course.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchPage;