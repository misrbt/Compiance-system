import { Head, Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
    LogOut,
    User,
    Home,
    FileText,
    Users,
    Shield,
    ChevronDown,
    UserCircle,
    Database,
    AlertTriangle,
    Menu,
    X,
    Grid3x3,
} from "lucide-react";

export default function AppLayout({ children, title }) {
    const { auth, currentPortal } = usePage().props;
    const currentPath = window.location.pathname;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    // Portal titles
    const portalTitles = {
        amla: 'AMLA Report',
        kyc: 'KYC Portal',
        // Add more portal titles here
    };

    const portalTitle = portalTitles[currentPortal] || 'Compliance System';

    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "CTR Reports", href: "/reports/browse-ctr", icon: FileText },
        {
            name: "STR Reports",
            href: "/reports/browse-str",
            icon: AlertTriangle,
        },
        {
            name: "Data Configuration",
            href: "/data-configuration",
            icon: Database,
        },
    ];

    return (
        <>
            <Head title={title} />
            <div className="flex flex-col min-h-screen pb-32 sm:pb-36 md:pb-40 bg-white">
                {/* HEADER */}
                <header className="bg-white shadow-lg border-b-4 border-[#002868] sticky top-0 z-50">
                    <div className="px-3 mx-auto max-w-7xl sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
                            {/* LOGO */}
                            <div className="flex items-center gap-2 sm:gap-3">
                                <img
                                    src="/images/logos.png"
                                    alt="RBT Bank Inc Logo"
                                    className="object-contain w-10 h-10 sm:w-12 sm:h-12 md:h-14 md:w-14"
                                />
                                <div className="hidden sm:block">
                                    <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-[#002868] leading-tight">
                                        RBT Bank Inc.
                                    </h1>
                                    <p className="text-[10px] sm:text-xs font-medium text-gray-600">
                                        {portalTitle}
                                    </p>
                                </div>
                            </div>

                            {/* DESKTOP NAV */}
                            <nav className="hidden lg:flex space-x-1">
                                {navigation.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = currentPath === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center gap-2 px-3 xl:px-4 py-2 rounded-lg text-xs xl:text-sm font-bold transition-all ${
                                                isActive
                                                    ? "bg-gradient-to-r from-[#002868] to-[#003580] text-white shadow-lg"
                                                    : "text-gray-700 hover:bg-[#D4AF37]/10 hover:text-[#002868]"
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="hidden xl:inline">{item.name}</span>
                                            <span className="xl:hidden">{item.name.split(' ')[0]}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* MOBILE MENU TOGGLE */}
                            <button
                                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                                className="p-2 border border-gray-200 rounded-lg lg:hidden hover:bg-gray-100 transition-colors"
                                aria-label="Toggle menu"
                            >
                                {mobileNavOpen ? (
                                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#002868]" />
                                ) : (
                                    <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-[#002868]" />
                                )}
                            </button>

                            {/* USER MENU - DESKTOP ONLY */}
                            <div className="relative hidden lg:block">
                                <button
                                    onClick={() =>
                                        setDropdownOpen(!dropdownOpen)
                                    }
                                    className="flex items-center gap-2 px-2 xl:px-3 py-2 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 transition-all"
                                >
                                    <div className="w-8 h-8 xl:w-9 xl:h-9 bg-gradient-to-br from-[#002868] to-[#003580] rounded-full flex items-center justify-center shadow-md">
                                        <span className="text-xs xl:text-sm font-bold text-white">
                                            {auth?.user?.name
                                                ?.charAt(0)
                                                .toUpperCase() || "G"}
                                        </span>
                                    </div>
                                    <div className="hidden text-left xl:block">
                                        <p className="font-bold text-[#002868] text-xs xl:text-sm">
                                            {auth?.user?.name || "Guest"}
                                        </p>
                                        <p className="text-[10px] xl:text-xs text-gray-600">
                                            Account
                                        </p>
                                    </div>
                                    <ChevronDown
                                        className={`w-3 h-3 xl:w-4 xl:h-4 text-gray-600 transition-transform ${
                                            dropdownOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                {/* DROPDOWN MENU */}
                                {dropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() =>
                                                setDropdownOpen(false)
                                            }
                                        ></div>
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border-2 border-[#D4AF37]/30 z-20">
                                            <div className="px-4 py-3 border-b border-gray-200 bg-[#D4AF37]/10">
                                                <p className="text-sm font-bold text-[#002868]">
                                                    {auth?.user?.name ||
                                                        "Guest"}
                                                </p>
                                                <p className="text-xs text-gray-600 truncate">
                                                    {auth?.user?.email}
                                                </p>
                                            </div>

                                            <div className="py-2">
                                                <Link
                                                    href="/portals"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#D4AF37]/10 transition-all"
                                                    onClick={() =>
                                                        setDropdownOpen(false)
                                                    }
                                                >
                                                    <Grid3x3 className="w-4 h-4 text-[#002868]" />
                                                    <span className="font-medium">
                                                        Switch Portal
                                                    </span>
                                                </Link>

                                                <Link
                                                    href="/profile"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#D4AF37]/10 transition-all"
                                                    onClick={() =>
                                                        setDropdownOpen(false)
                                                    }
                                                >
                                                    <UserCircle className="w-4 h-4 text-[#002868]" />
                                                    <span className="font-medium">
                                                        Profile
                                                    </span>
                                                </Link>

                                                <Link
                                                    href="/logout"
                                                    method="post"
                                                    as="button"
                                                    className="flex items-center w-full gap-3 px-4 py-2 text-sm text-red-700 transition-all hover:bg-red-50"
                                                    onClick={() =>
                                                        setDropdownOpen(false)
                                                    }
                                                >
                                                    <LogOut className="w-4 h-4 text-red-600" />
                                                    <span className="font-medium">
                                                        Logout
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* MOBILE NAV MENU */}
                    {mobileNavOpen && (
                        <div className="bg-white border-t border-gray-200 shadow-lg lg:hidden">
                            <nav className="flex flex-col p-2 sm:p-3 space-y-1">
                                {/* User Info at Top on Mobile */}
                                <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/30">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#002868] to-[#003580] rounded-full flex items-center justify-center shadow-md">
                                        <span className="text-sm font-bold text-white">
                                            {auth?.user?.name
                                                ?.charAt(0)
                                                .toUpperCase() || "G"}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-[#002868] text-sm">
                                            {auth?.user?.name || "Guest"}
                                        </p>
                                        <p className="text-xs text-gray-600 truncate">
                                            {auth?.user?.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Navigation Links */}
                                {navigation.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = currentPath === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                                                isActive
                                                    ? "bg-gradient-to-r from-[#002868] to-[#003580] text-white shadow"
                                                    : "text-gray-700 hover:bg-[#D4AF37]/10 hover:text-[#002868]"
                                            }`}
                                            onClick={() =>
                                                setMobileNavOpen(false)
                                            }
                                        >
                                            <Icon className="w-5 h-5" />
                                            {item.name}
                                        </Link>
                                    );
                                })}

                                {/* Divider */}
                                <div className="border-t border-gray-200 my-2"></div>

                                {/* MOBILE USER MENU */}
                                <Link
                                    href="/portals"
                                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-[#D4AF37]/10 transition-all rounded-lg"
                                    onClick={() => setMobileNavOpen(false)}
                                >
                                    <Grid3x3 className="w-5 h-5 text-[#002868]" />
                                    Switch Portal
                                </Link>
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-[#D4AF37]/10 transition-all rounded-lg"
                                    onClick={() => setMobileNavOpen(false)}
                                >
                                    <UserCircle className="w-5 h-5 text-[#002868]" />
                                    Profile
                                </Link>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-red-700 transition-all hover:bg-red-50 rounded-lg"
                                    onClick={() => setMobileNavOpen(false)}
                                >
                                    <LogOut className="w-5 h-5 text-red-600" />
                                    Logout
                                </Link>
                            </nav>
                        </div>
                    )}
                </header>

                {/* MAIN CONTENT */}
                <main className="flex-1">
                    <div className="px-3 py-4 mx-auto max-w-7xl sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8">
                        {children}
                    </div>
                </main>

                {/* FOOTER */}
                <footer className="fixed bottom-0 left-0 right-0 z-30 bg-gray-800 border-t-2 border-gray-700 shadow-lg">
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
        </>
    );
}
