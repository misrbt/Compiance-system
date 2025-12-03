import { useForm, Link, Head } from "@inertiajs/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Lock, LogIn, UserPlus, Eye, EyeOff, Shield } from "lucide-react";
import LogoCompany from "@/components/LogoCompany";
export default function Login({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post("/login");
    };

    return (
        <>
            <Head title="Login" />
            <div className="flex flex-col min-h-screen md:flex-row">
                {/* Left Side - Branding (Hidden on Mobile) */}
                <LogoCompany />

                {/* Right Side - Login Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col items-center justify-center w-full p-8 md:w-1/2 bg-gray-50"
                >
                    <div className="w-full max-w-md space-y-8">
                        {/* Mobile Logo - Only visible on small screens */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center mb-6 md:hidden"
                        >
                            <img
                                src="/images/logos.png"
                                alt="RBT Bank Inc Logo"
                                className="object-contain w-24 h-24 mb-4"
                            />
                            <h2 className="text-xl font-bold text-[#002868]">
                                RBT Compliance System
                            </h2>
                            <p className="mt-1 text-xs text-gray-600">
                                BSP-Regulated Compliance Platform
                            </p>
                        </motion.div>

                        {/* Form Header - Hidden on mobile */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="hidden text-center md:block"
                        >
                            <h2 className="text-4xl font-bold text-gray-900">
                                Welcome Back
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Sign in to your account
                            </p>
                        </motion.div>

                        {status && (
                            <div className="p-4 text-green-800 border-l-4 border-green-600 rounded-md bg-green-50">
                                <p className="font-medium">{status}</p>
                            </div>
                        )}

                        {/* Login Form */}
                        <motion.form
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            onSubmit={submit}
                            className="p-8 space-y-6 bg-white shadow-lg rounded-xl"
                        >
                            {/* Email Field */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-bold text-gray-700"
                                >
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Mail className="h-5 w-5 text-[#002868]" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002868] focus:border-[#002868] transition-all"
                                        placeholder="your.email@rbtbank.com"
                                        required
                                    />
                                </div>
                                {errors.email && (
                                    <p className="flex items-center gap-1 mt-2 text-sm text-red-600">
                                        <span className="font-bold">⚠</span>{" "}
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-bold text-gray-700"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Lock className="h-5 w-5 text-[#002868]" />
                                    </div>
                                    <input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002868] focus:border-[#002868] transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#002868]"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="flex items-center gap-1 mt-2 text-sm text-red-600">
                                        <span className="font-bold">⚠</span>{" "}
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                    className="w-4 h-4 text-blue-900 border-gray-300 rounded focus:ring-blue-900"
                                />
                                <label
                                    htmlFor="remember"
                                    className="block ml-2 text-sm font-medium text-gray-700"
                                >
                                    Remember me
                                </label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-[#002868] to-[#003580] hover:from-[#003580] hover:to-[#004a99] text-white py-3 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="animate-spin">⏳</span>{" "}
                                        Logging in...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <LogIn className="w-5 h-5" /> Sign In
                                    </span>
                                )}
                            </Button>
                        </motion.form>

                        {/* Footer */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="space-y-1 text-sm text-center text-gray-500"
                        >
                            <p>
                                © {new Date().getFullYear()}{" "}
                                <span className="font-bold text-gray-700">
                                    RBT Bank Inc.
                                </span>
                            </p>
                            <p>
                                Powered by:{" "}
                                <span className="font-semibold text-[#002868]">
                                    MIS Department
                                </span>
                            </p>
                            <p className="text-xs">
                                Designed & Developed by Augustin Maputol
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
