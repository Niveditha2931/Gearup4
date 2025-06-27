import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import Landing from       "./components/Landing";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./index.css";
import { userAdminContextObj } from "./context/UserAdmin";

function App() {
  const { currentUser,setCurrentUser } = useContext(userAdminContextObj);
  useEffect(()=>{
    setCurrentUser(JSON.parse(localStorage.getItem("currentUser")))
  },[])

  return (
    <Router>
      <div className={currentUser?"app":''}>
          {currentUser ?<Sidebar /> :null}
        <div className={currentUser?"main-content":''}>
            {currentUser ? <Navbar />:null}
          <Routes>
            <Route path="/" element={<Landing />} />

            {currentUser ? (
              <>
                <Route path="/dash" element={<Dashboard />} />
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
              </>
            ) : (
              <Route path="*" element={<Navigate to="/" replace />} />
            )}
          </Routes>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;