  import React, { useState } from 'react';
  import './Students.css'

  const StudentList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    
    // Sample student data
    const students = [
      { id: 'STU001', name: 'John Doe', contact: '+91 98765 43210', course: 'JEE Main', batch: 'Morning', status: 'Active' },
      { id: 'STU002', name: 'Jane Smith', contact: '+91 87654 32109', course: 'Physics', batch: 'Evening', status: 'Active' },
      { id: 'STU003', name: 'Robert Johnson', contact: '+91 76543 21098', course: 'Mathematics', batch: 'Morning', status: 'Inactive' },
      { id: 'STU004', name: 'Emily Davis', contact: '+91 65432 10987', course: 'Chemistry', batch: 'Afternoon', status: 'Active' },
      { id: 'STU005', name: 'Michael Brown', contact: '+91 54321 09876', course: 'Biology', batch: 'Evening', status: 'Active' },
    ];

    // Filter students based on search term
    const filteredStudents = students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredStudents.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(filteredStudents.length / entriesPerPage);

    const handleNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };

    const handlePrevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };

    return (
      <div className="container-fluid p-0 m-0">
        <div className="row mb-5 mt-4">
          <div className="col">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="icon-container bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                    <i className="bi bi-people-fill text-primary"></i>
                  </div>
                  <div>
                    <h6 className="mb-0">Total Students</h6>
                    <h4 className="mb-0">1,234</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="icon-container bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                    <i className="bi bi-person-check-fill text-primary"></i>
                  </div>
                  <div>
                    <h6 className="mb-0">Active Students</h6>
                    <h4 className="mb-0">1,180</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="icon-container bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                    <i className="bi bi-person-plus-fill text-primary"></i>
                  </div>
                  <div>
                    <h6 className="mb-0">New This Month</h6>
                    <h4 className="mb-0">48</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="icon-container bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                    <i className="bi bi-currency-dollar text-primary"></i>
                  </div>
                  <div>
                    <h6 className="mb-0">Pending Fees</h6>
                    <h4 className="mb-0">25</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <ul className="nav nav-tabs mb-3">
              <li className="nav-item">
                <a className="nav-link active" href="#basic-info">
                  <i className="bi bi-person me-2"></i>
                  Basic Information
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#academic-details">
                  <i className="bi bi-mortarboard me-2"></i>
                  Academic Details
                </a>
              </li>
            </ul>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="entries">
                Show 
                <select 
                  className="form-select form-select-sm d-inline-block mx-2" 
                  style={{ width: '70px' }}
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                entries
              </div>
              <div className="search">
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search"></i>
                  </span>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Student ID <i className="bi bi-arrow-down-up"></i></th>
                    <th>Name <i className="bi bi-arrow-down-up"></i></th>
                    <th>Contact <i className="bi bi-arrow-down-up"></i></th>
                    <th>Course <i className="bi bi-arrow-down-up"></i></th>
                    <th>Batch <i className="bi bi-arrow-down-up"></i></th>
                    <th>Status <i className="bi bi-arrow-down-up"></i></th>
                    <th>Actions <i className="bi bi-arrow-down-up"></i></th>
                  </tr>
                </thead>
                <tbody>
                  {currentEntries.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>{student.contact}</td>
                      <td>{student.course}</td>
                      <td>{student.batch}</td>
                      <td>
                        <span className={`badge ${student.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                          {student.status}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-sm btn-primary">
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button className="btn btn-sm btn-danger">
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <div>
                Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredStudents.length)} of {filteredStudents.length} entries
              </div>
              <div className="pagination">
                <button 
                  className="btn btn-outline-primary me-2" 
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button 
                  className="btn btn-primary me-2"
                >
                  {currentPage}
                </button>
                <button 
                  className="btn btn-outline-primary" 
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default StudentList;