require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());


const MONGODB_URI = process.env.MONGODB_URI;
console.log("Connecting to:", MONGODB_URI);

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));


// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Workout Schema
const workoutSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    exerciseName: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true }
}, { timestamps: true });

const Workout = mongoose.model('Workout', workoutSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Auth Routes

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Workout Routes

// Get all workouts for user
app.get('/api/workouts', authenticateToken, async (req, res) => {
    try {
        const workouts = await Workout.find({ user: req.user.userId })
            .sort({ createdAt: -1 });
        
        // Format workouts to match frontend expectations
        const formattedWorkouts = workouts.map(workout => ({
            _id: workout._id,
            user: workout.user,
            exerciseName: workout.exerciseName,
            sets: workout.sets,
            reps: workout.reps,
            weight: workout.weight,
            createdAt: workout.createdAt
        }));

        res.json(formattedWorkouts);
    } catch (error) {
        console.error('Get workouts error:', error);
        res.status(500).json({ error: 'Server error fetching workouts' });
    }
});

// Add new workout
app.post('/api/workouts', authenticateToken, async (req, res) => {
    try {
        const { exerciseName, sets, reps, weight } = req.body;

        const workout = new Workout({
            user: req.user.userId,
            exerciseName,
            sets,
            reps,
            weight
        });

        await workout.save();

        // Format workout to match frontend expectations
        const formattedWorkout = {
            _id: workout._id,
            user: workout.user,
            exerciseName: workout.exerciseName,
            sets: workout.sets,
            reps: workout.reps,
            weight: workout.weight,
            createdAt: workout.createdAt
        };

        res.status(201).json(formattedWorkout);
    } catch (error) {
        console.error('Add workout error:', error);
        res.status(500).json({ error: 'Server error adding workout' });
    }
});

// NEW AI RECOMMENDATION ROUTE POWERED BY GROQ
app.get('/api/ai-recommendation', authenticateToken, async (req, res) => {
    console.log("--- Groq AI Recommendation Request Received ---");
    try {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            console.error("CRITICAL: GROQ_API_KEY is not loaded from .env file!");
            return res.status(500).json({ error: "AI Coach is not configured. The API key is missing." });
        }

        // Get user's recent workouts
        const recentWorkouts = await Workout.find({ user: req.user.userId })
            .sort({ createdAt: -1 })
            .limit(10);

        const workoutHistory = recentWorkouts.map(w =>
            `- ${w.exerciseName}: ${w.sets} sets of ${w.reps} reps at ${w.weight}kg on ${new Date(w.createdAt).toLocaleDateString()}`
        ).join('\n');

        const prompt = `
            You are an expert fitness coach. Based on the user's recent workout history, create a new personalized 3-day workout plan designed to promote muscle growth and strength.

            User's recent workouts:
            ${workoutHistory || "The user has no logged workouts yet. Please create a balanced, beginner-friendly 3-day full-body workout plan."}

            Instructions:
            1. Create a plan for 3 distinct days.
            2. Each day should have a clear focus (e.g., "Push Day", "Pull Day", "Leg Day", or "Full Body A").
            3. Include 3-5 exercises per day.
            4. Provide a reasonable number of sets and a rep range (e.g., "8-12 reps").
            5. Ensure the plan is balanced and targets major muscle groups over the 3 days.

            Return ONLY the raw JSON object for the plan. Do not include markdown, introductory text, or any other explanations. Your entire response must be a single, valid JSON object starting with { and ending with }.
            Example format: { "plan": [ { "day": 1, "focus": "...", "exercises": [...] } ] }
        `;

        // 1. Import and initialize the Groq client
        const Groq = require('groq-sdk');
        const groq = new Groq({ apiKey });

        console.log("Attempting to use Groq AI model: llama-3.1-8b-instant");

        // 2. Call the Groq API
        const chatCompletion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",   // ✅ free + active model
            response_format: { type: "json_object" }, // ✅ ensures valid JSON
            messages: [
                {
                    role: "system",
                    content: "You are a helpful AI fitness coach. Always return responses as valid JSON only."
                },
                {
                    role: "user",
                    content: prompt,
                }
            ],
        });

        // 3. Extract AI response
        const responseText = chatCompletion.choices[0]?.message?.content || "";
        console.log("Raw AI Response:", responseText);

        // 4. Parse safely
        let parsedPlan;
        try {
            parsedPlan = JSON.parse(responseText);
        } catch (parseError) {
            console.error("Failed to parse AI response:", parseError);
            return res.status(500).json({ error: "AI response was not valid JSON. Please try again." });
        }

        // 5. Validate structure
        if (!parsedPlan.plan || !Array.isArray(parsedPlan.plan)) {
            console.error("Parsed JSON missing 'plan':", parsedPlan);
            return res.status(500).json({ error: "The AI coach generated a plan in an unexpected format. Please try again." });
        }

        // 6. Success
        res.json(parsedPlan);

    } catch (error) {
        console.error("Error in /api/ai-recommendation:", error);
        res.status(500).json({ error: "The AI coach could not generate a plan. Please try again later." });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});