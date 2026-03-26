import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';
import SignupForm from '../../components/auth/SignupForm';

const Signup: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#0A0F0D] flex items-center justify-center p-4 selection:bg-[#10b981] selection:text-white font-sans overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[100%] bg-[#10b981]/10 blur-[120px] rounded-full transition-transform duration-1000"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[100%] bg-emerald-900/10 blur-[120px] rounded-full transition-transform duration-1000"></div>
            </div>

            <div className="relative w-full max-w-[480px] animate-in fade-in zoom-in duration-500">
                {/* Registration Card */}
                <div className="bg-[#121916]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#10b981] to-[#059669] mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                            <PersonIcon className="text-white" sx={{ fontSize: 32 }} />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h1>
                        <p className="text-gray-400 text-sm">Join our platform and start managing your travels effortlessly</p>
                    </div>

                    <SignupForm />

                    <p className="mt-8 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-[#10b981] hover:text-emerald-400 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
