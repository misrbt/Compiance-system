import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
    Plus,
    Calendar,
    Filter,
    X,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { useState } from "react";
import ReportsTable from "@/components/ReportsTable";

export default function Index({ reports, filters }) {
    const [dateFrom, setDateFrom] = useState(filters?.date_from || "");
    const [dateTo, setDateTo] = useState(filters?.date_to || "");
    const [statusFilter, setStatusFilter] = useState(filters?.status || "");
    const [reportTypeFilter, setReportTypeFilter] = useState(
        filters?.report_type || ""
    );
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handleFilter = () => {
        router.get(
            "/reports",
            {
                date_from: dateFrom,
                date_to: dateTo,
                status: statusFilter,
                report_type: reportTypeFilter,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleClearFilters = () => {
        setDateFrom("");
        setDateTo("");
        setStatusFilter("");
        setReportTypeFilter("");
        router.get(
            "/reports",
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const hasActiveFilters =
        dateFrom || dateTo || statusFilter || reportTypeFilter;

    return (
        <AppLayout>
            <Head title="Reports" />

            <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[#002868]">
                            Reports
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage your CTR submissions
                        </p>
                    </div>
                    <Link
                        href="/reports/select-type"
                        className="inline-flex items-center px-4 py-2 bg-[#002868] hover:bg-[#001a4d] text-white rounded-md transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Submit New Report
                    </Link>
                </div>

                {/* Filters Section */}
                <div className="mb-6 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                            <Filter className="w-5 h-5 text-[#002868] mr-2" />
                            <h3 className="text-lg font-semibold text-[#002868]">
                                Filter by Submission Date
                            </h3>
                        </div>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            {isFilterOpen ? (
                                <>
                                    <ChevronUp className="w-4 h-4" />
                                    Hide Filters
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="w-4 h-4" />
                                    Show Filters
                                </>
                            )}
                        </button>
                    </div>

                    {isFilterOpen && (
                        <div className="px-4 pb-4">
                            <div className="flex justify-center gap-4">
                                <div className="w-1/2">
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Date From
                                    </label>
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) =>
                                            setDateFrom(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Date To
                                    </label>
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) =>
                                            setDateTo(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-4 space-x-2">
                                {hasActiveFilters && (
                                    <button
                                        onClick={handleClearFilters}
                                        className="inline-flex items-center px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        <X className="w-4 h-4 mr-1" />
                                        Clear Filters
                                    </button>
                                )}
                                <button
                                    onClick={handleFilter}
                                    className="inline-flex items-center px-4 py-2 bg-[#002868] hover:bg-[#001a4d] text-white rounded-md transition-colors"
                                >
                                    <Filter className="w-4 h-4 mr-1" />
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <ReportsTable reports={reports} />
            </div>
        </AppLayout>
    );
}
