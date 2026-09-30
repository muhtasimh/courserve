# Courserve

Courserve is a full-stack semester planning application for managing courses and tracking academic progress.

The application uses a React frontend, an Express REST API, and MongoDB for persistent course storage.

## Live Demo

Courserve is deployed on Microsoft Azure App Service with MongoDB Atlas for persistent cloud data storage.

## Engineering

- Automated API testing with Jest and Supertest
- Continuous integration with GitHub Actions
- Automated deployment to Microsoft Azure App Service
- Production frontend build with Vite
- MongoDB Atlas cloud database integration

## Features

- Add, edit, and delete courses
- Track courses as Planned, In Progress, or Completed
- Search courses by course code or name
- Calculate total semester credits
- Track completed credits
- Persistent course storage with MongoDB
- Responsive user interface
- Form validation and API error handling
- Automated API tests covering course retrieval, creation, updates, deletion, and MongoDB persistence
- GitHub Actions CI workflow that automatically runs the test suite on pushes and pull requests

## Tech Stack

### Frontend
- React
- JavaScript
- HTML/CSS
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- MongoDB Node.js Driver

### Development
- Git
- GitHub
- Jest
- Supertest
- GitHub Actions
- REST API architecture

## Architecture

Courserve uses a client-server architecture:

React Frontend → Express REST API → MongoDB

The React client communicates with the Express backend through HTTP requests. The backend exposes REST endpoints for course operations and stores course data in MongoDB.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/courses` | Retrieve all courses |
| POST | `/api/courses` | Create a course |
| PUT | `/api/courses/:id` | Update a course |
| DELETE | `/api/courses/:id` | Delete a course |

## Course Data

Each course contains:

- Course code
- Course name
- Credit value
- Completion status

Available statuses are:

- Planned
- In Progress
- Completed

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/muhtasimh/Courserve.git
cd Courserve