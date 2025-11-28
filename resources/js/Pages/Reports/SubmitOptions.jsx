import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { FileText, Plus, ArrowLeft, Zap } from "lucide-react";

export default function SubmitOptions() {
    return (
        <AppLayout>
            <Head title="Submit CTR - Choose Option" />

            <div className="px-4 py-8 mx-auto max-w-5xl sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    href="/reports/browse-ctr"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-[#002868] mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to CTR Reports
                </Link>

                {/* Header */}
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center px-4 py-2 mb-4 rounded-full bg-[#002868] text-white text-sm font-medium">
                        Submit CTR
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        How would you like to proceed?
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Choose the option that best fits your needs
                    </p>
                </div>

                {/* Options Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Quick Transaction Entry */}
                    <Link
                        href="/reports/data-entry"
                        className="group block p-8 bg-white border-2 border-blue-200 rounded-2xl shadow-lg hover:border-blue-400 hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                                <Zap className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                Add Transaction
                            </h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                Quick transaction entry for existing customers. Perfect for adding transactions to known parties.
                            </p>
                            <div className="mt-auto pt-4">
                                <span className="inline-flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                                    Start Quick Entry
                                    <Plus className="w-5 h-5 ml-1 group-hover:ml-2 transition-all" />
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Full Report Creation */}
                    <Link
                        href="/reports/select-transaction-type?type=CTR"
                        className="group block p-8 bg-white border-2 border-green-200 rounded-2xl shadow-lg hover:border-green-400 hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                                <FileText className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                                Create New Entry
                            </h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                Complete report creation with full details. Use this for new customers and comprehensive reports.
                            </p>
                            <div className="mt-auto pt-4">
                                <span className="inline-flex items-center text-green-600 font-semibold group-hover:gap-2 transition-all">
                                    Create Full Report
                                    <FileText className="w-5 h-5 ml-1 group-hover:ml-2 transition-all" />
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Feature Comparison */}
                <div className="mt-12 max-w-3xl mx-auto">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                            Quick Comparison
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-blue-600 mb-2 flex items-center">
                                    <Zap className="w-4 h-4 mr-2" />
                                    Add Transaction
                                </h4>
                                <ul className="space-y-1 text-sm text-gray-600">
                                    <li>• Search existing customers</li>
                                    <li>• Quick data entry</li>
                                    <li>• Minimal fields required</li>
                                    <li>• Fast workflow</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-green-600 mb-2 flex items-center">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Create New Entry
                                </h4>
                                <ul className="space-y-1 text-sm text-gray-600">
                                    <li>• Add new customers</li>
                                    <li>• Complete party details</li>
                                    <li>• Full report creation</li>
                                    <li>• Comprehensive workflow</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
