import { EyeIcon, ViewOffSlashIcon } from 'hugeicons-react';
import { useState } from 'react';
import { axiosPublic } from '../../../libs/instance';
import toast from 'react-hot-toast';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        try {
            const res = await axiosPublic.post('/api/v1/auth/login', {
                username: username,
                password: password,
            });
            const {
                access_token,
                refresh_token,
                expires_in,
                user,
                token_type,
            } = res.data.data;

            // access token (short lived)
            Cookies.set("access_token", access_token, {
                expires: expires_in / 86400, // detik -> hari
                secure: true,
                sameSite: "strict",
            });

            // refresh token (lebih lama)
            Cookies.set("refresh_token", refresh_token, {
                expires: 7, // 7 hari (adjust sesuai kebutuhan)
                secure: true,
                sameSite: "strict",
            });

            // optional: simpan user info
            Cookies.set("user", JSON.stringify(user), {
                expires: 7,
                secure: true,
                sameSite: "strict",
            });

            // optional: token type
            Cookies.set("token_type", token_type, {
                expires: 7,
                secure: true,
                sameSite: "strict",
            });

            toast.success("Login berhasil");
            navigate("/dashboard", { replace: true });
        } catch (error) {
            toast.error('Login gagal');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Section - Hidden on mobile */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-400 via-purple-400 to-blue-500 p-12 items-center justify-center relative overflow-hidden">

                <div className="text-white max-w-md z-10">
                    <p className="text-lg mb-4 opacity-90">You can easily</p>
                    <h1 className="text-5xl font-bold leading-tight">
                        Get access your personal hub for clarity and productivity
                    </h1>
                </div>
            </div>

            {/* Right Section - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
                <div className="w-full max-w-md">
                    {/* Logo for mobile */}
                    {/* <div className="lg:hidden mb-8 flex justify-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                            <span className="text-white text-3xl font-bold">*</span>
                        </div>
                    </div> */}

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            {/* <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center lg:hidden">
                                <span className="text-white text-xl font-bold">*</span>
                            </div> */}
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Login</h2>
                        </div>
                        <p className="text-gray-500 text-sm lg:text-base">
                            Access your tasks, notes, and projects anytime, anywhere - and keep everything flowing in one place.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Your email
                            </label>
                            <input
                                type="text"
                                id="email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="example@mail.com"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeIcon className="w-5 h-5" />
                                    ) : (
                                        <ViewOffSlashIcon className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Get Started
                        </button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">or continue with</span>
                            </div>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-semibold text-gray-700">Internal</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Sign Up Link */}
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;