# AI Fitness Coach - Local Setup Guide for Windows with VS Code

## Prerequisites

Before setting up the project, ensure you have the following installed on your Windows machine:

1. **Node.js (v18 or higher)**
   - Download from: https://nodejs.org/
   - Choose the LTS version
   - Verify installation: `node --version` and `npm --version`

2. **MongoDB Community Edition**
   - Download from: https://www.mongodb.com/try/download/community
   - Choose Windows version
   - Install with default settings
   - MongoDB Compass (GUI) is recommended for database management

3. **Visual Studio Code**
   - Download from: https://code.visualstudio.com/
   - Install recommended extensions:
     - ES7+ React/Redux/React-Native snippets
     - TypeScript Importer
     - MongoDB for VS Code (optional)

4. **Git**
   - Download from: https://git-scm.com/download/win
   - Use Git Bash or Command Prompt

## Project Setup

### 1. Clone and Navigate to Project
```bash
# Clone your repository
git clone <your-repository-url>
cd ai-fitness-coach

# Open in VS Code
code .
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
# In the project root directory
npm install
```

#### Backend Dependencies
```bash
# Navigate to backend directory
cd backend
npm install
cd ..
```

### 3. Environment Configuration

#### Backend Environment (.env file)
Create a `.env` file in the `backend` directory:

```bash
cd backend
# Create .env file
echo. > .env
```

Add the following content to `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/ai-fitness-coach
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GEMINI_API_KEY=your-google-gemini-api-key
PORT=3001
```

#### Frontend Environment (.env file)
Create a `.env` file in the project root:
```bash
# In project root
echo. > .env
```

Add the following content to `.env`:
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### 4. Start MongoDB Service

#### Option 1: Windows Service (Recommended)
If you installed MongoDB as a Windows service:
```bash
# Start MongoDB service
net start MongoDB
```

#### Option 2: Manual Start
If not installed as service:
```bash
# Create data directory (if not exists)
mkdir C:\data\db

# Start MongoDB manually
mongod --dbpath C:\data\db
```

### 5. Get Google Gemini API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy the API key and add it to your `backend/.env` file

## Running the Project

### Method 1: Using VS Code Terminal (Recommended)

1. **Open two terminals in VS Code** (`Terminal > New Terminal`)

2. **Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```
You should see: `Server running on port 3001` and `Connected to MongoDB`

3. **Terminal 2 - Frontend Development Server:**
```bash
cd frontend
npm run dev
```
You should see: `Local: http://localhost:5000/`

4. **Access the application:**
   - Open browser and go to: `http://localhost:5000`

### Method 2: Using Command Prompt

1. **Start Backend (Command Prompt 1):**
```cmd
cd /path/to/your/project/backend
npm run dev
```

2. **Start Frontend (Command Prompt 2):**
```cmd
cd /path/to/your/project/frontend
npm run dev
```

## API Testing with Postman

### 1. Install Postman
- Download from: https://www.postman.com/downloads/

### 2. Import API Collection

Create a new collection in Postman and add these requests:

#### Register User
```
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
}
```

#### Login User
```
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
    "email": "test@example.com",
    "password": "password123"
}
```

#### Get Workouts (Protected Route)
```
GET http://localhost:3001/api/workouts
Authorization: Bearer <your-jwt-token-from-login>
```

#### Add Workout (Protected Route)
```
POST http://localhost:3001/api/workouts
Authorization: Bearer <your-jwt-token-from-login>
Content-Type: application/json

{
    "exerciseName": "Bench Press",
    "sets": 4,
    "reps": 8,
    "weight": 80
}
```

#### Get AI Recommendation (Protected Route)
```
GET http://localhost:3001/api/ai-recommendation
Authorization: Bearer <your-jwt-token-from-login>
```

#### Health Check
```
GET http://localhost:3001/api/health
```

### 3. Testing Workflow

1. **Register a new user** using the register endpoint
2. **Login** with the registered user credentials
3. **Copy the JWT token** from the login response
4. **Use the token** in the Authorization header for protected routes
5. **Test all CRUD operations** for workouts
6. **Test AI recommendations** (requires Gemini API key)

## Database Management

### Using MongoDB Compass (GUI)
1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Browse database: `ai-fitness-coach`
4. View collections: `users`, `workouts`

### Using MongoDB Shell
```bash
# Connect to MongoDB
mongosh

# Switch to database
use ai-fitness-coach

# View users
db.users.find()

# View workouts
db.workouts.find()

# View workouts for specific user
db.workouts.find({"user": ObjectId("user_id_here")})
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB service is running
   - Check connection string in `.env` file
   - Verify MongoDB port (default: 27017)

2. **Port Already in Use**
   - Frontend: Change port in `vite.config.ts` server settings
   - Backend: Change PORT in `backend/.env` file

3. **API Calls Failing**
   - Verify backend server is running on port 3001
   - Check CORS settings in backend
   - Ensure correct API base URL in frontend

4. **Gemini API Not Working**
   - Verify API key is correct in `backend/.env`
   - Check API key permissions and quotas
   - Ensure you have billing enabled if required

### VS Code Debugging

1. **Install Debugger for Chrome extension**
2. **Create `.vscode/launch.json`:**
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Launch Chrome",
            "request": "launch",
            "type": "chrome",
            "url": "http://localhost:5000",
            "webRoot": "${workspaceFolder}"
        }
    ]
}
```

## Production Deployment

### Environment Variables for Production
- Use strong JWT secret
- Use MongoDB Atlas or production MongoDB instance
- Secure API keys
- Enable HTTPS
- Configure proper CORS origins

### Build Commands
```bash
# Build frontend for production
npm run build

# Build frontend and serve
npm run preview
```

## File Structure
```
ai-fitness-coach/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx
│   │   │   └── Navbar.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.tsx
│   │   ├── pages/
│   │   │   ├── AddWorkoutPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── mockApi.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/
│   ├── package.json
│   ├── server.js
│   └── .env
└── docs/
    ├── api-testing-guide.md
    ├── database-models.md
    └── local-setup-guide.md
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure all services are running
4. Check browser console and server logs for errors