import { EyeIcon, MoonIcon, Sun01Icon, ViewOffSlashIcon } from "hugeicons-react";
import { useState } from "react";
import { axiosPublic } from "../../../libs/instance";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDarkMode } from "../../../hooks/useDarkMode";

const LoginPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { isDark, toggleDarkMode } = useDarkMode();

    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const features = [
        t("label.loginPage.featureTracking"),
        t("label.loginPage.featureMaintenance"),
        t("label.loginPage.featureApproval"),
        t("label.loginPage.featureBranch"),
    ];

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (!username || !password) {
            toast.error(t("label.loginPage.invalidCredential"));
            return;
        }

        try {
            setLoading(true);
            setErrorMsg("");

            const res = await axiosPublic.post("/auth/login", {
                username,
                password,
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

            toast.success(t("label.loginPage.successLogin"));

            navigate("/dashboard", { replace: true });
        } catch (error) {
            const errMsg = t("label.loginPage.invalidCredential");
            setErrorMsg(errMsg);
            toast.error(errMsg);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 p-12 items-center justify-center relative overflow-hidden">
                <div className="absolute top-[-60px] left-[-60px] w-72 h-72 bg-white/10 dark:bg-white/5 rounded-full" />
                <div className="absolute bottom-[-80px] right-[-40px] w-96 h-96 bg-white/10 dark:bg-white/5 rounded-full" />
                <div className="absolute top-1/2 right-12 w-40 h-40 bg-white/5 rounded-full" />

                <div className="text-white max-w-md z-10">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-24 h-24 rounded-xl flex items-center justify-center">
                            <img
                                src="/images/logos.png"
                                alt="Logo"
                                className="w-150 h-150 object-contain"
                            />
                        </div>

                        <span className="text-lg font-semibold tracking-wide">
                            AssetMS
                        </span>
                    </div>

                    <p className="text-sm mb-3 text-blue-200 dark:text-blue-300 uppercase tracking-widest font-medium">
                        {t("label.loginPage.systemName")}
                    </p>

                    <h1 className="text-3xl font-bold leading-snug mb-4">
                        {t("label.loginPage.heroTitle")}
                    </h1>

                    <p className="text-blue-100 dark:text-slate-300 text-sm leading-relaxed">
                        {t("label.loginPage.heroDescription")}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-8">
                        {features.map((feature) => (
                            <span
                                key={feature}
                                className="px-3 py-1 bg-white/15 dark:bg-white/10 dark:ring-1 dark:ring-white/10 rounded-full text-xs font-medium text-white"
                            >
                                {feature}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white dark:bg-gray-950 relative">
                <button
                    type="button"
                    onClick={toggleDarkMode}
                    aria-label="Toggle dark mode"
                    className="absolute top-4 right-4 p-2 rounded-xl border border-zinc-300 text-gray-700 hover:bg-gray-100 dark:border-zinc-700 dark:text-gray-200 dark:hover:bg-gray-900 transition-colors"
                >
                    {isDark ? <MoonIcon className="w-5 h-5" /> : <Sun01Icon className="w-5 h-5" />}
                </button>

                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="flex lg:hidden items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <img
                                src="/images/logos.png"
                                alt="Logo"
                                className="w-5 h-5 object-contain"
                            />
                        </div>

                        <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                            AssetMS
                        </span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            {t("label.loginPage.signIn")}
                        </h2>

                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {t("label.loginPage.signInDesc")}
                        </p>
                    </div>

                    <div className="space-y-5">
                        {/* Username */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t("label.loginPage.usernameLabel")}
                            </label>

                            <input
                                data-cy="login-email"
                                type="text"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setErrorMsg("");
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder={t("label.loginPage.usernamePlaceholder")}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t("label.loginPage.passwordLabel")}
                            </label>

                            <div className="relative">
                                <input
                                    data-cy="login-password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setErrorMsg("");
                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder={t("label.loginPage.passwordPlaceholder")}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeIcon className="w-5 h-5" />
                                    ) : (
                                        <ViewOffSlashIcon className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error message */}
                        {errorMsg && (
                            <p data-cy="login-error" className="text-red-500 dark:text-red-400 text-sm">
                                {errorMsg}
                            </p>
                        )}

                        {/* Button */}
                        <button
                            data-cy="login-submit"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg dark:shadow-blue-950/50 hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                        >
                            {loading
                                ? "Loading..."
                                : t("label.loginPage.submitButton")}
                        </button>
                    </div>

                    {/* Footer */}
                    <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
                        {t("label.loginPage.restrictedAccess")}
                        <br />
                        {t("label.loginPage.contactAdmin")}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;