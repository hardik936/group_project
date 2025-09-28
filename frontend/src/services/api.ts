import { User, Workout, AIWorkoutPlan } from '../types';

// API Base URL configuration for development vs production
// In production (Render), frontend and backend are served from same domain
// In development, backend runs on localhost:3001
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD ? '' : 'http://localhost:3001');

// API Functions

export const API_login = async (email: string, password: string): Promise<{ user: User, token: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
    }

    return response.json();
};

export const API_register = async (username: string, email: string, password: string): Promise<{ user: User, token: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
    }

    return response.json();
};

export const API_getWorkouts = async (token: string): Promise<Workout[]> => {
    const response = await fetch(`${API_BASE_URL}/api/workouts`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch workouts');
    }

    return response.json();
};

export const API_addWorkout = async (token: string, workoutData: Omit<Workout, '_id' | 'user' | 'createdAt'>): Promise<Workout> => {
    const response = await fetch(`${API_BASE_URL}/api/workouts`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add workout');
    }

    return response.json();
};

export const API_getAIRecommendation = async (token: string): Promise<AIWorkoutPlan> => {
    const response = await fetch(`${API_BASE_URL}/api/ai-recommendation`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI recommendation');
    }

    return response.json();
};