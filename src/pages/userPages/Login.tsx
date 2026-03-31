import React from 'react';
import LoginIcon from '@mui/icons-material/Login';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const Login: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
            {/* Minimal Logo Section */}
            <div className="mb-8 flex items-center gap-2 font-black text-2xl text-blue-600">
                <DirectionsCarIcon fontSize="large" />
                <span>GoTrack</span>
            </div>

            <div className="w-full max-w-[440px] animate-in fade-in zoom-in duration-300">
                {/* Standard Card */}
                <div className="bg-white border border-gray-200 rounded-[2rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome back</h1>
                        <p className="text-gray-500 text-sm font-medium">Log in to manage your vehicle travels.</p>
                    </div>

                    <LoginForm />

                    <div className="mt-10 pt-10 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500 font-medium italic">
                            New to GoTrack?{' '}
                            <Link to="/signup" className="not-italic font-black text-blue-600 hover:text-blue-700 transition-colors">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
                
                <p className="mt-8 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
                    Standard & Secure Auth System
                </p>
            </div>
        </div>
    );
};

export default Login;
