import { User, Workout, AIWorkoutPlan } from '../types';

// --- MOCK DATABASE (Authentication and Workout Data) ---
const mockUsers: { [email: string]: any } = {
  'user@example.com': {
    id: '1',
    username: 'TestUser',
    email: 'user@example.com',
    passwordHash: 'hashed_password'
  }
};

let mockWorkouts: Workout[] = [
    { _id: 'w1', user: '1', exerciseName: 'Bench Press', sets: 4, reps: 8, weight: 100, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { _id: 'w2', user: '1', exerciseName: 'Squat', sets: 3, reps: 10, weight: 120, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { _id: 'w3', user: '1', exerciseName: 'Deadlift', sets: 1, reps: 5, weight: 150, createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
    { _id: 'w4', user: '1', exerciseName: 'Overhead Press', sets: 4, reps: 8, weight: 60, createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
];


// --- MOCK API FUNCTIONS (Authentication and Workout CRUD) ---

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const MOCK_API_login = async (email: string, password: string): Promise<{ user: User, token: string }> => {
  await delay(1000);
  const user = mockUsers[email];
  if (user && password) {
    return {
      user: { id: user.id, username: user.username, email: user.email },
      token: 'mock-jwt-token'
    };
  }
  throw new Error('Invalid credentials');
};

export const MOCK_API_register = async (username: string, email: string, password: string): Promise<{ user: User, token: string }> => {
    await delay(1000);
    if(mockUsers[email]) {
        throw new Error('User with this email already exists.');
    }
    const newUser = {
        id: Math.random().toString(36).substring(7),
        username,
        email,
        passwordHash: 'hashed_' + password,
    };
    mockUsers[email] = newUser;
    return {
        user: { id: newUser.id, username: newUser.username, email: newUser.email },
        token: 'mock-jwt-token-new-user'
    }
}

export const MOCK_API_getWorkouts = async (token: string): Promise<Workout[]> => {
  await delay(800);
  if (token !== 'mock-jwt-token' && token !== 'mock-jwt-token-new-user') throw new Error('Unauthorized');
  return [...mockWorkouts].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const MOCK_API_addWorkout = async (token: string, workoutData: Omit<Workout, '_id' | 'user' | 'createdAt'>): Promise<Workout> => {
    await delay(1000);
    if (token !== 'mock-jwt-token' && token !== 'mock-jwt-token-new-user') throw new Error('Unauthorized');
    const newWorkout: Workout = {
        _id: 'w' + (mockWorkouts.length + 1),
        user: '1',
        ...workoutData,
        createdAt: new Date().toISOString()
    }
    mockWorkouts.push(newWorkout);
    return newWorkout;
}

// --- REAL GEMINI API IMPLEMENTATION ---

// Store the AI client instance in a singleton pattern.
let aiClientInstance: any = null;

// Asynchronously gets the AI client. This uses a dynamic import to prevent
// the entire app from crashing on load if the @google/genai library
// has top-level code that is incompatible with the browser environment.
const getAiClient = async () => {
    if (!aiClientInstance) {
        const { GoogleGenAI } = await import('@google/genai');
        // Safely access the API key to prevent 'process is not defined' error in browser.
        const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

        if (!apiKey) {
            console.error("API_KEY environment variable not set. AI features will be disabled.");
            throw new Error("AI Coach is not configured. The API key is missing.");
        }
        aiClientInstance = new GoogleGenAI({ apiKey });
    }
    return aiClientInstance;
};


export const MOCK_API_getAIRecommendation = async (token: string, forceRefresh: boolean): Promise<AIWorkoutPlan> => {
  if (!token) throw new Error('Unauthorized');

  // Get user's recent workouts to provide context to the model.
  const recentWorkouts = await MOCK_API_getWorkouts(token);
  const workoutHistory = recentWorkouts.slice(0, 10).map(w =>
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

    Return ONLY the JSON object for the plan.
  `;
  
  try {
    const { Type } = await import('@google/genai');
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
          plan: {
            type: Type.ARRAY,
            description: "The array of daily workout plans.",
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.INTEGER, description: "The day number of the plan." },
                focus: { type: Type.STRING, description: "The main focus of the day's workout." },
                exercises: {
                  type: Type.ARRAY,
                  description: "A list of exercises for the day.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "The name of the exercise." },
                      sets: { type: Type.INTEGER, description: "The number of sets." },
                      reps: { type: Type.STRING, description: "The repetition range (e.g., '8-12')." }
                    },
                    required: ["name", "sets", "reps"]
                  }
                }
              },
              required: ["day", "focus", "exercises"]
            }
          }
        },
        required: ["plan"]
      };

    const aiClient = await getAiClient();
    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    const parsedPlan = JSON.parse(jsonText);
    
    if (!parsedPlan.plan || !Array.isArray(parsedPlan.plan)) {
        throw new Error("AI response is missing the 'plan' array.");
    }
    
    return parsedPlan as AIWorkoutPlan;

  } catch (error: any) {
    console.error("Error generating AI workout plan:", error);
    // Pass along a more user-friendly message, while logging the original error.
    if (error.message.includes("API key is missing")) {
        throw error;
    }
    throw new Error(`The AI coach could not generate a plan. Please try again later.`);
  }
};