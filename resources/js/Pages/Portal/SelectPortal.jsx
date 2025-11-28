import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

export default function SelectPortal({ auth, portals }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 12
            }
        }
    };

    const getIconComponent = (iconName) => {
        const icons = {
            shield: Shield,
        };
        return icons[iconName] || Shield;
    };

    const getColorClasses = (color, enabled) => {
        if (!enabled) {
            return {
                gradient: 'from-gray-400 to-gray-500',
                iconBg: 'bg-gray-500',
                border: 'border-gray-300',
                hoverShadow: '',
            };
        }

        const colors = {
            blue: {
                gradient: 'from-[#002868] to-[#004080]',
                iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
                border: 'border-blue-200',
                hoverShadow: 'hover:shadow-blue-200/50',
            },
            green: {
                gradient: 'from-emerald-600 to-emerald-700',
                iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
                border: 'border-emerald-200',
                hoverShadow: 'hover:shadow-emerald-200/50',
            },
            purple: {
                gradient: 'from-purple-600 to-purple-700',
                iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
                border: 'border-purple-200',
                hoverShadow: 'hover:shadow-purple-200/50',
            },
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 flex flex-col">
            <Head title="Select Portal" />

            {/* Header */}
            <div className="bg-gradient-to-r from-[#002868] via-[#003a80] to-[#004080] text-white py-8 shadow-2xl border-b-4 border-[#D4AF37]">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Top Section - Logo & Company */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#D4AF37] opacity-20 blur-xl rounded-full"></div>
                                <img
                                    src="/images/logos.png"
                                    alt="RBT Bank Inc Logo"
                                    className="relative object-contain w-16 h-16 sm:w-20 sm:h-20 drop-shadow-2xl"
                                />
                            </div>
                            <div className="text-center sm:text-left">
                                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-1">
                                    RBT Bank Inc.
                                </h1>
                                <p className="text-sm sm:text-base text-blue-100 font-medium">
                                    Banking Services & Financial Solutions
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section - Portal Selection & User Info */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/20">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                                <Shield className="w-6 h-6 text-[#D4AF37]" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold">Compliance System</h2>
                                <p className="text-sm text-blue-100">Select a portal to access</p>
                            </div>
                        </div>
                        <div className="text-center sm:text-right">
                            <p className="text-xs sm:text-sm text-blue-100">Logged in as</p>
                            <p className="font-semibold text-lg text-[#D4AF37]">{auth.user.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                    {/* Welcome Section */}
                    <motion.div variants={itemVariants} className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">
                            Welcome, <span className="text-[#002868]">{auth.user.name}</span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Choose a compliance portal below to access its features and manage your reporting activities.
                        </p>
                    </motion.div>

                    {/* Portals Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                        {portals.map((portal, index) => {
                            const Icon = getIconComponent(portal.icon);
                            const colorClasses = getColorClasses(portal.color, portal.enabled);

                            return (
                                <motion.div
                                    key={portal.id}
                                    variants={itemVariants}
                                    whileHover={portal.enabled ? { scale: 1.03 } : {}}
                                    whileTap={portal.enabled ? { scale: 0.98 } : {}}
                                >
                                    {portal.enabled ? (
                                        <Link
                                            href={`/portals/${portal.id}/enter`}
                                            className="block h-full"
                                        >
                                            <div className={`relative h-full overflow-hidden rounded-2xl bg-white shadow-lg ${colorClasses.hoverShadow} hover:shadow-xl transition-all duration-300 group border ${colorClasses.border}`}>
                                                {/* Background Gradient on Hover */}
                                                <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                                                {/* Decorative Icon */}
                                                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
                                                    <Icon className="w-full h-full" />
                                                </div>

                                                <div className="relative p-6 z-10">
                                                    {/* Icon Badge */}
                                                    <div className="flex items-start justify-between mb-4">
                                                        <motion.div
                                                            whileHover={{ rotate: [0, -10, 10, 0] }}
                                                            transition={{ duration: 0.5 }}
                                                            className={`p-4 rounded-xl ${colorClasses.iconBg} shadow-lg`}
                                                        >
                                                            <Icon className="w-8 h-8 text-white" />
                                                        </motion.div>
                                                        <div className="p-2 bg-emerald-50 rounded-full">
                                                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                                        </div>
                                                    </div>

                                                    {/* Portal Info */}
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                        {portal.name}
                                                    </h3>
                                                    <p className="text-gray-600 mb-6 min-h-[3rem]">
                                                        {portal.description}
                                                    </p>

                                                    {/* Action Button */}
                                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                        <span className="text-sm font-semibold text-[#002868] group-hover:text-[#004080] transition-colors">
                                                            Access Portal
                                                        </span>
                                                        <ArrowRight className="w-5 h-5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="relative h-full overflow-hidden rounded-2xl bg-white shadow-md border border-gray-200 opacity-60 cursor-not-allowed">
                                            {/* Decorative Icon */}
                                            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                                                <Icon className="w-full h-full" />
                                            </div>

                                            <div className="relative p-6 z-10">
                                                {/* Icon Badge */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="p-4 rounded-xl bg-gray-400 shadow-md">
                                                        <Icon className="w-8 h-8 text-white" />
                                                    </div>
                                                    <div className="p-2 bg-gray-100 rounded-full">
                                                        <Lock className="w-5 h-5 text-gray-500" />
                                                    </div>
                                                </div>

                                                {/* Portal Info */}
                                                <h3 className="text-2xl font-bold text-gray-500 mb-2">
                                                    {portal.name}
                                                </h3>
                                                <p className="text-gray-400 mb-6 min-h-[3rem]">
                                                    {portal.description}
                                                </p>

                                                {/* Disabled Notice */}
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                    <span className="text-sm font-semibold text-gray-400">
                                                        Coming Soon
                                                    </span>
                                                    <Lock className="w-5 h-5 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* FOOTER */}
            <footer className="bg-gray-800 border-t-2 border-gray-700 shadow-lg mt-auto">
                <div className="px-3 py-3 mx-auto max-w-7xl sm:px-4 sm:py-4 md:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
                        <p className="text-xs sm:text-sm text-gray-400">
                            © {new Date().getFullYear()}{" "}
                            <span className="font-bold text-white">
                                RBT Bank Inc.
                            </span>{" "}
                            <span className="hidden sm:inline">All rights reserved.</span>
                        </p>
                        <div className="text-xs sm:text-sm text-gray-400">
                            <p>
                                Powered by:{" "}
                                <span className="font-bold text-[#D4AF37]">
                                    MIS Department
                                </span>
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-400 sm:text-right">
                                Designed & Developed by Augustin Maputol
                            </p>
                        </div>
                    </div>
                    <p className="text-[10px] sm:text-xs text-center text-[#D4AF37] mt-2 font-medium">
                        🔒 BSP Regulated Anti-Money Laundering Act
                        Compliance System
                    </p>
                </div>
            </footer>
        </div>
    );
}
