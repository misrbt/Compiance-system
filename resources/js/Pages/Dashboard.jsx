import AppLayout from '@/Layouts/AppLayout';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { FileText, AlertTriangle, BarChart3, Database, FolderOpen, ArrowRight, Activity, TrendingUp, Sparkles, Shield, CheckCircle2 } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useEffect } from 'react';

export default function Dashboard({ auth, stats: statsData, monthlyData }) {
    // Debug logging
    useEffect(() => {
        console.log('Dashboard monthlyData:', monthlyData);
    }, [monthlyData]);

    const stats = [
        {
            title: 'CTR Reports',
            value: statsData.ctr,
            icon: FileText,
            description: 'Covered Transaction Reports',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            gradient: 'from-[#002868] via-[#003580] to-[#004899]',
            accentGradient: 'from-blue-400 to-blue-600',
            link: '/reports/browse-ctr',
            iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600'
        },
        {
            title: 'Total Reports',
            value: statsData.total,
            icon: Database,
            description: 'All submitted reports',
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            gradient: 'from-[#B45309] via-[#D97706] to-[#F59E0B]',
            accentGradient: 'from-amber-400 to-amber-600',
            link: '/reports',
            iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600'
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
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

    const floatingAnimation = {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    return (
        <AppLayout title="Dashboard">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6 pb-8"
            >
                {/* Enhanced Welcome Section with Pattern Background */}
                <motion.div
                    variants={itemVariants}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#002868] via-[#003a80] to-[#002050] shadow-2xl"
                >
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03]">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                                    <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5"/>
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                    </div>

                    {/* Decorative Orbs */}
                    <motion.div
                        animate={floatingAnimation}
                        className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] opacity-20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{...floatingAnimation, transition: {...floatingAnimation.transition, delay: 0.5}}}
                        className="absolute bottom-0 left-0 -mb-16 -ml-16 w-72 h-72 bg-gradient-to-br from-blue-400 to-blue-600 opacity-15 rounded-full blur-3xl"
                    />

                    {/* Sparkle Effects */}
                    <div className="absolute top-8 right-1/4">
                        <Sparkles className="w-6 h-6 text-[#D4AF37] opacity-60 animate-pulse" />
                    </div>
                    <div className="absolute bottom-12 left-1/3">
                        <Sparkles className="w-4 h-4 text-blue-300 opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>

                    <div className="relative p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-3">
                                    <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
                                    <span className="text-xs font-semibold text-white/90">RBT Compliance Hub</span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
                                    Welcome back, <span className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">{auth.user.name}</span>
                                </h2>
                                <p className="text-blue-100/80 text-sm md:text-base max-w-2xl leading-relaxed">
                                    Monitor and manage your AMLC reporting activities. Track submissions and ensure compliance.
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <motion.div
                                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] opacity-50 blur-xl rounded-xl" />
                                    <div className="relative p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/30 shadow-xl">
                                        <Activity className="w-8 h-8 text-[#D4AF37]" />
                                    </div>
                                </motion.div>
                            </div>
                        </div>


                    </div>
                </motion.div>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.title}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Link href={stat.link} className="block h-full">
                                    <div className="relative h-full overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 group border border-gray-100">
                                        {/* Gradient Background on Hover */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                        {/* Decorative Pattern */}
                                        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Icon className="w-full h-full" />
                                        </div>

                                        {/* Shine Effect */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                            <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform group-hover:translate-x-[200%] transition-transform duration-1000" />
                                        </div>

                                        <div className="relative p-6 z-10">
                                            {/* Icon Badge */}
                                            <div className="flex items-start justify-between mb-4">
                                                <motion.div
                                                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                                    transition={{ duration: 0.5 }}
                                                    className={`p-3 rounded-xl ${stat.iconBg} shadow-lg group-hover:shadow-xl transition-all duration-300`}
                                                >
                                                    <Icon className="w-7 h-7 text-white" />
                                                </motion.div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                                </div>
                                            </div>

                                            {/* Value */}
                                            <div className="text-5xl font-bold text-gray-900 group-hover:text-white mb-2 tracking-tight transition-colors duration-300">
                                                {stat.value}
                                            </div>

                                            {/* Title */}
                                            <div className="text-base font-semibold text-gray-700 group-hover:text-white/95 uppercase tracking-wide mb-2 transition-colors duration-300">
                                                {stat.title}
                                            </div>

                                            {/* Description */}
                                            <p className="text-sm text-gray-500 group-hover:text-white/80 transition-colors duration-300">
                                                {stat.description}
                                            </p>
                                        </div>

                                        {/* Bottom Accent Line */}
                                        <div className={`absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r ${stat.accentGradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Enhanced Charts Section */}
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <Card className="h-full shadow-xl border-0 bg-white overflow-hidden rounded-2xl">
                            <CardHeader className="bg-gradient-to-r from-gray-50 via-white to-blue-50/30 border-b border-gray-100 pb-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-gradient-to-br from-[#002868] to-[#004080] rounded-lg shadow-md">
                                                <BarChart3 className="w-5 h-5 text-white" />
                                            </div>
                                            <CardTitle className="text-[#002868] text-2xl font-bold">
                                                Submission Analytics
                                            </CardTitle>
                                        </div>
                                        <CardDescription className="text-gray-600 ml-1">
                                            Monthly breakdown of CTR submissions
                                        </CardDescription>
                                    </div>
                                    <div className="hidden md:block p-3 bg-blue-50 rounded-xl border border-blue-100 shadow-sm">
                                        <TrendingUp className="w-6 h-6 text-[#002868]" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-8 px-6 pb-6">
                                {monthlyData && monthlyData.length > 0 ? (
                                    <div className="h-[380px] w-full">
                                        <ChartContainer
                                            config={{
                                                ctr: {
                                                    label: "CTR Reports",
                                                    color: "#002868",
                                                },
                                            }}
                                            className="h-full w-full"
                                        >
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                                                    <defs>
                                                        <linearGradient id="colorCtr" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#002868" stopOpacity={1}/>
                                                            <stop offset="100%" stopColor="#004080" stopOpacity={0.8}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.6} />
                                                    <XAxis
                                                        dataKey="month"
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }}
                                                        dy={12}
                                                    />
                                                    <YAxis
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }}
                                                        dx={-8}
                                                    />
                                                    <ChartTooltip
                                                        cursor={{ fill: '#f9fafb', opacity: 0.5 }}
                                                        content={<ChartTooltipContent />}
                                                    />
                                                    <ChartLegend content={<ChartLegendContent />} />
                                                    <Bar
                                                        dataKey="ctr"
                                                        name="CTR Reports"
                                                        fill="url(#colorCtr)"
                                                        radius={[8, 8, 0, 0]}
                                                        barSize={50}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </ChartContainer>
                                    </div>
                                ) : (
                                    <div className="h-[380px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50/30">
                                        <motion.div
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            className="p-5 bg-white rounded-2xl shadow-lg mb-4 border border-gray-100"
                                        >
                                            <BarChart3 className="w-10 h-10 text-gray-400" />
                                        </motion.div>
                                        <p className="text-gray-900 font-bold text-xl mb-2">No Data Available</p>
                                        <p className="text-sm text-gray-500 max-w-sm">Start submitting reports to visualize your monthly transaction data and trends here.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Enhanced Quick Actions */}
                    <motion.div variants={itemVariants} className="lg:col-span-1">
                        <Card className="h-full shadow-xl border-0 bg-white rounded-2xl overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-amber-50 via-white to-blue-50/30 border-b border-gray-100 pb-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-lg shadow-md">
                                        <FolderOpen className="w-5 h-5 text-white" />
                                    </div>
                                    <CardTitle className="text-[#002868] text-2xl font-bold">Quick Actions</CardTitle>
                                </div>
                                <CardDescription className="text-gray-600 ml-1">
                                    Frequently used operations
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 pb-4 space-y-3">
                                {[
                                    { title: 'Submit New Report', desc: 'Create CTR', icon: FileText, href: '/reports/submit-options', color: 'text-blue-600', bg: 'bg-blue-50', iconBg: 'from-blue-500 to-blue-600', borderColor: 'border-blue-200' },
                                    { title: 'View All Reports', desc: 'Access full history', icon: FolderOpen, href: '/reports', color: 'text-amber-600', bg: 'bg-amber-50', iconBg: 'from-amber-500 to-amber-600', borderColor: 'border-amber-200' },
                                    { title: 'Browse CTR', desc: 'Filter submissions', icon: CheckCircle2, href: '/reports/browse-ctr', color: 'text-emerald-600', bg: 'bg-emerald-50', iconBg: 'from-emerald-500 to-emerald-600', borderColor: 'border-emerald-200' },
                                    { title: 'Reference Data', desc: 'Manage system codes', icon: Database, href: '/data-configuration', color: 'text-purple-600', bg: 'bg-purple-50', iconBg: 'from-purple-500 to-purple-600', borderColor: 'border-purple-200' },
                                ].map((action, i) => {
                                    const Icon = action.icon;
                                    return (
                                        <motion.div
                                            key={i}
                                            whileHover={{ x: 4 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Link href={action.href} className="block group">
                                                <div className={`flex items-center p-4 rounded-xl border ${action.borderColor} bg-white hover:bg-gradient-to-r ${action.bg} hover:shadow-lg transition-all duration-300`}>
                                                    <motion.div
                                                        whileHover={{ rotate: [0, -15, 15, 0] }}
                                                        transition={{ duration: 0.5 }}
                                                        className={`p-3 rounded-lg bg-gradient-to-br ${action.iconBg} mr-4 shadow-md group-hover:shadow-lg transition-shadow`}
                                                    >
                                                        <Icon className="w-5 h-5 text-white" />
                                                    </motion.div>
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-gray-800 group-hover:text-gray-900 transition-colors text-sm">{action.title}</h3>
                                                        <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">{action.desc}</p>
                                                    </div>
                                                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </AppLayout>
    );
}
