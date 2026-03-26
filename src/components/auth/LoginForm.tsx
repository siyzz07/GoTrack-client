import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/LockOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const LoginForm: React.FC = () => {
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .required('Password is required'),
        }),
        onSubmit: (values) => {
            console.log('Login values:', values);
            // Handle login logic here
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Email address</label>
                <div className="relative group transition-all duration-300">
                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${
                        formik.touched.email && formik.errors.email ? 'text-red-400' : 'text-gray-500 group-focus-within:text-[#10b981]'
                    }`}>
                        <EmailIcon sx={{ fontSize: 20 }} />
                    </div>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        className={`block w-full pl-11 pr-4 py-3.5 bg-black/40 border rounded-2xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 backdrop-blur-sm ${
                            formik.touched.email && formik.errors.email 
                            ? 'border-red-500/50 focus:ring-2 focus:ring-red-500/20 focus:border-red-500' 
                            : 'border-white/5 focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981]/50'
                        }`}
                        placeholder="name@example.com"
                    />
                </div>
                {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-400 text-xs mt-1 ml-1">{formik.errors.email}</div>
                ) : null}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-medium text-gray-300">Password</label>
                    <a href="#" className="text-xs font-semibold text-[#10b981] hover:text-emerald-400 transition-colors">Forgot Password?</a>
                </div>
                <div className="relative group transition-all duration-300">
                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${
                        formik.touched.password && formik.errors.password ? 'text-red-400' : 'text-gray-500 group-focus-within:text-[#10b981]'
                    }`}>
                        <LockIcon sx={{ fontSize: 20 }} />
                    </div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        className={`block w-full pl-11 pr-4 py-3.5 bg-black/40 border rounded-2xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 backdrop-blur-sm ${
                            formik.touched.password && formik.errors.password 
                            ? 'border-red-500/50 focus:ring-2 focus:ring-red-500/20 focus:border-red-500' 
                            : 'border-white/5 focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981]/50'
                        }`}
                        placeholder="••••••••"
                    />
                </div>
                {formik.touched.password && formik.errors.password ? (
                    <div className="text-red-400 text-xs mt-1 ml-1">{formik.errors.password}</div>
                ) : null}
            </div>

            <button
                type="submit"
                disabled={formik.isSubmitting}
                className="relative w-full py-4 px-6 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-2xl shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.4)] transform transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 overflow-hidden group border border-emerald-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="relative z-10 flex items-center gap-2 tracking-wide text-sm uppercase font-bold">
                    {formik.isSubmitting ? 'Signing In...' : 'Sign In'}
                    <ArrowForwardIcon sx={{ fontSize: 20 }} className="group-hover:translate-x-1 transition-transform" />
                </span>
            </button>
        </form>
    );
};

export default LoginForm;

