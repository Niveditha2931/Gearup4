import React, { useState, useEffect, useRef } from "react";
import './Dashboard.css';
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function Dashboard() {

  const [feeCollectionData, setFeeCollectionData] = useState([]);  
  // Stats counters with animation
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    revenue: 0
  });
  
  // Target values for counting animation
  const targetStats = {
    students: 1234,
    teachers: 85,
    courses: 42,
    revenue: 52234
  };
  
  useEffect(() => {
  
    // Set fee collection data
    setFeeCollectionData([
      { y: 45000, name: "Collected", color: "#4CAF50" },
      { y: 15000, name: "Pending", color: "#F44336" }
    ]);
    
    // Animate counter stats
    const duration = 2000; // 2 seconds animation
    const steps = 50;
    const interval = duration / steps;
    
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      
      if (currentStep <= steps) {
        const progress = currentStep / steps;
        
        setStats({
          students: Math.round(targetStats.students * progress),
          teachers: Math.round(targetStats.teachers * progress),
          courses: Math.round(targetStats.courses * progress),
          revenue: Math.round(targetStats.revenue * progress)
        });
      } else {
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, []);
  

  
  // Chart options for fee collection
  const feeOptions = {
    animationEnabled: true,
    title: {
      text: ""
    },
    subtitles: [{
      text: "Fee Collection Status",
      verticalAlign: "center",
      fontSize: 14,
      dockInsidePlotArea: true
    }],
    data: [{
      type: "doughnut",
      showInLegend: true,
      indexLabel: "{name}: ₹{y}",
      yValueFormatString: "#,###",
      dataPoints: feeCollectionData
    }]
  };

  return (
    <div id="dashboard" className="dashboard m-0">
      <h2 className="mt-2">Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="row g-4 mb-4 mt-2">
        {/* Total Students */}
        <div className="col-md-6 col-lg-3">
          <div className="card stat-card">
            <div className="card-body d-flex align-items-center">
              <i className="fas fa-user-graduate fa-3x me-3 text-primary"></i>
              <div>
                <h6>Total Students</h6>
                <h3>{stats.students}</h3>
                <small className="text-success">
                  <i className="fas fa-arrow-up"></i> 12% increase
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Total Teachers */}
        <div className="col-md-6 col-lg-3">
          <div className="card stat-card">
            <div className="card-body d-flex align-items-center">
              <i className="fas fa-chalkboard-teacher fa-3x me-3 text-primary"></i>
              <div>
                <h6>Total Teachers</h6>
                <h3>{stats.teachers}</h3>
                <small className="text-success">
                  <i className="fas fa-arrow-up"></i> 5% increase
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Active Courses */}
        <div className="col-md-6 col-lg-3">
          <div className="card stat-card">
            <div className="card-body d-flex align-items-center">
              <i className="fas fa-book-open fa-3x me-3 text-primary"></i>
              <div>
                <h6>Active Courses</h6>
                <h3>{stats.courses}</h3>
                <small className="text-warning">
                  <i className="fas fa-arrow-right"></i> Stable
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="col-md-6 col-lg-3">
          <div className="card stat-card">
            <div className="card-body d-flex align-items-center">
              <i className="fas fa-dollar-sign fa-3x me-3 text-primary"></i>
              <div>
                <h6>Revenue</h6>
                <h3>${Math.floor(stats.revenue/1000)}K</h3>
                <small className="text-success">
                  <i className="fas fa-arrow-up"></i> 8% increase
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="row g-4 mb-4">
    

        {/* Fee Collection */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="m-0">Fee Collection</h5>
            </div>
            <div className="card-body">
              <CanvasJSChart options={feeOptions} />
              <div className="mt-4">
                <div className="d-flex justify-content-between mb-2">
                  <span><span className="status-dot collected"></span> Collected</span>
                  <span className="text-success">₹45,000</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span><span className="status-dot pending"></span> Pending</span>
                  <span className="text-danger">₹15,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;