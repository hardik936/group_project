# Database Models and API Configuration

## MongoDB Database Models

### User Model
The User model stores authentication and profile information.

**Schema:**
```javascript
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });
```

**Fields:**
- `username` (String, required): User's display name
- `email` (String, required, unique): User's email address for authentication
- `password` (String, required): Bcrypt hashed password
- `createdAt` (Date, auto): Account creation timestamp
- `updatedAt` (Date, auto): Last update timestamp

### Workout Model
The Workout model stores individual workout entries linked to users.

**Schema:**
```javascript
const workoutSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    exerciseName: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true }
}, { timestamps: true });
```

**Fields:**
- `user` (ObjectId, required): Reference to User who created the workout
- `exerciseName` (String, required): Name of the exercise (e.g., "Bench Press")
- `sets` (Number, required): Number of sets performed
- `reps` (Number, required): Number of repetitions per set
- `weight` (Number, required): Weight used in kg
- `createdAt` (Date, auto): Workout creation timestamp
- `updatedAt` (Date, auto): Last update timestamp

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
    "username": "string",
    "email": "string",
    "password": "string"
}
```

**Response:**
```json
{
    "user": {
        "id": "ObjectId",
        "username": "string",
        "email": "string"
    },
    "token": "jwt_token_string"
}
```

#### POST /api/auth/login
Authenticate an existing user.

**Request Body:**
```json
{
    "email": "string",
    "password": "string"
}
```

**Response:**
```json
{
    "user": {
        "id": "ObjectId",
        "username": "string",
        "email": "string"
    },
    "token": "jwt_token_string"
}
```

### Workout Endpoints

#### GET /api/workouts
Retrieve all workouts for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
    {
        "_id": "ObjectId",
        "user": "ObjectId",
        "exerciseName": "string",
        "sets": "number",
        "reps": "number",
        "weight": "number",
        "createdAt": "ISO_Date",
        "updatedAt": "ISO_Date"
    }
]
```

#### POST /api/workouts
Add a new workout for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
    "exerciseName": "string",
    "sets": "number",
    "reps": "number",
    "weight": "number"
}
```

**Response:**
```json
{
    "_id": "ObjectId",
    "user": "ObjectId",
    "exerciseName": "string",
    "sets": "number",
    "reps": "number",
    "weight": "number",
    "createdAt": "ISO_Date",
    "updatedAt": "ISO_Date"
}
```

### AI Recommendation Endpoint

#### GET /api/ai-recommendation
Get AI-generated workout plan based on user's workout history.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
    "plan": [
        {
            "day": "number",
            "focus": "string",
            "exercises": [
                {
                    "name": "string",
                    "sets": "number",
                    "reps": "string"
                }
            ]
        }
    ]
}
```

### Health Check Endpoint

#### GET /api/health
Check if the server is running.

**Response:**
```json
{
    "status": "OK",
    "message": "Server is running"
}
```

## Environment Variables

The following environment variables should be configured:

- `MONGODB_URI`: MongoDB connection string (default: `mongodb://localhost:27017/ai-fitness-coach`)
- `JWT_SECRET`: Secret key for JWT token signing (default: `your-secret-key-change-in-production`)
- `GEMINI_API_KEY`: Google Gemini API key for AI workout generation
- `PORT`: Server port (default: 3001)

## Security Features

- **Password Hashing**: Passwords are hashed using bcryptjs with salt rounds of 10
- **JWT Authentication**: All protected routes require a valid JWT token
- **CORS Configuration**: Cross-Origin Resource Sharing is properly configured
- **Input Validation**: All API endpoints validate required fields
- **Database Indexing**: User email field has unique constraint to prevent duplicates