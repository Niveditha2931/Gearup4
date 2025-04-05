import React from "react";

function Navbar() {
  return (
    <nav className="top-navbar">
      <div className="nav-container">
        <div className="nav-brand">Admin Dashboard</div>
        <div className="nav-search">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search..." aria-label="Search" />
        </div>
        <div className="nav-links">
          <a href="#messages-section" className="nav-link message-notification">
            <i className="fas fa-envelope"></i>
            <span className="notification-badge">3</span>
          </a>
          <div className="nav-profile">
            <img
              src="IMG/Profile-DWMY1YUr.png"
              alt="Profile"
              className="profile-img"
            />
            <span className="profile-name">Admin User</span>
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;