import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { signupApi } from '../../services/apiService.ts/authApiService';
import { useNavigate } from 'react-router-dom';

const SignupForm: React.FC = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);


      const handleSubmit = async (values:{name:string,email:string,password:string}) =>{
        try{

            const response = await signupApi(values)

            if(response.data){
                toast.success(response.data.message ||'success',
                         {
                         duration: 2000,
                        }
                )
            }
            navigate('/login')
            
        }catch(error:unknown){
            if(error instanceof AxiosError){
                toast.error(error.response?.data.message || 'error to signup',{
                    duration:2000
                })
            }else{
                toast.error('error to signup',{
                    duration:2000
                })
                
            }
            navigate('/login')
            console.log('error to singup :-',error)
        }
    }





    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(3, 'Name must be at least 3 characters')
                .required('Full name is required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
        }),
        onSubmit: (values) => {
            handleSubmit(values)
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
                        id="name"
                        name="name"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        className={`block w-full pl-11 pr-4 py-2.5 bg-white border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all ${
                            formik.touched.name && formik.errors.name 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-gray-200 focus:border-blue-500'
                        }`}
                        placeholder="John Doe"
                    />
                </div>
                {formik.touched.name && formik.errors.name && (
                    <div className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{formik.errors.name}</div>
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
                        type={showPassword ? 'text' : 'password'}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        className={`block w-full pl-11 pr-12 py-2.5 bg-white border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all ${
                            formik.touched.password && formik.errors.password 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-gray-200 focus:border-blue-500'
                        }`}
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
                    >
                        {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                    </button>
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
