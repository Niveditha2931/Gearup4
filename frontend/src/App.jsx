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
import Landing from "./components/Landing";

// Student components
import HeroSection from "./components/student/HeroSection";
import ProtectedRoute from "./components/ProtectedRoute";
import MyLearning from "./components/student/MyLearning";
import Profile from "./components/student/Profile";
import SearchPage from "./components/student/SearchPage";
import ScourseDetail from "./components/student/ScourseDetail";
import ScourseProgress from "./components/student/ScourseProgress";
import PurchaseCourseProtectedRoute from "./components/student/PurchaseCourseProtectedRoute";
import Scourses from "./components/student/Scourses";
import StudentNavbar from "./components/student/Navbar";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./index.css";
import { userAdminContextObj } from "./context/UserAdmin";

function App() {
  const { currentUser, setCurrentUser } = useContext(userAdminContextObj);

  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
  }, []);

  return (
    <Router>
      {currentUser ? (
        <div className="app">
          {currentUser.role === "admin" && <Sidebar />}
          {currentUser.role === "student" && <StudentNavbar />}
          <div className="main-content">
            {currentUser.role === "admin" && <Navbar />}
            <Routes>
              {/* Admin routes */}
              {currentUser.role === "admin" && (
                <>
                  <Route path="/dash" element={<Dashboard />} />
                  <Route path="/students" element={<ErrorBoundary><Students /></ErrorBoundary>} />
                  <Route path="/faculty" element={<Faculty />} />
                  <Route path="/courses" element={<ErrorBoundary><Courses /></ErrorBoundary>} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/settings" element={<Settings />} />
                  {/* Redirect "/" and unknown routes to /dash */}
                  <Route path="/" element={<Navigate to="/dash" replace />} />
                  <Route path="*" element={<Navigate to="/dash" replace />} />
                </>
              )}

              {/* Student routes */}
              {currentUser.role === "student" && (
                <>
                  <Route path="/studash" element={<HeroSection />} />
                  <Route
                    path="/my-learning"
                    element={
                      <ProtectedRoute>
                        <MyLearning />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/course/search"
                    element={
                      <ProtectedRoute>
                        <SearchPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/courses" element={<Scourses />} />
                  <Route
                    path="/course-detail/:courseId"
                    element={
                      <ProtectedRoute>
                        <ScourseDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/course-progress/:courseId"
                    element={
                      <ProtectedRoute>
                        <PurchaseCourseProtectedRoute>
                          <ScourseProgress />
                        </PurchaseCourseProtectedRoute>
                      </ProtectedRoute>
                    }
                  />
                  {/* Redirect "/" and unknown routes to /studash */}
                  <Route path="/" element={<Navigate to="/studash" replace />} />
                  <Route path="*" element={<Navigate to="/studash" replace />} />
                </>
              )}
            </Routes>
            <Footer />
          </div>
        </div>
      ) : (
        // Not logged in: show landing page or login/register routes
        <Routes>
           <Route path="/" element={<Landing />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;