import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/LockOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const SignupForm: React.FC = () => {
    const formik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            phone: '',
            password: '',
        },
        validationSchema: Yup.object({
            fullName: Yup.string()
                .min(3, 'Name must be at least 3 characters')
                .required('Full name is required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            phone: Yup.string()
                .matches(/^\d{10}$/, 'Phone number must be 10 digits')
                .required('Phone number is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
        }),
        onSubmit: (values) => {
            console.log('Signup values:', values);
            // Handle registration logic here
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-1 focus-within:text-blue-600 transition-colors">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <PersonIcon sx={{ fontSize: 20 }} />
                    </div>
                    <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.fullName}
                        className={`block w-full pl-11 pr-4 py-2.5 bg-white border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all ${
                            formik.touched.fullName && formik.errors.fullName 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-gray-200 focus:border-blue-500'
                        }`}
                        placeholder="John Doe"
                    />
                </div>
                {formik.touched.fullName && formik.errors.fullName && (
                    <div className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{formik.errors.fullName}</div>
                )}
            </div>

            {/* Email Field */}
            <div className="space-y-1 focus-within:text-blue-600 transition-colors">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email address</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <EmailIcon sx={{ fontSize: 20 }} />
                    </div>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        className={`block w-full pl-11 pr-4 py-2.5 bg-white border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all ${
                            formik.touched.email && formik.errors.email 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-gray-200 focus:border-blue-500'
                        }`}
                        placeholder="name@example.com"
                    />
                </div>
                {formik.touched.email && formik.errors.email && (
                    <div className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{formik.errors.email}</div>
                )}
            </div>

            {/* Phone Number Field */}
            {/* <div className="space-y-1 focus-within:text-blue-600 transition-colors">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <PhoneIcon sx={{ fontSize: 20 }} />
                    </div>
                    <input
                        id="phone"
                        name="phone"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                        className={`block w-full pl-11 pr-4 py-2.5 bg-white border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all ${
                            formik.touched.phone && formik.errors.phone 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-gray-200 focus:border-blue-500'
                        }`}
                        placeholder="1234567890"
                    />
                </div>
                {formik.touched.phone && formik.errors.phone && (
                    <div className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{formik.errors.phone}</div>
                )}
            </div> */}

            {/* Password Field */}
            <div className="space-y-1 focus-within:text-blue-600 transition-colors">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
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
                        className={`block w-full pl-11 pr-4 py-2.5 bg-white border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all ${
                            formik.touched.password && formik.errors.password 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-gray-200 focus:border-blue-500'
                        }`}
                        placeholder="••••••••"
                    />
                </div>
                {formik.touched.password && formik.errors.password && (
                    <div className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{formik.errors.password}</div>
                )}
            </div>

            <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 uppercase text-sm tracking-widest"
            >
                {formik.isSubmitting ? 'Creating...' : 'Create Account'}
                <ArrowForwardIcon sx={{ fontSize: 20 }} />
            </button>
        </form>
    );
};

export default SignupForm;
