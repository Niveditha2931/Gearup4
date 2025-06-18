import React, { useState } from 'react';
import './Faculty.css';

function Faculty() {
  const [activeTab, setActiveTab] = useState('teacherList'); // State to track the active tab

  // Sample teacher data
  const teachers = [
    { id: 'TCH001', name: 'John Smith', department: 'Mathematics', contact: '+91 98765 43210', status: 'Active' },
  ];

  // Render Teacher List
  const renderTeacherList = () => (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead className="table-light">
          <tr>
            <th>Teacher ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Contact</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id}>
              <td>{teacher.id}</td>
              <td>{teacher.name}</td>
              <td>{teacher.department}</td>
              <td>{teacher.contact}</td>
              <td>
                <span className={`badge ${teacher.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                  {teacher.status}
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
  );

  // Render Add New Teacher Form
  const renderAddTeacherForm = () => (
    <div>
      <h5>Add New Teacher</h5>
      <form>
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Full Name</label>
            <input type="text" className="form-control" placeholder="Enter full name" />
          </div>
          <div className="col-md-6">
            <label>Email</label>
            <input type="email" className="form-control" placeholder="Enter email" />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Contact Number</label>
            <input type="text" className="form-control" placeholder="Enter contact number" />
          </div>
          <div className="col-md-6">
            <label>Department</label>
            <select className="form-control">
              <option>Select Department</option>
              <option>Mathematics</option>
              <option>Physics</option>
              <option>Chemistry</option>
            </select>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Qualification</label>
            <input type="text" className="form-control" placeholder="Enter qualification" />
          </div>
          <div className="col-md-6">
            <label>Experience (Years)</label>
            <input type="number" className="form-control" placeholder="Enter experience" />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Joining Date</label>
            <input type="date" className="form-control" />
          </div>
          <div className="col-md-6">
            <label>Salary</label>
            <input type="number" className="form-control" placeholder="Enter salary" />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-12">
            <label>Specialization</label>
            <input type="text" className="form-control" placeholder="Enter specialization" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Save Teacher
        </button>
      </form>
    </div>
  );

  return (
    <div className="container-fluid">
      {/* Main Content */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body text-center">
              <h6>Total Teachers</h6>
              <h4>85</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body text-center">
              <h6>Active Teachers</h6>
              <h4>78</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body text-center">
              <h6>Departments</h6>
              <h4>12</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body text-center">
              <h6>On Leave</h6>
              <h4>7</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'teacherList' ? 'active' : ''}`}
            onClick={() => setActiveTab('teacherList')}
          >
            <i className="bi bi-list"></i> Teacher List
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'addTeacher' ? 'active' : ''}`}
            onClick={() => setActiveTab('addTeacher')}
          >
            <i className="bi bi-person-plus"></i> Add New Teacher
          </button>
        </li>
      </ul>

      {/* Conditional Rendering for Details Section */}
      <div>
        {activeTab === 'teacherList' && renderTeacherList()}
        {activeTab === 'addTeacher' && renderAddTeacherForm()}
      </div>
    </div>
  );
}

export default Faculty;