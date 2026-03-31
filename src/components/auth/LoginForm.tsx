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
        <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5 focus-within:text-blue-600 transition-colors">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Email address</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                        <EmailIcon sx={{ fontSize: 20 }} />
                    </div>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        className={`block w-full pl-11 pr-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all ${
                            formik.touched.email && formik.errors.email 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-100' 
                            : 'border-gray-200 focus:border-blue-500'
                        }`}
                        placeholder="name@example.com"
                    />
                </div>
                {formik.touched.email && formik.errors.email && (
                    <div className="text-red-500 text-xs mt-1 ml-1 font-medium">{formik.errors.email}</div>
                )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 focus-within:text-blue-600 transition-colors">
                <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Password</label>
                    <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">Forgot?</a>
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <LockIcon sx={{ fontSize: 20 }} />
                    </div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        className={`block w-full pl-11 pr-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all ${
                            formik.touched.password && formik.errors.password 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-100' 
                            : 'border-gray-200 focus:border-blue-500'
                        }`}
                        placeholder="••••••••"
                    />
                </div>
                {formik.touched.password && formik.errors.password && (
                    <div className="text-red-500 text-xs mt-1 ml-1 font-medium">{formik.errors.password}</div>
                )}
            </div>

            <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
                {formik.isSubmitting ? 'Signing In...' : 'Sign In'}
                <ArrowForwardIcon sx={{ fontSize: 20 }} />
            </button>
        </form>
    );
};

export default LoginForm;
