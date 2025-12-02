import { useForm, Link, Head } from "@inertiajs/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    User,
    Mail,
    Lock,
    UserPlus,
    Eye,
    EyeOff,
    Check,
    X,
} from "lucide-react";
import LogoCompany from "@/components/LogoCompany";

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    // Password policy validation
    const passwordRequirements = {
        minLength: data.password.length >= 8,
        hasUppercase: /[A-Z]/.test(data.password),
        hasLowercase: /[a-z]/.test(data.password),
        hasNumber: /[0-9]/.test(data.password),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(data.password),
    };

    const allRequirementsMet = Object.values(passwordRequirements).every(
        (req) => req
    );

    const submit = (e) => {
        e.preventDefault();
        post("/register");
    };

    return (
        <>
            <Head title="Register" />
            <div className="flex flex-col min-h-screen md:flex-row">
                {/* Left Side - Branding (Hidden on Mobile) */}
                <LogoCompany />

                {/* Right Side - Register Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex items-center justify-center w-full min-h-screen p-4 sm:p-6 md:p-8 md:w-1/2 bg-gray-50"
                >
                    <div className="w-full max-w-md mx-auto space-y-4 sm:space-y-6 md:space-y-8">
                        {/* Mobile Logo - Only visible on small screens */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center mb-4 sm:mb-6 md:hidden"
                        >
                            <img
                                src="/images/logos.png"
                                alt="RBT Bank Inc Logo"
                                className="object-contain w-20 h-20 sm:w-24 sm:h-24 mb-3 sm:mb-4"
                            />
                            <h2 className="text-lg sm:text-xl font-bold text-[#002868]">
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
                                Create Account
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Sign in to your account
                            </p>
                        </motion.div>

                        {/* Register Form */}
                        <motion.form
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            onSubmit={submit}
                            className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 md:space-y-6 bg-white shadow-lg rounded-xl"
                        >
                            {/* Name Field */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block mb-2 text-sm font-bold text-gray-700"
                                >
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-[#002868]" />
                                    </div>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002868] focus:border-[#002868] transition-all"
                                        placeholder="Juan Dela Cruz"
                                        required
                                    />
                                </div>
                                {errors.name && (
                                    <p className="flex items-center gap-1 mt-2 text-sm text-red-600">
                                        <span className="font-bold">⚠</span>{" "}
                                        {errors.name}
                                    </p>
                                )}
                            </div>

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
                                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-[#002868]" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002868] focus:border-[#002868] transition-all"
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
                                        <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-[#002868]" />
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
                                        className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002868] focus:border-[#002868] transition-all"
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
                                            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                                        ) : (
                                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                        )}
                                    </button>
                                </div>

                                {/* Password Requirements */}
                                {data.password && (
                                    <div className="p-2.5 sm:p-3 mt-2 sm:mt-3 border border-gray-200 rounded-lg bg-gray-50">
                                        <p className="mb-1.5 sm:mb-2 text-xs font-bold text-gray-700">
                                            Password Requirements:
                                        </p>
                                        <div className="space-y-0.5 sm:space-y-1">
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                                {passwordRequirements.minLength ? (
                                                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 shrink-0" />
                                                ) : (
                                                    <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 shrink-0" />
                                                )}
                                                <span
                                                    className={`text-xs ${
                                                        passwordRequirements.minLength
                                                            ? "text-green-700"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    At least 8 characters
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                                {passwordRequirements.hasUppercase ? (
                                                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 shrink-0" />
                                                ) : (
                                                    <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 shrink-0" />
                                                )}
                                                <span
                                                    className={`text-xs ${
                                                        passwordRequirements.hasUppercase
                                                            ? "text-green-700"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    At least one uppercase
                                                    letter (A-Z)
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                                {passwordRequirements.hasLowercase ? (
                                                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 shrink-0" />
                                                ) : (
                                                    <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 shrink-0" />
                                                )}
                                                <span
                                                    className={`text-xs ${
                                                        passwordRequirements.hasLowercase
                                                            ? "text-green-700"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    At least one lowercase
                                                    letter (a-z)
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                                {passwordRequirements.hasNumber ? (
                                                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 shrink-0" />
                                                ) : (
                                                    <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 shrink-0" />
                                                )}
                                                <span
                                                    className={`text-xs ${
                                                        passwordRequirements.hasNumber
                                                            ? "text-green-700"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    At least one number (0-9)
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                                {passwordRequirements.hasSpecial ? (
                                                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 shrink-0" />
                                                ) : (
                                                    <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 shrink-0" />
                                                )}
                                                <span
                                                    className={`text-xs ${
                                                        passwordRequirements.hasSpecial
                                                            ? "text-green-700"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    At least one special
                                                    character (!@#$%^&*...)
                                                </span>
                                            </div>
                                        </div>
                                        {allRequirementsMet && (
                                            <div className="pt-1.5 sm:pt-2 mt-1.5 sm:mt-2 border-t border-gray-300">
                                                <p className="flex items-center gap-1 text-xs font-bold text-green-700">
                                                    <Check className="w-3 h-3 sm:w-4 sm:h-4" />{" "}
                                                    Strong password!
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {errors.password && (
                                    <p className="flex items-center gap-1 mt-2 text-sm text-red-600">
                                        <span className="font-bold">⚠</span>{" "}
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Password Confirmation Field */}
                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className="block mb-2 text-sm font-bold text-gray-700"
                                >
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-[#002868]" />
                                    </div>
                                    <input
                                        id="password_confirmation"
                                        type={
                                            showPasswordConfirmation
                                                ? "text"
                                                : "password"
                                        }
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002868] focus:border-[#002868] transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPasswordConfirmation(
                                                !showPasswordConfirmation
                                            )
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#002868]"
                                    >
                                        {showPasswordConfirmation ? (
                                            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                                        ) : (
                                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="flex items-center gap-1 mt-2 text-sm text-red-600">
                                        <span className="font-bold">⚠</span>{" "}
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-[#002868] to-[#003580] hover:from-[#003580] hover:to-[#004a99] text-white py-2.5 sm:py-3 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="animate-spin">⏳</span>{" "}
                                        Creating account...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" /> Create
                                        Account
                                    </span>
                                )}
                            </Button>
                        </motion.form>

                        {/* Login Link */}
                        <div className="text-center">
                            <p className="text-gray-600">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="font-bold text-[#002868] hover:text-[#D4AF37] transition-colors"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>

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
