import React, { useState } from "react";
import DataTable from "react-data-table-component";
import "./Reports.css";

function Reports() {
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [startDate, setStartDate] = useState(""); // Start date for filtering
  const [endDate, setEndDate] = useState(""); // End date for filtering

  // Sample course data
  const courses = [
    {
      id: 1,
      name: "Data Science",
      department: "AI & ML",
      students: 90,
      completionRate: "78%",
      rating: 4.5,
      revenue: "$9,500",
      status: "Active",
      enrollmentDate: "2025-04-01", // Date of enrollment
    },
    {
      id: 2,
      name: "Web Development",
      department: "IT",
      students: 120,
      completionRate: "85%",
      rating: 4.7,
      revenue: "$12,000",
      status: "Active",
      enrollmentDate: "2025-03-15", // Date of enrollment
    },
  ];

  // Define columns for the DataTable
  const columns = [
    {
      name: "Course Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.department,
      sortable: true,
    },
    {
      name: "Students",
      selector: (row) => row.students,
      sortable: true,
    },
    {
      name: "Revenue",
      selector: (row) => row.revenue,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Enrollment Date",
      selector: (row) => row.enrollmentDate,
      sortable: true,
    },
  ];

  // Filter courses based on the search term and date range
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate =
      (!startDate || new Date(course.enrollmentDate) >= new Date(startDate)) &&
      (!endDate || new Date(course.enrollmentDate) <= new Date(endDate));
    return matchesSearch && matchesDate;
  });

  return (
    <div className="reports-container">
      {/* Admin Revenue Section */}
      <div className="admin-revenue-section mb-4">
        <h5 className="mb-3">Admin Revenue</h5>
        <div className="d-flex align-items-center gap-3 mb-3">
          <input
            type="date"
            className="form-control"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="form-control"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
          >
            Clear Dates
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by course name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Data Table */}
      <DataTable
        title="Course Details"
        columns={columns}
        data={filteredCourses} // Use filtered courses
        pagination
        highlightOnHover
        selectableRows
        fixedHeader
        fixedHeaderScrollHeight="400px"
      />
    </div>
  );
}

export default Reports;