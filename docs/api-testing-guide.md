# AI Fitness Coach - API Testing Guide

## Quick Fix Notes

**IMPORTANT FIXES APPLIED:**
- ✅ **Google Gemini Model Fix**: Changed from `gemini-1.5-flash-latest` to `gemini-1.5-flash` to resolve 404 errors
- ✅ **Local MongoDB**: Configured for `mongodb://localhost:27017/ai-fitness-coach`
- ✅ **Professional Folder Structure**: Reorganized frontend with proper `src/` structure

## API Base URL

**Local Development:** `http://localhost:3001/api`

## Authentication Flow

### 1. Register User
```bash
curl --location 'http://localhost:3001/api/auth/register' \
--header 'Content-Type: application/json' \
--data '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
}'
```

**Expected Response:**
```json
{
    "user": {
        "id": "674a1b2c3d4e5f6789012345",
        "username": "testuser",
        "email": "test@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login User
```bash
curl --location 'http://localhost:3001/api/auth/login' \
--header 'Content-Type: application/json' \
--data '{
    "email": "test@example.com",
    "password": "password123"
}'
```

**Expected Response:**
```json
{
    "user": {
        "id": "674a1b2c3d4e5f6789012345",
        "username": "testuser",
        "email": "test@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Workout Management

### 3. Get All Workouts (Protected)
```bash
curl --location 'http://localhost:3001/api/workouts' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

**Expected Response:**
```json
[
    {
        "_id": "674a1b2c3d4e5f6789012346",
        "user": "674a1b2c3d4e5f6789012345",
        "exerciseName": "Bench Press",
        "sets": 4,
        "reps": 8,
        "weight": 80,
        "createdAt": "2024-11-29T10:30:00.000Z"
    }
]
```

### 4. Add New Workout (Protected)
```bash
curl --location 'http://localhost:3001/api/workouts' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
--header 'Content-Type: application/json' \
--data '{
    "exerciseName": "Squat",
    "sets": 3,
    "reps": 12,
    "weight": 100
}'
```

**Expected Response:**
```json
{
    "_id": "674a1b2c3d4e5f6789012347",
    "user": "674a1b2c3d4e5f6789012345",
    "exerciseName": "Squat",
    "sets": 3,
    "reps": 12,
    "weight": 100,
    "createdAt": "2024-11-29T10:35:00.000Z"
}
```

## AI Recommendations

### 5. Get AI Workout Plan (Protected) - FIXED
```bash
curl --location 'http://localhost:3001/api/ai-recommendation' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

**Expected Response:**
```json
{
    "plan": [
        {
            "day": 1,
            "focus": "Push Day",
            "exercises": [
                {
                    "name": "Bench Press",
                    "sets": 4,
                    "reps": "8-10"
                },
                {
                    "name": "Overhead Press",
                    "sets": 3,
                    "reps": "10-12"
                }
            ]
        },
        {
            "day": 2,
            "focus": "Pull Day",
            "exercises": [
                {
                    "name": "Pull-ups",
                    "sets": 4,
                    "reps": "6-8"
                },
                {
                    "name": "Rows",
                    "sets": 4,
                    "reps": "8-10"
                }
            ]
        },
        {
            "day": 3,
            "focus": "Leg Day",
            "exercises": [
                {
                    "name": "Squats",
                    "sets": 4,
                    "reps": "8-10"
                },
                {
                    "name": "Deadlifts",
                    "sets": 3,
                    "reps": "5-6"
                }
            ]
        }
    ]
}
```

## Health Check

### 6. Server Health Check
```bash
curl --location 'http://localhost:3001/api/health'
```

**Expected Response:**
```json
{
    "status": "OK",
    "message": "Server is running"
}
```

## Error Responses

### Common Error Format
```json
{
    "error": "Error message description"
}
```

### Authentication Errors
- **401 Unauthorized**: `{ "error": "Access token required" }`
- **403 Forbidden**: `{ "error": "Invalid token" }`

### Validation Errors
- **400 Bad Request**: `{ "error": "User with this email already exists" }`
- **400 Bad Request**: `{ "error": "Invalid credentials" }`

### AI Service Errors (FIXED)
- **500 Server Error**: `{ "error": "AI Coach is not configured. The API key is missing." }`
- **500 Server Error**: `{ "error": "The AI coach returned an invalid response format. Please try again." }`

## Testing Workflow

1. **Start Local Services:**
   ```bash
   # Terminal 1: Start MongoDB
   mongod --dbpath C:\data\db
   
   # Terminal 2: Start Backend
   cd backend
   npm start
   
   # Terminal 3: Start Frontend
   cd frontend
   npm run dev
   ```

2. **Test Authentication:**
   - Register a new user
   - Login with credentials
   - Copy JWT token from response

3. **Test Workout CRUD:**
   - Get empty workouts list
   - Add sample workouts
   - Verify workouts are returned

4. **Test AI Integration:**
   - Ensure GEMINI_API_KEY is set in backend/.env
   - Call AI recommendation endpoint
   - Verify JSON response format

## Environment Setup

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/ai-fitness-coach
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GEMINI_API_KEY=your-google-gemini-api-key
PORT=3001
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## Updated File Structure

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

## Troubleshooting

### AI Recommendation 404 Error (FIXED)
- **Issue**: `models/gemini-1.5-flash-latest is not found for API version v1beta`
- **Fix**: Changed model name from `gemini-1.5-flash-latest` to `gemini-1.5-flash` in `backend/server.js`

### MongoDB Connection Issues
- Ensure MongoDB service is running
- Check connection string in backend/.env
- Verify database name is `ai-fitness-coach`

### JWT Token Issues
- Token expires in 24 hours
- Copy full token including Bearer prefix
- Ensure no extra spaces in Authorization header

### CORS Issues
- Backend is configured for all origins during development
- Frontend API calls use proper base URL
- Check that both services are running on correct ports