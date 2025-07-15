import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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
      <p className="mb-4">Discover, Learn, and Upskill with our wide range of courses</p>
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
        className="btn btn-outline-secondary"
        onClick={() => navigate("/courses")}
      >
        Explore Courses
      </button>
    </div>
  );
};

export default HeroSection;