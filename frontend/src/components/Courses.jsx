import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios for API calls
import "./Courses.css";

const API_BASE_URL = window.REACT_APP_API_BASE_URL || "http://localhost:5000"; // Ensure this matches the backend URL

// Remove the unnecessary process check
console.warn("Using API base URL:", API_BASE_URL);

function Courses() {
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [activeSubForm, setActiveSubForm] = useState("basic");
  const [courses, setCourses] = useState([]); // Ensure courses is initialized as an empty array
  const [currentCourse, setCurrentCourse] = useState({
    title: "",
    category: "",
    description: "",
    level: "",
    sections: [],
  });
  const [sections, setSections] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [statistics, setStatistics] = useState({
    totalCourses: 0,
    activeStudents: 0,
    courseRevenue: 0,
    newEnrollments: 0, // Add newEnrollments to the state
  });
  const [coursesFilter, setCoursesFilter] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseDetails, setShowCourseDetails] = useState(false);
  const [categories, setCategories] = useState([]); // State to store categories
  const [newCategory, setNewCategory] = useState(""); // State for new category input

  // Fetch courses from the backend on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/courses/all`); // Use dynamic base URL
        if (Array.isArray(response.data)) {
          // Ensure each course has a sections array
          const coursesWithSections = response.data.map(course => ({
            ...course,
            sections: course.sections || [] // Fallback to empty array if sections is undefined
          }));
          setCourses(coursesWithSections);
        } else {
          console.error("Unexpected response format:", response.data);
          setCourses([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error("Error fetching courses:", error.message); // Improved error logging
        setCourses([]); // Handle errors by setting courses to an empty array
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/courses/statistics`); // Use dynamic base URL
        setStatistics(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, []);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/categories`);
        setCategories(response.data); // Dynamically set categories from the backend
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };
    fetchCategories();
  }, []);

  // Add a new category or use an existing one
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return; // Prevent empty category submission
    try {
      const response = await axios.post(`${API_BASE_URL}/api/categories/add`, { name: newCategory });
      const addedCategory = response.data;

      // Check if the category is already in the list
      if (!categories.some((category) => category._id === addedCategory._id)) {
        setCategories([...categories, addedCategory]); // Add the new category to the list
      }

      setNewCategory(""); // Clear the input field
    } catch (error) {
      console.error("Error adding category:", error.message);
    }
  };

  // Handle basic course form submission
  const handleBasicFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const categoryName = formData.get("category").trim();

    try {
      // Check if the category exists or create a new one
      const categoryResponse = await axios.post(`${API_BASE_URL}/api/categories/add`, { name: categoryName });
      const category = categoryResponse.data;

      const newCourse = {
        title: formData.get("title"),
        category: category.name, // Use the category name from the response
        description: formData.get("description"),
        level: formData.get("level"),
        sections: sections, // Include sections with lessons and quizzes
      };

      const courseResponse = await axios.post(`${API_BASE_URL}/api/courses/add`, newCourse);
      const addedCourse = {
        ...courseResponse.data,
        sections: courseResponse.data.sections || [] // Ensure sections is always an array
      };
      setCourses([...courses, addedCourse]); // Update the course list dynamically
      setShowAddCourseForm(false); // Close the form
      setActiveSubForm("basic"); // Reset the form state
      setSections([]); // Clear sections
    } catch (error) {
      console.error("Error adding course or category:", error.response?.data?.message || error.message);
      alert("Failed to add course or category. Please check your backend connection.");
    }
  };

  // Handle section form submission
  const handleSectionFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const courseId = formData.get("course"); // Get the selected course ID
    const newSection = {
      title: formData.get("sectionTitle"),
      lessons: [],
      quizzes: [],
    };

    try {
      // Add the section to the selected course
      const response = await axios.put(`${API_BASE_URL}/api/courses/update/${courseId}`, {
        $push: { sections: newSection },
      });
      const updatedCourse = {
        ...response.data,
        sections: response.data.sections || [] // Ensure sections is always an array
      };

      // Update the courses state with the updated course
      setCourses(courses.map((course) => (course._id === updatedCourse._id ? updatedCourse : course)));
      setSections([]); // Clear the sections state
      setActiveSubForm("lesson"); // Move to the "Add Lesson" form
    } catch (error) {
      console.error("Error adding section:", error.response?.data?.message || error.message);
    }
  };

  // Handle lesson form submission
  const handleLessonFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newLesson = {
      id: Date.now(),
      title: formData.get("lessonTitle"),
      sectionId: formData.get("section"),
      type: formData.get("lessonType"),
      summary: formData.get("summary"),
    };
    setLessons([...lessons, newLesson]);
    const updatedSections = sections.map((section) => {
      if (section.id === parseInt(newLesson.sectionId)) {
        return {
          ...section,
          lessons: [...section.lessons, newLesson],
        };
      }
      return section;
    });
    setSections(updatedSections);
  };

  // Handle quiz form submission
  const handleQuizFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newQuiz = {
      id: Date.now(),
      title: formData.get("quizTitle"),
      sectionId: formData.get("section"),
      instructions: formData.get("instructions"),
    };
    setQuizzes([...quizzes, newQuiz]);
    const updatedSections = sections.map((section) => {
      if (section.id === parseInt(newQuiz.sectionId)) {
        return {
          ...section,
          quizzes: [...section.quizzes, newQuiz],
        };
      }
      return section;
    });
    setSections(updatedSections);
  };

  // Render Basic Information Form
  const renderBasicForm = () => (
    <form onSubmit={handleBasicFormSubmit}>
      <h5>Basic Information</h5>
      <div className="row mb-3">
        <div className="col-md-6">
          <label>Course Title</label>
          <input 
            type="text" 
            className="form-control" 
            name="title"
            placeholder="Enter course title" 
            required
          />
        </div>
        <div className="col-md-6">
          <label>Category</label>
          <input 
            type="text" 
            className="form-control" 
            name="category"
            placeholder="Enter or create a category" 
            required
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-12">
          <label>Description</label>
          <textarea 
            className="form-control" 
            rows="4" 
            name="description"
            placeholder="Enter course description"
            required
          ></textarea>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <label>Level</label>
          <select className="form-control" name="level" required>
            <option value="">Select Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>
      <button type="submit" className="btn btn-primary">Next: Add Sections</button>
    </form>
  );

  // Render Add Section Form
  const renderAddSectionForm = () => (
    <div>
      <h5>Add New Section</h5>
      <form onSubmit={handleSectionFormSubmit}>
        <div className="mb-3">
          <label>Course Title</label>
          <select className="form-control" name="course" required>
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Section Title</label>
          <input 
            type="text" 
            className="form-control" 
            name="sectionTitle"
            placeholder="Enter section title" 
            required
          />
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">Add Section</button>
          <button 
            type="button" 
            className="btn btn-success"
            onClick={() => setActiveSubForm("lesson")} // Ensure this transitions to the "Add Lesson" form
          >
            Next: Add Lessons
          </button>
        </div>
      </form>
      
      {/* Display added sections */}
      {sections.length > 0 && (
        <div className="mt-4">
          <h6>Added Sections:</h6>
          <ul className="list-group">
            {sections.map((section, index) => (
              <li key={index} className="list-group-item">
                {section.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  // Render Add Lesson Form
  const renderAddLessonForm = () => (
    <div>
      <h5>Add New Lesson</h5>
      <form onSubmit={handleLessonFormSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Lesson Title</label>
            <input 
              type="text" 
              className="form-control" 
              name="lessonTitle"
              placeholder="Enter lesson title" 
              required
            />
          </div>
          <div className="col-md-6">
            <label>Section</label>
            <select className="form-control" name="section" required>
              <option value="">Select Section</option>
              {sections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label>Lesson Type</label>
          <select className="form-control" name="lessonType" required>
            <option value="">Select Lesson Type</option>
            <option value="Video">Video</option>
            <option value="Text">Text</option>
            <option value="PDF">PDF</option>
            <option value="Document">Document</option>
            <option value="Image">Image</option>
          </select>
        </div>
        <div className="mb-3">
          <label>Summary</label>
          <textarea 
            className="form-control" 
            rows="3" 
            name="summary"
            placeholder="Enter lesson summary"
            required
          ></textarea>
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">Add Lesson</button>
          <button 
            type="button" 
            className="btn btn-success"
            onClick={() => setActiveSubForm("quiz")}
          >
            Next: Add Quizzes
          </button>
        </div>
      </form>
    </div>
  );

  // Render Add Quiz Form
  const renderAddQuizForm = () => (
    <div>
      <h5>Add New Quiz</h5>
      <form onSubmit={handleQuizFormSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Quiz Title</label>
            <input 
              type="text" 
              className="form-control" 
              name="quizTitle"
              placeholder="Enter quiz title" 
              required
            />
          </div>
          <div className="col-md-6">
            <label>Section</label>
            <select className="form-control" name="section" required>
              <option value="">Select Section</option>
              {sections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label>Instructions</label>
          <textarea 
            className="form-control" 
            rows="3" 
            name="instructions"
            placeholder="Enter quiz instructions"
            required
          ></textarea>
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">Add Quiz</button>
          <button 
            type="button" 
            className="btn btn-success"
            onClick={() => {
              // Here you would typically save the complete course to your backend
              console.log("Complete Course:", {
                ...currentCourse,
                sections: sections.map(section => ({
                  ...section,
                  lessons: lessons.filter(l => l.sectionId === section.id),
                  quizzes: quizzes.filter(q => q.sectionId === section.id)
                }))
              });
              // Reset form and show success message
              setShowAddCourseForm(false);
              setActiveSubForm("basic");
              setCurrentCourse({});
              setSections([]);
              setLessons([]);
              setQuizzes([]);
            }}
          >
            Complete Course
          </button>
        </div>
      </form>
    </div>
  );

  // Render Course List
  const renderCourseList = () => (
    <div>
      {/* Course Categories */}
      <div className="course-categories mb-4">
        <h5>Course Categories</h5>
        <div className="d-flex gap-3">
          <button className="btn btn-primary" onClick={() => setCoursesFilter("All")}>
            All
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              className="btn btn-outline-primary"
              onClick={() => setCoursesFilter(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filtered Course List */}
      <div className="row">
        {courses
          .filter((course) => coursesFilter === "All" || course.category === coursesFilter)
          .map((course) => (
            <div className="col-md-4 mb-4" key={course._id}>
              <div className="card course-card" onClick={() => handleCourseClick(course)}>
                <img src={course.image || "https://via.placeholder.com/300x200"} className="card-img-top" alt={course.title} />
                <div className="card-body">
                  <span className={`badge bg-primary mb-2`}>{course.category}</span>
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">{course.description}</p>
                  <ul className="list-unstyled">
                    <li>
                      <i className="fas fa-clock me-2"></i>Level: {course.level}
                    </li>
                    <li>
                      <i className="fas fa-book me-2"></i>{(course.sections || []).length} sections
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  // Handle Course Click
  const handleCourseClick = (course) => {
    setSelectedCourse(course); // Set the selected course
    setShowCourseDetails(true); // Show course details
  };

  // Render Course Details
  const renderCourseDetails = () => (
    <div>
      <h4>{selectedCourse.title}</h4>
      <p>{selectedCourse.description}</p>
      <h5>Sections</h5>
      {(selectedCourse.sections || []).map((section) => (
        <div key={section._id}>
          <h6>{section.title}</h6>
          <ul>
            {(section.lessons || []).map((lesson) => (
              <li key={lesson._id}>{lesson.title} ({lesson.type})</li>
            ))}
          </ul>
          <h6>Quizzes</h6>
          <ul>
            {(section.quizzes || []).map((quiz) => (
              <li key={quiz._id}>{quiz.title}</li>
            ))}
          </ul>
        </div>
      ))}
      <button className="btn btn-primary" onClick={() => setShowCourseDetails(false)}>
        Back to Courses
      </button>
    </div>
  );

  return (
    <div className="courses-container m-0">
      {/* Stat Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stat-card bg-primary text-white">
            <h5>Total Courses</h5>
            <h3>{statistics.totalCourses}</h3>
            <p>Active Programs</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-success text-white">
            <h5>Active Students</h5>
            <h3>{statistics.activeStudents}</h3>
            <p>Currently Enrolled</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-info text-white">
            <h5>Course Revenue</h5>
            <h3>${statistics.courseRevenue}</h3>
            <p>This Month</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-warning text-white">
            <h5>New Enrollments</h5>
            <h3>{statistics.newEnrollments}</h3>
            <p>Last 30 Days</p>
          </div>
        </div>
      </div>

      {/* Header with navigation buttons */}
      <div className="course-header d-flex justify-content-between align-items-center mb-4">
        <h4>Available Courses</h4>
        <div className="d-flex gap-3">
          <button
            className="btn btn-outline-primary"
            onClick={() => {
              setShowAddCourseForm(false);
              setActiveSubForm("basic");
            }}
          >
            Course List
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowAddCourseForm(true)}
          >
            Add New Course
          </button>
        </div>
      </div>

      {/* Conditional rendering */}
      {showAddCourseForm ? (
        <div className="add-course-form">
          <div className="d-flex gap-3 mb-4">
            <button
              className={`btn ${activeSubForm === "basic" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setActiveSubForm("basic")}
            >
              Basic
            </button>
            <button
              className={`btn ${activeSubForm === "section" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setActiveSubForm("section")}
            >
              Add Section
            </button>
            <button
              className={`btn ${activeSubForm === "lesson" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setActiveSubForm("lesson")}
            >
              Add Lesson
            </button>
            <button
              className={`btn ${activeSubForm === "quiz" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setActiveSubForm("quiz")}
            >
              Add Quiz
            </button>
          </div>

          {/* Render the active sub-form */}
          {activeSubForm === "basic" && renderBasicForm()}
          {activeSubForm === "section" && renderAddSectionForm()}
          {activeSubForm === "lesson" && renderAddLessonForm()}
          {activeSubForm === "quiz" && renderAddQuizForm()}
        </div>
      ) : (
        showCourseDetails ? renderCourseDetails() : renderCourseList()
      )}
    </div>
  );
}

export default Courses;