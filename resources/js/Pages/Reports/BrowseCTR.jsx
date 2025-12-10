import { Head, Link, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
    FileText,
    Plus,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    Filter,
    X,
    Eye,
    ChevronDown,
    ChevronUp,
    Pencil,
    Trash2,
    FileDown,
    Printer,
    FileSpreadsheet,
    FileType,
    Search,
    Download,
} from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ReportsTable from "@/components/ReportsTable";
import ExportFormatDialog from "./components/ExportFormatDialog";

export default function BrowseCtr({ reports, filters }) {
    const { flash } = usePage().props;
    // Simple client-side filtering state
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [transactionCode, setTransactionCode] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [showGenerateDialog, setShowGenerateDialog] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: flash.success,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                confirmButtonColor: "#002868",
            });
        }
        if (flash?.error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: flash.error,
                confirmButtonColor: "#d33",
            });
        }
    }, [flash]);

    // Client-side live filtering - backend already sends deduplicated data
    const filteredReports = reports.filter((report) => {
        // Filter by Date From
        if (dateFrom) {
            const reportDate = new Date(report.submission_date);
            const filterDateFrom = new Date(dateFrom);
            if (reportDate < filterDateFrom) return false;
        }

        // Filter by Date To
        if (dateTo) {
            const reportDate = new Date(report.submission_date);
            const filterDateTo = new Date(dateTo);
            if (reportDate > filterDateTo) return false;
        }

        // Filter by Transaction Code
        if (transactionCode) {
            // Check all transactions for matching transaction code
            const hasMatchingCode = report.transactions?.some((transaction) =>
                transaction.transaction_code?.ca_sa
                    ?.toLowerCase()
                    .includes(transactionCode.toLowerCase())
            );
            if (!hasMatchingCode) return false;
        }

        // Filter by Search Query (Name or Ref No.)
        if (searchQuery.trim()) {
            const searchLower = searchQuery.toLowerCase();

            // Search in transaction reference numbers
            const hasMatchingRef = report.transactions?.some((transaction) =>
                transaction.transaction_reference_no
                    ?.toLowerCase()
                    .includes(searchLower)
            );
            if (hasMatchingRef) return true;

            // Search in party names (transaction.parties is array from many-to-many)
            const hasMatchingName = report.transactions?.some((transaction) => {
                const parties = transaction.parties || [];
                return parties.some((party) => {
                    const fullName = `${party.first_name || ""} ${
                        party.middle_name || ""
                    } ${party.last_name || ""}`.toLowerCase();
                    return fullName.includes(searchLower);
                });
            });
            if (hasMatchingName) return true;

            return false;
        }

        return true;
    });

    const handleClearFilters = () => {
        setDateFrom("");
        setDateTo("");
        setSearchQuery("");
        setTransactionCode("");
    };

    const hasActiveFilters =
        dateFrom || dateTo || searchQuery || transactionCode;

    // Simple function to open dialog - no validation needed
    const handleGenerateReport = () => {
        setShowGenerateDialog(true);
    };

    const handleCloseDialog = () => {
        setShowGenerateDialog(false);
    };

    return (
        <AppLayout>
            <Head title="Browse CTR Reports" />

            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <div className="flex flex-col gap-2 mb-2 sm:flex-row sm:items-center sm:gap-3">
                            <h1 className="text-2xl sm:text-3xl font-bold text-[#002868]">
                                CTR Reports
                            </h1>
                            <span className="inline-flex items-center w-fit px-2 sm:px-3 py-1 rounded-full bg-[#002868] text-white text-xs sm:text-sm font-medium">
                                Covered Transaction Report
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                            View and manage your CTR submissions
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                        <button
                            onClick={handleGenerateReport}
                            className="inline-flex items-center justify-center px-3 sm:px-4 py-2.5 text-white text-sm font-medium transition-all rounded-lg bg-green-600 hover:bg-green-700 hover:shadow-lg shadow-md"
                        >
                            <FileDown className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
                            Generate Report
                        </button>
                        <Link
                            href="/reports/submit-options"
                            className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-[#002868] hover:bg-[#001a4d] text-white text-sm rounded-md transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
                            Submit Report
                        </Link>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="mb-6 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white">
                        <div className="flex items-center">
                            <Filter className="w-5 h-5 text-[#002868] mr-2" />
                            <h3 className="text-lg font-semibold text-[#002868]">
                                Filter Reports
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
                        <div className="px-4 pb-4 border-t">
                            <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        <Calendar className="inline w-4 h-4 mr-1" />
                                        Date From
                                    </label>
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) =>
                                            setDateFrom(e.target.value)
                                        }
                                        className="w-full px-3 py-2 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        <Calendar className="inline w-4 h-4 mr-1" />
                                        Date To
                                    </label>
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) =>
                                            setDateTo(e.target.value)
                                        }
                                        className="w-full px-3 py-2 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        <FileText className="inline w-4 h-4 mr-1" />
                                        Transaction Code
                                    </label>
                                    <input
                                        type="text"
                                        value={transactionCode}
                                        onChange={(e) =>
                                            setTransactionCode(e.target.value)
                                        }
                                        placeholder="e.g., CDEPC"
                                        className="w-full px-3 py-2 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        <Search className="inline w-4 h-4 mr-1" />
                                        Search Name / Ref No.
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            placeholder="Search..."
                                            className="w-full py-2 pl-10 pr-3 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                            {hasActiveFilters && (
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={handleClearFilters}
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 transition-all border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400"
                                    >
                                        <X className="w-4 h-4 mr-1.5" />
                                        Clear All Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Filter Results Summary */}
                {hasActiveFilters && (
                    <div className="p-3 mb-4 border-l-4 border-blue-500 rounded-r-lg bg-blue-50">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-blue-600" />
                            <p className="text-sm font-medium text-blue-900">
                                Showing {filteredReports.length} of{" "}
                                {reports.length} reports
                            </p>
                        </div>
                        <div className="mt-2 space-y-1 text-xs text-blue-700">
                            {dateFrom && <div>• From: {dateFrom}</div>}
                            {dateTo && <div>• To: {dateTo}</div>}
                            {transactionCode && (
                                <div>• Transaction Code: {transactionCode}</div>
                            )}
                            {searchQuery && (
                                <div>• Search: "{searchQuery}"</div>
                            )}
                        </div>
                        {filteredReports.length === 0 && (
                            <p className="mt-2 text-sm text-blue-700">
                                No records match your filters. Try adjusting
                                them.
                            </p>
                        )}
                    </div>
                )}

                <ReportsTable
                    reports={filteredReports.data || filteredReports}
                />

                {/* Export Format Dialog */}
                <ExportFormatDialog
                    show={showGenerateDialog}
                    onClose={handleCloseDialog}
                    allReports={reports}
                />
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        max-height: 0;
                    }
                    to {
                        opacity: 1;
                        max-height: 500px;
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }

                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }

                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                    overflow: hidden;
                }
            `}</style>
        </AppLayout>
    );
}
