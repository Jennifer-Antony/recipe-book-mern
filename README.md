# Recipe Book — MERN Stack Application

## Overview
Recipe Book is a web application built using the MERN stack that allows users to organize and manage their favourite recipes. Users can add recipes, view their details, edit existing entries, and delete recipes.

## Technologies Used
- **MongoDB Atlas** — Database
- **Express.js** — Backend API
- **React.js** — Frontend user interface
- **Node.js** — Server runtime
- **Axios** — API communication
- **Lucide React** — Icons
- **Vite** — Frontend development and build tool

## Features
- Add recipes with name, category, ingredients, preparation steps, and cooking time
- View recipe details
- Edit and delete recipes
- Search recipes by name or ingredients
- Filter recipes by category
- Validate required fields and cooking time
- Responsive user interface
- Store recipe data in MongoDB Atlas

## Project Structure
- `frontend/` — React application
- `backend/` — Express server, API routes, and Mongoose model

## Setup Instructions

### 1. Clone the repository
```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd recipe-book
```

### 2. Configure the backend
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder using `.env.example` as a reference:

```dotenv
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
```

Start the backend:

```bash
node server.js
```

### 3. Configure the frontend
Open a second terminal:

```bash
cd frontend
npm install
```

Create a frontend `.env` file based on `.env.example`:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/recipes` | Retrieve all recipes |
| GET | `/api/recipes/:id` | Retrieve one recipe |
| POST | `/api/recipes` | Create a recipe |
| PUT | `/api/recipes/:id` | Update a recipe |
| DELETE | `/api/recipes/:id` | Delete a recipe |

## Database
Recipe records are stored in MongoDB Atlas. A valid MongoDB connection string is required to run the backend.

## Author
Add your name and assessment details here.
