import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [courses, setCourses] = useState([])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const emptyForm = {
    code: '',
    name: '',
    credits: '',
    status: 'Planned'
  }

  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    async function loadCourses() {
      try {
        const response = await fetch('/api/courses')

        if (!response.ok) {
          throw new Error('Could not load courses.')
        }

        const data = await response.json()
        setCourses(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  function resetForm() {
    setFormData(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  function openAddForm() {
    if (showForm && editingId === null) {
      resetForm()
      return
    }

    setFormData(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  function openEditForm(course) {
    setFormData({
      code: course.code || '',
      name: course.name || '',
      credits: course.credits || '',
      status: course.status || 'Planned'
    })

    setEditingId(course._id)
    setShowForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  function validateForm() {
    if (
      !formData.code.trim() ||
      !formData.name.trim() ||
      !formData.credits
    ) {
      alert('Please fill in all course fields.')
      return false
    }

    const credits = Number(formData.credits)

    if (!Number.isFinite(credits) || credits <= 0) {
      alert('Credits must be greater than 0.')
      return false
    }

    return true
  }

  async function submitCourse() {
    if (!validateForm()) return

    const courseData = {
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      credits: Number(formData.credits),
      status: formData.status
    }

    if (editingId) {
      await updateCourse(courseData)
    } else {
      await addCourse(courseData)
    }
  }

  async function addCourse(courseData) {
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(courseData)
      })

      if (!response.ok) {
        throw new Error('Could not add course.')
      }

      const data = await response.json()

      setCourses((currentCourses) => [
        ...currentCourses,
        data.course
      ])

      setError('')
      resetForm()
    } catch (error) {
      setError(error.message)
    }
  }

  async function updateCourse(courseData) {
    try {
      const response = await fetch(
        `/api/courses/${editingId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(courseData)
        }
      )

      if (!response.ok) {
        throw new Error('Could not update course.')
      }

      setCourses((currentCourses) =>
        currentCourses.map((course) =>
          course._id === editingId
            ? {
                ...course,
                ...courseData
              }
            : course
        )
      )

      setError('')
      resetForm()
    } catch (error) {
      setError(error.message)
    }
  }

  async function deleteCourse(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this course?'
    )

    if (!confirmed) return

    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Could not delete course.')
      }

      setCourses((currentCourses) =>
        currentCourses.filter(
          (course) => course._id !== id
        )
      )

      if (editingId === id) {
        resetForm()
      }

      setError('')
    } catch (error) {
      setError(error.message)
    }
  }

  const totalCredits = courses.reduce(
    (total, course) =>
      total + (Number(course.credits) || 0),
    0
  )

  const completedCredits = courses
    .filter((course) => course.status === 'Completed')
    .reduce(
      (total, course) =>
        total + (Number(course.credits) || 0),
      0
    )

  const filteredCourses = courses.filter((course) =>
    `${course.code || ''} ${course.name || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  function getStatusClass(status) {
    if (status === 'Completed') {
      return 'status-badge status-completed'
    }

    if (status === 'In Progress') {
      return 'status-badge status-progress'
    }

    return 'status-badge status-planned'
  }

  return (
    <main className="app-container">
      <header className="hero">
        <div>
          <p className="eyebrow">
            SEMESTER PLANNER
          </p>

          <h1>Courserve</h1>

          <p className="subtitle">
            Plan your semester. Track your progress.
          </p>
        </div>

        <button
          id="add-course-btn"
          onClick={openAddForm}
        >
          {showForm && editingId === null
            ? 'Cancel'
            : '+ Add Course'}
        </button>
      </header>

      {showForm && (
        <section id="course-form">
          <div className="form-heading">
            <h2>
              {editingId
                ? 'Edit course'
                : 'Add a course'}
            </h2>

            <p>
              {editingId
                ? 'Update the course details below.'
                : 'Enter the course details below.'}
            </p>
          </div>

          <div className="form-grid">
            <input
              type="text"
              placeholder="Course code"
              value={formData.code}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  code: event.target.value
                })
              }
            />

            <input
              type="text"
              placeholder="Course name"
              value={formData.name}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  name: event.target.value
                })
              }
            />

            <input
              type="number"
              min="0.5"
              step="0.5"
              placeholder="Credits"
              value={formData.credits}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  credits: event.target.value
                })
              }
            />

            <select
              value={formData.status}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  status: event.target.value
                })
              }
            >
              <option value="Planned">
                Planned
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Completed">
                Completed
              </option>
            </select>
          </div>

          <div className="form-actions">
            <button
              className="submit-course-btn"
              onClick={submitCourse}
            >
              {editingId
                ? 'Save Changes'
                : 'Add Course'}
            </button>

            {editingId && (
              <button
                className="cancel-edit-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </section>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <section id="semester-summary">
        <div className="summary-card">
          <span className="summary-number">
            {courses.length}
          </span>

          <span className="summary-label">
            Courses
          </span>
        </div>

        <div className="summary-card">
          <span className="summary-number">
            {totalCredits}
          </span>

          <span className="summary-label">
            Total Credits
          </span>
        </div>

        <div className="summary-card">
          <span className="summary-number">
            {completedCredits}
          </span>

          <span className="summary-label">
            Completed Credits
          </span>
        </div>
      </section>

      <section className="courses-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              YOUR SEMESTER
            </p>

            <h2>My Courses</h2>
          </div>

          <input
            id="course-search"
            type="text"
            placeholder="Search by code or name..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        {loading ? (
          <div className="empty-state">
            Loading courses...
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="empty-state">
            {courses.length === 0
              ? 'No courses yet. Add your first course.'
              : 'No courses match your search.'}
          </div>
        ) : (
          <div id="course-list">
            {filteredCourses.map((course) => (
              <article
                className="course-card"
                key={course._id}
              >
                <div className="course-card-top">
                  <div>
                    <h3>
                      {course.code}
                    </h3>

                    <p className="course-name">
                      {course.name}
                    </p>
                  </div>

                  <span
                    className={getStatusClass(
                      course.status
                    )}
                  >
                    {course.status || 'Planned'}
                  </span>
                </div>

                <div className="course-meta">
                  <span>
                    {Number(course.credits) || 0}{' '}
                    credits
                  </span>
                </div>

                <div className="course-actions">
                  <button
                    className="edit-btn"
                    onClick={() =>
                      openEditForm(course)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteCourse(course._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default App