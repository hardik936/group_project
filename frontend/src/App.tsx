
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AddWorkoutPage from './pages/AddWorkoutPage';

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      {user ? (
        // --- Authenticated Routes ---
        <>
          <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
          <Route path="/add-workout" element={<Layout><AddWorkoutPage /></Layout>} />
          {/* Redirect from root or any other unknown path to the user's dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      ) : (
        // --- Unauthenticated Routes ---
        <>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Redirect any other unknown path to the landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
}

export default App;