# Courserve

Courserve is a full-stack semester planning application for managing courses and tracking academic progress.

Built with React, Node.js, Express, and MongoDB, Courserve provides a responsive interface backed by a REST API and persistent cloud storage.

## Live Demo

**[Open Courserve](https://courseflow-muhtasimh-eqdeg6cmh8egfsc3.canadacentral-01.azurewebsites.net/)**

The application is deployed on Microsoft Azure App Service with MongoDB Atlas for persistent cloud data storage.

## Features

- Add, edit, and delete courses
- Track courses as Planned, In Progress, or Completed
- Search courses by course code or name
- Calculate total semester credits and completed credits
- Persist course data with MongoDB
- Responsive user interface
- Form validation and API error handling

## Engineering

- REST API built with Node.js and Express
- Automated API testing with Jest and Supertest
- Tests covering course retrieval, creation, updates, deletion, and database persistence
- CI/CD with GitHub Actions
- Automated production deployment to Microsoft Azure App Service
- Production frontend builds with Vite
- Cloud database integration with MongoDB Atlas

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

### Testing & Deployment

- Jest
- Supertest
- GitHub Actions
- Microsoft Azure App Service
- MongoDB Atlas
- Git

## Architecture

Courserve uses a client-server architecture:

```text
React Frontend → Express REST API → MongoDB
```

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

Courses can have one of three statuses:

- Planned
- In Progress
- Completed

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/muhtasimh/courserve.git
cd courserve
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
cd client
npm install
cd ..
```

### 4. Configure MongoDB

Create a `.env` file in the project root and add your MongoDB connection string:

```env
MONGODB_URI=your_mongodb_connection_string
```

Do not commit the `.env` file or database credentials to GitHub.

### 5. Run the application

Start the backend:

```bash
npm start
```

Then start the React development server from another terminal:

```bash
cd client
npm run dev
```

### 6. Run the tests

```bash
npm test
```

## CI/CD

GitHub Actions automatically runs the API test suite when changes are pushed to the repository. Changes to the main branch are built and deployed to the production application hosted on Microsoft Azure App Service.