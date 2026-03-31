import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';
import SignupForm from '../../components/auth/SignupForm';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const Signup: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
            {/* Minimal Logo Section */}
            <div className="mb-8 flex items-center gap-2 font-black text-2xl text-blue-600">
                <DirectionsCarIcon fontSize="large" />
                <span>GoTrack</span>
            </div>

            <div className="w-full max-w-[480px] animate-in fade-in zoom-in duration-300">
                {/* Registration Card */}
                <div className="bg-white border border-gray-200 rounded-[2rem] p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Create Account</h1>
                        <p className="text-gray-500 text-sm font-medium">Join GoTrack to start managing travels.</p>
                    </div>

                    <SignupForm />

                    <div className=" pt-10 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500 font-medium italic">
                            Already have an account?{' '}
                            <Link to="/login" className="not-italic font-black text-blue-600 hover:text-blue-700 transition-colors">
                                Log in instead
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
