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
    Shield,
    Check,
    X,
} from "lucide-react";
import LOgoCompany from "@/components/LogoCompany";

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
                <LOgoCompany />

                {/* Right Side - Register Form */}
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
                                RBT Compliance Hub
                            </h2>
                            <p className="mt-1 text-xs text-gray-600">
                                BSP-Regulated Compliance Platform
                            </p>
                        </motion.div>

                        {/* Form Header - Hidden on mobile */}
                        <div className="hidden text-center md:block">
                            <h2 className="text-4xl font-bold text-gray-900">
                                Create Account
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Join the AMLA Report System
                            </p>
                        </div>

                        {/* Register Form */}
                        <form
                            onSubmit={submit}
                            className="p-8 space-y-6 bg-white shadow-lg rounded-xl"
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
                                        <User className="h-5 w-5 text-[#002868]" />
                                    </div>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002868] focus:border-[#002868] transition-all"
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

                                {/* Password Requirements */}
                                {data.password && (
                                    <div className="p-3 mt-3 border border-gray-200 rounded-lg bg-gray-50">
                                        <p className="mb-2 text-xs font-bold text-gray-700">
                                            Password Requirements:
                                        </p>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                {passwordRequirements.minLength ? (
                                                    <Check className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <X className="w-4 h-4 text-red-600" />
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
                                            <div className="flex items-center gap-2">
                                                {passwordRequirements.hasUppercase ? (
                                                    <Check className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <X className="w-4 h-4 text-red-600" />
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
                                            <div className="flex items-center gap-2">
                                                {passwordRequirements.hasLowercase ? (
                                                    <Check className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <X className="w-4 h-4 text-red-600" />
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
                                            <div className="flex items-center gap-2">
                                                {passwordRequirements.hasNumber ? (
                                                    <Check className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <X className="w-4 h-4 text-red-600" />
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
                                            <div className="flex items-center gap-2">
                                                {passwordRequirements.hasSpecial ? (
                                                    <Check className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <X className="w-4 h-4 text-red-600" />
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
                                            <div className="pt-2 mt-2 border-t border-gray-300">
                                                <p className="flex items-center gap-1 text-xs font-bold text-green-700">
                                                    <Check className="w-4 h-4" />{" "}
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
                                        <Lock className="h-5 w-5 text-[#002868]" />
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
                                        className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002868] focus:border-[#002868] transition-all"
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
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
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
                                className="w-full bg-gradient-to-r from-[#002868] to-[#003580] hover:from-[#003580] hover:to-[#004a99] text-white py-3 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="animate-spin">⏳</span>{" "}
                                        Creating account...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <UserPlus className="w-5 h-5" /> Create
                                        Account
                                    </span>
                                )}
                            </Button>
                        </form>

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
                        <div className="space-y-1 text-sm text-center text-gray-500">
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
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
