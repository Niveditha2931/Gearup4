import React, { useState } from "react";

const Profile = () => {
  const [name, setName] = useState("Student Name");
  const [email, setEmail] = useState("student@example.com");

  const handleSave = (e) => {
    e.preventDefault();
    // Save logic here
    alert("Profile updated!");
  };

  return (
    <div className="container my-5">
      <h2>Profile</h2>
      <form onSubmit={handleSave}>
        <div className="mb-3">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            readOnly
          />
        </div>
        <button className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  );
};

export default Profile;