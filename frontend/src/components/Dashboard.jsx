import React, { useState, useEffect, useRef } from "react";
import './Dashboard.css';
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function Dashboard() {
  // State for chart data
  const [attendanceData, setAttendanceData] = useState({
    daily: [],
    weekly: [],
    monthly: []
  });
  const [feeCollectionData, setFeeCollectionData] = useState([]);
  
  // Active view state
  const [activeView, setActiveView] = useState('daily');
  
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
    // Generate attendance data for different views
    // Daily data
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dailyPresentData = [85, 91, 87, 93, 90, 86, 92];
    const dailyAbsentData = [15, 9, 13, 7, 10, 14, 8];
    
    const newDailyData = weekdays.map((day, index) => ({
      x: index,
      label: day,
      present: dailyPresentData[index],
      absent: dailyAbsentData[index]
    }));
    
    // Weekly data (4 weeks)
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    const weeklyPresentData = [88, 86, 89, 91];
    const weeklyAbsentData = [12, 14, 11, 9];
    
    const newWeeklyData = weeks.map((week, index) => ({
      x: index,
      label: week,
      present: weeklyPresentData[index],
      absent: weeklyAbsentData[index]
    }));
    
    // Monthly data (6 months)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const monthlyPresentData = [87, 85, 86, 88, 89, 90];
    const monthlyAbsentData = [13, 15, 14, 12, 11, 10];
    
    const newMonthlyData = months.map((month, index) => ({
      x: index,
      label: month,
      present: monthlyPresentData[index],
      absent: monthlyAbsentData[index]
    }));
    
    setAttendanceData({
      daily: newDailyData,
      weekly: newWeeklyData,
      monthly: newMonthlyData
    });
    
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
  
  // Handle view change
  const handleViewChange = (view) => {
    setActiveView(view);
  };
  
  // Get current attendance data based on active view
  const getCurrentAttendanceData = () => {
    return attendanceData[activeView] || [];
  };

  // Chart options for attendance
  const getAttendanceOptions = () => {
    const currentData = getCurrentAttendanceData();
    
    let subtitle = "";
    switch(activeView) {
      case 'weekly':
        subtitle = "Weekly Attendance (Last 4 Weeks)";
        break;
      case 'monthly':
        subtitle = "Monthly Attendance (Last 6 Months)";
        break;
      default:
        subtitle = "Daily Attendance (Last Week)";
    }
    
    return {
      animationEnabled: true,
      title: {
        text: ""
      },
      subtitles: [{
        text: subtitle,
        fontSize: 14,
        horizontalAlign: "left"
      }],
      axisX: {
        title: "",
        valueFormatString: " "
      },
      axisY: {
        title: "",
        suffix: "%",
        minimum: 0,
        maximum: 100
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "top",
        horizontalAlign: "center"
      },
      data: [
        {
          type: "line",
          name: "Present",
          showInLegend: true,
          markerType: "circle",
          color: "#3f51b5",
          lineThickness: 3,
          dataPoints: currentData.map(data => ({
            label: data.label,
            y: data.present
          }))
        },
        {
          type: "line",
          name: "Absent",
          showInLegend: true,
          markerType: "circle",
          color: "#e91e63",
          lineThickness: 3,
          dataPoints: currentData.map(data => ({
            label: data.label,
            y: data.absent
          }))
        }
      ]
    };
  };
  
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

      {/* Attendance and Fee Collection Charts */}
      <div className="row g-4 mb-4">
        {/* Attendance Summary */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="m-0">Attendance Summary</h5>
              <div className="btn-group" role="group">
                <button 
                  type="button" 
                  className={`btn btn-sm ${activeView === 'daily' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleViewChange('daily')}
                >
                  Daily
                </button>
                <button 
                  type="button" 
                  className={`btn btn-sm ${activeView === 'weekly' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleViewChange('weekly')}
                >
                  Weekly
                </button>
                <button 
                  type="button" 
                  className={`btn btn-sm ${activeView === 'monthly' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleViewChange('monthly')}
                >
                  Monthly
                </button>
              </div>
            </div>
            <div className="card-body">
              <CanvasJSChart options={getAttendanceOptions()} />
            </div>
          </div>
        </div>

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