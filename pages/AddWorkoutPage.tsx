
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { API_addWorkout } from '../services/api';

const AddWorkoutPage: React.FC = () => {
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
        setError("You are not authenticated.");
        return;
    }
    setError(null);
    setLoading(true);

    const workoutData = {
      exerciseName,
      sets: parseInt(sets, 10),
      reps: parseInt(reps, 10),
      weight: parseFloat(weight),
      // Note: Backend will use default createdAt, date field is for user input demonstration.
    };

    try {
      await API_addWorkout(token, workoutData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save workout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl">
      <div className="bg-dark-800 rounded-lg shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-dark-100 mb-8">Log New Workout</h2>
        
        {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-md mb-6 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-dark-200 text-sm font-bold mb-2" htmlFor="exerciseName">
              Exercise Name
            </label>
            <input
              id="exerciseName" type="text" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-dark-700 border border-dark-700 rounded-md text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Bench Press"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <label className="block text-dark-200 text-sm font-bold mb-2" htmlFor="sets">Sets</label>
                <input
                  id="sets" type="number" value={sets} onChange={(e) => setSets(e.target.value)}
                  required min="1"
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-700 rounded-md text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., 4"
                />
            </div>
            <div>
                <label className="block text-dark-200 text-sm font-bold mb-2" htmlFor="reps">Reps</label>
                <input
                  id="reps" type="number" value={reps} onChange={(e) => setReps(e.target.value)}
                  required min="1"
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-700 rounded-md text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., 10"
                />
            </div>
            <div>
                <label className="block text-dark-200 text-sm font-bold mb-2" htmlFor="weight">Weight (kg)</label>
                <input
                  id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
                  required min="0" step="0.5"
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-700 rounded-md text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., 100"
                />
            </div>
          </div>

          <div>
            <label className="block text-dark-200 text-sm font-bold mb-2" htmlFor="date">Date</label>
            <input
              id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 bg-dark-700 border border-dark-700 rounded-md text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit" disabled={loading}
              className="w-full bg-primary text-dark-900 font-bold py-3 px-4 rounded-md hover:bg-primary-dark transition-colors disabled:bg-gray-500"
            >
              {loading ? 'Saving...' : 'Save Workout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWorkoutPage;
