import { User, Workout, AIWorkoutPlan } from '../types';

// Get the API base URL from environment or use default
const getApiBaseUrl = () => {
    if (typeof window !== 'undefined' && window.location.hostname.includes('replit.dev')) {
        // In Replit environment, use the same host but port 3001
        return `https://${window.location.hostname.replace('-00-', '-01-')}/api`.replace(':5000', ':3001');
    }
    return 'http://localhost:3001/api';
};

const API_BASE_URL = getApiBaseUrl();

// API Functions

export const API_login = async (email: string, password: string): Promise<{ user: User, token: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
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
    const response = await fetch(`${API_BASE_URL}/workouts`, {
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
    const response = await fetch(`${API_BASE_URL}/workouts`, {
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

export const API_getAIRecommendation = async (token: string, forceRefresh: boolean): Promise<AIWorkoutPlan> => {
    const response = await fetch(`${API_BASE_URL}/ai-recommendation`, {
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