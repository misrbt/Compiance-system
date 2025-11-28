import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { CheckCircle, Plus, FileText, User, Calendar } from "lucide-react";

export default function TransactionSuccess({ report, party, transaction }) {
    return (
        <AppLayout>
            <Head title="Transaction Added Successfully" />

            <div className="px-4 py-8 mx-auto max-w-4xl sm:px-6 lg:px-8">
                {/* Success Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-100">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Transaction Added Successfully!
                    </h1>
                    <p className="text-lg text-gray-600">
                        What would you like to do next?
                    </p>
                </div>

                {/* Transaction Summary Card */}
                <div className="mb-8 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
                        <h2 className="text-lg font-bold text-green-900">
                            Transaction Summary
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-start gap-3">
                            <User className="w-5 h-5 text-[#002868] mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Customer</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {party.first_name} {party.middle_name} {party.last_name}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-[#002868] mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Amount</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    ₱{parseFloat(transaction.transaction_amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-[#002868] mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Submission Date</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {new Date(report.submission_date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Add Another Transaction to Same Customer */}
                    <Link
                        href={`/reports/data-entry?party_id=${party.id}`}
                        className="group block p-6 bg-white border-2 border-blue-200 rounded-xl shadow-sm hover:border-blue-400 hover:shadow-md transition-all"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <Plus className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                    Add Another Transaction
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Add another transaction for <span className="font-semibold">{party.first_name} {party.last_name}</span>
                                </p>
                            </div>
                        </div>
                    </Link>

                    {/* Create New Report */}
                    <Link
                        href="/reports/select-transaction-type?type=CTR"
                        className="group block p-6 bg-white border-2 border-green-200 rounded-xl shadow-sm hover:border-green-400 hover:shadow-md transition-all"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                <FileText className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                                    Create New Report
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Start a new CTR report with a different customer
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* View Report Link */}
                <div className="text-center">
                    <Link
                        href={`/reports/${report.id}/view-ctr-report`}
                        className="inline-flex items-center px-6 py-3 bg-[#002868] hover:bg-[#001a4d] text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
                    >
                        <FileText className="w-5 h-5 mr-2" />
                        View Complete Report
                    </Link>
                    <div className="mt-4">
                        <Link
                            href="/reports/browse-ctr"
                            className="text-sm text-gray-600 hover:text-[#002868] underline"
                        >
                            or go back to Browse CTR
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
