import { EyeIcon, ViewOffSlashIcon } from 'hugeicons-react';
import { useState } from 'react';
import { axiosPublic } from '../../../libs/instance';
import toast from 'react-hot-toast';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
    const { t } = useTranslation()
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        try {
            const res = await axiosPublic.post('/auth/login', {
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

            Cookies.set("access_token", access_token, {
                expires: expires_in / 86400,
                secure: true,
                sameSite: "strict",
            });
            Cookies.set("refresh_token", refresh_token, {
                expires: 7,
                secure: true,
                sameSite: "strict",
            });
            Cookies.set("user", JSON.stringify(user), {
                expires: 7,
                secure: true,
                sameSite: "strict",
            });
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
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-12 items-center justify-center relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-[-60px] left-[-60px] w-72 h-72 bg-white/10 rounded-full" />
                <div className="absolute bottom-[-80px] right-[-40px] w-96 h-96 bg-white/10 rounded-full" />
                <div className="absolute top-1/2 right-12 w-40 h-40 bg-white/5 rounded-full" />

                <div className="text-white max-w-md z-10">
                    <div className="flex items-center gap-2 mb-8">
                        {/* Icon */}
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <span className="text-lg font-semibold tracking-wide">AssetMS</span>
                    </div>

                    <p className="text-sm mb-3 text-blue-200 uppercase tracking-widest font-medium">
                        Asset Management System
                    </p>
                    <h1 className="text-3xl font-bold leading-snug mb-4">
                        Track, manage, and optimize all your company assets in one place.
                    </h1>
                    <p className="text-blue-100 text-sm leading-relaxed">
                        From procurement to disposal — gain full visibility and control over your organization's assets with ease.
                    </p>

                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-2 mt-8">
                        {['Asset Tracking', 'Maintenance Logs', 'Approval Flows', 'Branch Management'].map((f) => (
                            <span key={f} className="px-3 py-1 bg-white/15 rounded-full text-xs font-medium text-white">
                                {f}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="flex lg:hidden items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold text-gray-800">AssetMS</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                            {t('Login')}
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Sign in to your account to manage and monitor your assets.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="space-y-5">
                        {/* Username Input */}
                        <div>
                            <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-2">
                                Username or Email
                            </label>
                            <input
                                type="text"
                                id="email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username or email"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 text-sm"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 pr-12 text-sm"
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
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                        >
                            Sign In to Dashboard
                        </button>
                    </div>

                    {/* Footer note */}
                    <p className="mt-8 text-center text-xs text-gray-400">
                        Access is restricted to authorized personnel only. <br />
                        Contact your system administrator if you need access.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;