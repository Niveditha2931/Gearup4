import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BuyCourseButton = () => {
  const [loading, setLoading] = useState(false);
  const { courseId } = useParams();
  const navigate = useNavigate();

  const handleBuy = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (!user) {
        alert("Please login first!");
        setLoading(false);
        return;
      }
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If you use JWT, add Authorization header here
        },
        body: JSON.stringify({ student: user._id, course: courseId }),
      });
      if (res.ok) {
        alert("Course enrolled successfully!");
        navigate("/my-learning");
      } else {
        const data = await res.json();
        alert(data.error || "Enrollment failed. Please try again.");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <button className="btn btn-success" onClick={handleBuy} disabled={loading}>
      {loading ? "Processing..." : "Enroll / Buy Course"}
    </button>
  );
};

export default BuyCourseButton;