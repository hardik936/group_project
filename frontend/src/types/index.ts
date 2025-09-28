
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Workout {
  _id: string;
  user: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number;
  createdAt: string;
}

export interface AIExercise {
  name: string;
  sets: number;
  reps: string;
}

export interface AIDailyPlan {
  day: number;
  focus: string;
  exercises: AIExercise[];
}

export interface AIWorkoutPlan {
  plan: AIDailyPlan[];
}
