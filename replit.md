# AI Fitness Coach

## Overview

AI Fitness Coach is a modern, full-stack web application that helps users track their workouts and receive personalized fitness recommendations powered by Google's Gemini AI. The application features a clean, dark-themed UI built with React and TypeScript, JWT-based authentication, and AI-generated workout plans tailored to individual user progress.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses a modern React architecture with TypeScript for type safety:
- **Framework**: React 19+ with functional components and hooks
- **Routing**: React Router DOM with HashRouter for deployment compatibility
- **State Management**: Context API with custom useAuth hook for authentication state
- **Styling**: Tailwind CSS with custom dark theme configuration
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
The backend follows a RESTful API pattern built with Node.js:
- **Framework**: Express.js for HTTP server and API routing
- **Database**: MongoDB with Mongoose ODM for data modeling
- **Authentication**: JWT tokens with bcryptjs for password hashing
- **Architecture Pattern**: MVC-style with separate models, routes, and middleware

### Authentication System
JWT-based authentication with the following flow:
- User registration/login returns JWT token and user data
- Tokens stored in localStorage for persistence
- Authentication context provides user state across components
- Protected routes redirect unauthenticated users to landing page
- Middleware validates tokens on backend API requests

### Data Models
Two primary data models handle user management and workout tracking:
- **User Model**: Stores username, email, and hashed password with timestamps
- **Workout Model**: Stores exercise details (name, sets, reps, weight) linked to users via ObjectId references

### AI Integration
Google Gemini AI integration for personalized workout recommendations:
- API key configuration through environment variables
- Workout plan generation based on user's exercise history
- Structured response format with daily plans and exercise specifications
- Caching mechanism to prevent excessive AI API calls

## External Dependencies

### Core Technologies
- **React 19+**: Frontend framework with modern hooks and concurrent features
- **TypeScript**: Static typing for improved development experience
- **Node.js**: Runtime environment for backend services
- **Express.js**: Web framework for API development

### Database
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: ODM for MongoDB with schema validation and relationships

### AI Services
- **Google Gemini AI (@google/genai)**: AI model for generating personalized workout recommendations and fitness plans

### Authentication & Security
- **JWT (jsonwebtoken)**: Token-based authentication
- **bcryptjs**: Password hashing and comparison
- **CORS**: Cross-origin resource sharing configuration

### Development Tools
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework via CDN
- **TypeScript Compiler**: Type checking and compilation

### Deployment Considerations
- **Environment Variables**: GEMINI_API_KEY for AI integration, MONGODB_URI for database connection
- **Port Configuration**: Frontend on 5000, Backend on 3001
- **Cross-origin Setup**: CORS configured for local development and production deployment