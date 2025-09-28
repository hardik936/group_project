import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const DumbbellIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.2929 10.2929L19 8L16.7071 10.2929C17.0913 10.9231 17.2905 11.6493 17.25 12.38C17.2095 13.1107 16.93 13.8051 16.4542 14.3792C15.9785 14.9534 15.3331 15.3853 14.6213 15.6139C13.9095 15.8425 13.1623 15.8583 12.4545 15.66C11.7468 15.4618 11.1098 15.0594 10.63 14.5L7.5 17.63L2.37 12.5L7.5 7.37L10.63 10.5C10.081 10.992 9.68916 11.6212 9.50283 12.3164C9.31651 13.0116 9.3426 13.7469 9.57867 14.4257C9.81474 15.1044 10.2504 15.6997 10.8247 16.1432C11.399 16.5867 12.0837 16.8582 12.795 16.92C13.5063 16.9817 14.2238 16.8306 14.85 16.49L17 18.64L21.14 14.5L18.5 11.86C19.0186 11.362 19.3871 10.7412 19.5722 10.0632C19.7573 9.38523 19.7533 8.67384 19.5607 7.99477C19.3681 7.3157 18.9953 6.69733 18.4831 6.20847C17.9709 5.71961 17.3392 5.37953 16.655 5.225L18 3.88L22.12 8.0L21.2929 8.82843V8.82843C21.6834 9.21895 21.8789 9.75848 21.8789 10.3137C21.8789 10.8689 21.6834 11.4084 21.2929 11.7989L23 13.5L19.5 17L17.7071 15.2071L16.29 16.62L18.5 18.83L12.37 24.95L1 13.58L6.13 8.45L4.5 6.82L1.5 9.81L2.81 11.12L0 13.94L11.31 25.25L24.24 12.32L21.2929 10.2929Z"/>
    </svg>
);


const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-dark-800 shadow-lg">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2 text-white hover:text-primary transition-colors">
              <DumbbellIcon className="h-8 w-8 text-primary"/>
              <span className="text-xl font-bold">AI Fitness Coach</span>
            </Link>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-dark-200 hidden sm:block">Welcome, {user.username}!</span>
                <button
                  onClick={logout}
                  className="bg-primary text-dark-900 font-bold py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <Link
                    to="/login"
                    className="text-dark-200 font-bold py-2 px-4 rounded-md hover:bg-dark-700 transition-colors"
                    >
                    Sign In
                    </Link>
                    <Link
                    to="/register"
                    className="bg-primary text-dark-900 font-bold py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
                    >
                    Sign Up
                    </Link>
                </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
