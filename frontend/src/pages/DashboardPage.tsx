
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Workout, AIWorkoutPlan } from '../types';
import { API_getWorkouts, API_getAIRecommendation } from '../services/api';

const PlusIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
    </svg>
);

const DumbbellIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 3a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 0110 3zM6.25 7.5a.75.75 0 00-1.5 0v1.5h-1.5a.75.75 0 000 1.5h1.5v1.5a.75.75 0 001.5 0v-1.5h1.5a.75.75 0 000-1.5h-1.5v-1.5zM13.75 7.5a.75.75 0 00-1.5 0v1.5h-1.5a.75.75 0 000 1.5h1.5v1.5a.75.75 0 001.5 0v-1.5h1.5a.75.75 0 000-1.5h-1.5v-1.5z"></path><path fillRule="evenodd" d="M5.5 1A2.5 2.5 0 003 3.5v13A2.5 2.5 0 005.5 19h9a2.5 2.5 0 002.5-2.5v-13A2.5 2.5 0 0014.5 1h-9zM4.5 3.5a1 1 0 011-1h9a1 1 0 011 1v13a1 1 0 01-1 1h-9a1 1 0 01-1-1v-13z" clipRule="evenodd"></path>
    </svg>
);


const DashboardPage: React.FC = () => {
    const { token } = useAuth();
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [aiPlan, setAiPlan] = useState<AIWorkoutPlan | null>(null);
    const [loading, setLoading] = useState({ workouts: true, ai: true });
    const [error, setError] = useState({ workouts: '', ai: '' });
    
    const fetchWorkouts = useCallback(async () => {
        if (!token) return;
        setLoading(prev => ({ ...prev, workouts: true }));
        try {
            const data = await API_getWorkouts(token);
            setWorkouts(data);
        } catch (err: any) {
            setError(prev => ({ ...prev, workouts: 'Failed to fetch workouts.' }));
        } finally {
            setLoading(prev => ({ ...prev, workouts: false }));
        }
    }, [token]);
    
    const fetchAiPlan = useCallback(async (forceRefresh = false) => {
        if (!token) return;
        setLoading(prev => ({ ...prev, ai: true }));
        setError(prev => ({...prev, ai: ''}));
        try {
            const data = await API_getAIRecommendation(token, forceRefresh);
            setAiPlan(data);
        } catch (err: any) {
            setError(prev => ({ ...prev, ai: err.message || 'Failed to generate AI plan.' }));
        } finally {
            setLoading(prev => ({ ...prev, ai: false }));
        }
    }, [token]);

    useEffect(() => {
        fetchWorkouts();
        fetchAiPlan();
    }, [fetchWorkouts, fetchAiPlan]);

  return (
    <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* AI Plan Section */}
            <div className="lg:col-span-2">
                <div className="bg-dark-800 p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-dark-100">Your AI-Generated Workout Plan</h2>
                        <button 
                            onClick={() => fetchAiPlan(true)}
                            disabled={loading.ai}
                            className="bg-primary text-dark-900 font-bold py-2 px-4 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
                        >
                            {loading.ai ? 'Generating...' : 'Generate New Plan'}
                        </button>
                    </div>
                    {error.ai && <p className="text-red-400">{error.ai}</p>}
                    {loading.ai ? (
                         <div className="text-center p-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-dark-200">Our AI coach is crafting your plan...</p>
                        </div>
                    ) : aiPlan && aiPlan.plan ? (
                        <div className="space-y-4">
                            {aiPlan.plan.map(day => (
                                <div key={day.day} className="bg-dark-900 rounded-lg shadow-md transition-all hover:shadow-primary/10 border border-dark-700">
                                    <div className="p-4 border-b border-dark-700">
                                         <h3 className="text-xl font-bold text-primary">
                                            Day {day.day}: <span className="text-dark-100">{day.focus}</span>
                                         </h3>
                                    </div>
                                    <div className="p-4">
                                        <ul className="space-y-3">
                                            {day.exercises.map((ex, index) => (
                                                <li key={`${ex.name}-${index}`} className="flex items-center justify-between p-3 bg-dark-800 rounded-md">
                                                    <span className="font-medium text-dark-200">{ex.name}</span>
                                                    <span className="font-mono text-primary bg-dark-900/50 px-3 py-1 rounded-full text-sm">
                                                        {ex.sets} &times; {ex.reps}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-dark-200">No AI plan available. Generate one to get started!</p>
                    )}
                </div>
            </div>

            {/* Recent Workouts Section */}
            <div>
                <div className="bg-dark-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-dark-100 mb-4">Recent Workouts</h2>
                    {loading.workouts ? (
                        <p className="text-dark-200">Loading recent workouts...</p>
                    ) : error.workouts ? (
                        <p className="text-red-400">{error.workouts}</p>
                    ) : workouts.length > 0 ? (
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                            {workouts.slice(0, 5).map(w => (
                                <div key={w._id} className="bg-dark-700 p-4 rounded-md flex items-start space-x-4">
                                    <DumbbellIcon className="h-6 w-6 text-primary mt-1"/>
                                    <div>
                                        <p className="font-bold text-dark-100">{w.exerciseName}</p>
                                        <p className="text-sm text-dark-200">{w.sets} sets x {w.reps} reps @ {w.weight} kg</p>
                                        <p className="text-xs text-gray-400">{new Date(w.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-dark-200">No workouts logged yet. Add one to see it here!</p>
                    )}
                </div>
            </div>
        </div>

        <Link
            to="/add-workout"
            className="fixed bottom-8 right-8 bg-primary text-dark-900 rounded-full p-4 shadow-lg hover:bg-primary-dark transition-transform hover:scale-110"
            aria-label="Log New Workout"
        >
            <PlusIcon className="h-8 w-8"/>
        </Link>
    </div>
  );
};

export default DashboardPage;