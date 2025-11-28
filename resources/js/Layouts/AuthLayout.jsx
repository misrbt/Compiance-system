import { Head } from '@inertiajs/react';
import { Shield } from 'lucide-react';

export default function AuthLayout({ children, title }) {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-gray-100 flex flex-col">
                {/* Header - No Navigation */}
                <header className="bg-white shadow-lg border-b-4 border-blue-600">
                    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
                        <div className="flex items-center justify-center gap-3 sm:gap-4">
                            <img
                                src="/images/logo.png"
                                alt="RBT Bank Inc Logo"
                                className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="hidden h-16 w-16 sm:h-20 sm:w-20 bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl items-center justify-center shadow-lg">
                                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                            </div>
                            <div className="text-center">
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900">RBT Bank Inc.</h1>
                                <p className="text-xs sm:text-sm text-gray-600 font-medium">A Rural Bank</p>
                                <p className="text-[10px] sm:text-xs text-blue-700 font-bold mt-1 bg-blue-50 px-2 sm:px-3 py-1 rounded-full inline-block">
                                    RBT Compliance Hub
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="w-full max-w-md">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-gray-800 border-t border-gray-700">
                    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
                            <p className="text-xs sm:text-sm text-blue-100">
                                © {new Date().getFullYear()} <span className="font-bold text-white">RBT Bank Inc.</span> <span className="hidden sm:inline">All rights reserved.</span>
                            </p>
                            <div className="text-xs sm:text-sm text-blue-100">
                                <p>Powered by: <span className="font-bold text-blue-300">MIS Department</span></p>
                                <p className="text-[10px] sm:text-xs text-blue-300 sm:text-right">Designed & Developed by Augustin Maputol</p>
                            </div>
                        </div>
                        <p className="text-[10px] sm:text-xs text-center text-blue-200 mt-2 sm:mt-3 font-medium">
                            🔒 BSP Regulated Anti-Money Laundering Act Compliance Hub
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
