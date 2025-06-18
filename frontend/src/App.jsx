import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Students from "./components/Students";
import Faculty from "./components/Faculty";
import Courses from "./components/Courses";
import Reports from "./components/Reports";
import Messages from "./components/Messages";
import Settings from "./components/Settings";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./index.css";
import {userAuthorContextObj} from "./context/UserAdmin";
import {useContext}from 'react'

function App() {
  const {currentUser}=useContext(userAuthorContextObj) 
  return (
    <Router>
      <div className="app">
        {currentUser.role==='admin'?(<Sidebar />):(<Sidebar/>)}
        <div className="main-content">
          {currentUser.role==='admin'?(<Navbar />):(<Navbar/>)}
          {currentUser.role==='admin'?(<Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={
              <ErrorBoundary>
                <Students />
              </ErrorBoundary>
            } />
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/courses" element={
              <ErrorBoundary>
                <Courses />
              </ErrorBoundary>
            } />
            <Route path="/reports" element={<Reports />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>)
          :(
            <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={
              <ErrorBoundary>
                <Students />
              </ErrorBoundary>
            } />
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/courses" element={
              <ErrorBoundary>
                <Courses />
              </ErrorBoundary>
            } />
            <Route path="/reports" element={<Reports />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          )}
          
          
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;