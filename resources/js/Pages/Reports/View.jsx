import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
    ArrowLeft,
    FileDown,
    Printer,
    Calendar,
    FileText,
    User,
    MapPin,
    CreditCard,
    Building2,
    Banknote,
} from "lucide-react";
import Swal from "sweetalert2";
import React, { useMemo, useState, useEffect } from "react";
import ExportFormatDialog from "./components/ExportFormatDialog";
import { printCTRReport } from "@/services/ctrPrintService";

export default function View({ report, filterPartyId, partyTransactions = [] }) {
    const [showExportDialog, setShowExportDialog] = useState(false);
    const [sortConfig, setSortConfig] = useState({
        key: "transaction_date",
        direction: "desc",
    });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Determine which transactions to display
    // If we have filterPartyId and partyTransactions, use those (showing all history for that party)
    // Otherwise fall back to report.transactions (showing only this report's transactions)
    const displayedTransactions = useMemo(() => {
        if (filterPartyId && partyTransactions && partyTransactions.length > 0) {
            return partyTransactions;
        }

        let transactions = report.transactions || [];
        if (filterPartyId) {
            // Fallback if partyTransactions wasn't passed for some reason
            transactions = transactions.filter(t =>
                t.parties?.some(p => p.id === parseInt(filterPartyId))
            );
        }
        return transactions;
    }, [report.transactions, filterPartyId, partyTransactions]);

    const scopedReport = useMemo(() => {
        if (filterPartyId && partyTransactions && partyTransactions.length > 0) {
            return {
                ...report,
                transactions: partyTransactions,
            };
        }

        if (filterPartyId) {
            return {
                ...report,
                transactions: (report.transactions || []).filter((t) =>
                    t.parties?.some((p) => p.id === parseInt(filterPartyId))
                ),
            };
        }

        return report;
    }, [filterPartyId, partyTransactions, report]);

    const parseNaiveDateTime = (input) => {
        if (!input) {
            return null;
        }

        const isoLike = input.match(
            /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$/
        );

        if (isoLike) {
            const [, y, m, d, hh, mm, ss = "00"] = isoLike;
            return {
                y,
                m,
                d,
                hh,
                mm,
                ss,
            };
        }

        const ymd = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (ymd) {
            const [, y, m, d] = ymd;
            return { y, m, d, hh: "00", mm: "00", ss: "00" };
        }

        return null;
    };

    const formatDate = (date) => {
        if (!date) {
            return "--";
        }

        const parsed = parseNaiveDateTime(date);
        if (parsed) {
            return `${parsed.m}/${parsed.d}/${parsed.y}`;
        }

        const fallback = new Date(date);
        if (Number.isNaN(fallback.getTime())) {
            return date;
        }

        return fallback.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const formatDateTime = (date, time) => {
        if (!date) {
            return "--";
        }

        // Format the date
        const dateFormatted = formatDate(date);

        // Format the time if provided
        let timeFormatted = "--";
        if (time) {
            // Parse time string (HH:MM:SS or HH:MM format)
            const timeMatch = time.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
            if (timeMatch) {
                const hourNum = parseInt(timeMatch[1], 10);
                const minutes = timeMatch[2];
                const seconds = timeMatch[3] || "00";
                const hour12 = ((hourNum + 11) % 12) + 1;
                const meridiem = hourNum >= 12 ? "PM" : "AM";
                timeFormatted = `${hour12}:${minutes}:${seconds} ${meridiem}`;
            }
        }

        return (
            <div className="flex flex-col">
                <span className="font-medium">{dateFormatted}</span>
                <span className="text-xs text-gray-500">{timeFormatted}</span>
            </div>
        );
    };

    const formatCurrency = (amount) => {
        if (!amount) return "—";
        return `₱${parseFloat(amount).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const handleGenerateReport = () => {
        setShowExportDialog(true);
    };

    const handleCloseDialog = () => {
        setShowExportDialog(false);
    };

    const handlePrint = () => {
        try {
            // Validate that report has transactions
            if (!report.transactions || report.transactions.length === 0) {
                Swal.fire({
                    icon: "warning",
                    title: "No Transactions",
                    text: "This report does not contain any transactions to print.",
                });
                return;
            }

            // Convert single report to array format for print service
            const reportsArray = [report];

            // Default submission type to "A" - can be made configurable
            printCTRReport(reportsArray, "A");
        } catch (error) {
            console.error("Print error:", error);
            Swal.fire({
                icon: "error",
                title: "Print Failed",
                text: error.message || "An error occurred during print.",
            });
        }
    };

    const sortedTransactions = useMemo(() => {
        const transactions = [...displayedTransactions];
        const valueResolvers = {
            transaction_code: (item) => item.transaction_code?.ca_sa || "",
            mode_of_transaction: (item) =>
                item.mode_of_transaction?.mode_of_transaction || "",
        };

        transactions.sort((a, b) => {
            const { key, direction } = sortConfig;
            const multiplier = direction === "asc" ? 1 : -1;

            if (key === "transaction_amount") {
                const aVal = parseFloat(a.transaction_amount || 0);
                const bVal = parseFloat(b.transaction_amount || 0);
                return (aVal - bVal) * multiplier;
            }

            if (key === "transaction_date") {
                const aDate = new Date(a.transaction_date || 0);
                const bDate = new Date(b.transaction_date || 0);
                return (aDate - bDate) * multiplier;
            }

            const resolver = valueResolvers[key];
            const aRaw = resolver ? resolver(a) : a[key] ?? a[key?.split(".")[0]] ?? "";
            const bRaw = resolver ? resolver(b) : b[key] ?? b[key?.split(".")[0]] ?? "";
            const aVal = aRaw.toString().toLowerCase();
            const bVal = bRaw.toString().toLowerCase();

            return aVal.localeCompare(bVal) * multiplier;
        });

        return transactions;
    }, [displayedTransactions, sortConfig]);

    useEffect(() => {
        setPage(1);
    }, [displayedTransactions.length, pageSize]);

    const totalPages = Math.max(1, Math.ceil(sortedTransactions.length / pageSize));
    const paginatedTransactions = useMemo(() => {
        const start = (page - 1) * pageSize;
        return sortedTransactions.slice(start, start + pageSize);
    }, [page, pageSize, sortedTransactions]);

    const handleSort = (key) => {
        setSortConfig((current) => {
            if (current.key === key) {
                return {
                    key,
                    direction: current.direction === "asc" ? "desc" : "asc",
                };
            }

            return { key, direction: "asc" };
        });
    };

    return (
        <AppLayout>
            <Head title={`View ${report.report_type} Report`} />

            <div className="min-h-screen bg-gray-50">
                {/* Navigation */}
                <Link
                    href={report.report_type === 'STR' ? '/reports/browse-str' : '/reports/browse-ctr'}
                    className="inline-flex items-center gap-2 px-3 py-2 mb-4 text-xs font-medium text-gray-700 transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-sm sm:mb-6 sm:text-sm hover:bg-gray-50 hover:shadow-md hover:border-gray-300"
                >
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                    Back to Reports
                </Link>

                {/* Header Section */}
                <div className="mb-6 overflow-hidden bg-white border border-gray-200 shadow-lg sm:mb-8 rounded-xl">
                    <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-r from-[#002868] to-[#003a8c]">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2 sm:gap-3 sm:mb-3">
                                    <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold bg-white rounded-full text-[#002868]">
                                        <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                                        {report.report_type}
                                    </span>
                                </div>
                                <h1 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">
                                    Report Details
                                </h1>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                                <button
                                    onClick={handleGenerateReport}
                                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 bg-green-600 rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg"
                                >
                                    <FileDown className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Generate Report
                                </button>

                                <button
                                    onClick={handlePrint}
                                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 bg-gray-700 rounded-lg shadow-md hover:bg-gray-800 hover:shadow-lg"
                                >
                                    <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Print
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Report Information Summary - Inside Header Card */}
                    <div className="p-4 bg-white border-t border-gray-100 sm:p-6 md:p-8">
                        <h2 className="flex items-center gap-2 mb-4 text-base font-semibold text-gray-900 sm:mb-5 sm:text-lg">
                            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#002868]" />
                            Report Information
                        </h2>

                        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="p-4 transition-all duration-200 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md hover:bg-white">
                                <span className="block mb-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Report Type
                                </span>
                                <p className="text-base font-semibold text-gray-900">
                                    {report.report_type}
                                </p>
                            </div>

                            <div className="p-4 transition-all duration-200 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md hover:bg-white">
                                <span className="block mb-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Submission Date
                                </span>
                                <p className="text-base font-semibold text-gray-900">
                                    {report.submission_date
                                        ? formatDate(report.submission_date)
                                        : "Not submitted"}
                                </p>
                            </div>

                            <div className="p-4 transition-all duration-200 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md hover:bg-white">
                                <span className="block mb-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Created At
                                </span>
                                <p className="text-base font-semibold text-gray-900">
                                    {formatDate(report.created_at)}
                                </p>
                            </div>

                            <div className="p-4 transition-all duration-200 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md hover:bg-white">
                                <span className="block mb-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Last Updated
                                </span>
                                <p className="text-base font-semibold text-gray-900">
                                    {formatDate(report.updated_at)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transactions Section */}
                <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                <Banknote className="w-5 h-5 text-[#002868]" />
                                Transactions
                                <span className="ml-2 px-2.5 py-0.5 text-xs font-medium bg-[#002868] text-white rounded-full">
                                    {displayedTransactions.length}
                                </span>
                            </h2>
                            {displayedTransactions.length > 0 && (
                                <div className="flex items-center gap-3">
                                    <label className="text-sm text-gray-700">
                                        Entries:
                                        <select
                                            value={pageSize}
                                            onChange={(e) => setPageSize(Number(e.target.value))}
                                            className="ml-2 rounded-md border-gray-300 text-sm focus:border-[#002868] focus:ring-[#002868]"
                                        >
                                            {[5, 10, 25, 50].map((size) => (
                                                <option key={size} value={size}>
                                                    {size}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <div className="text-sm text-gray-600">
                                        Page {page} of {totalPages}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {displayedTransactions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                                            #
                                        </th>
                                        <th
                                            className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase cursor-pointer select-none"
                                            onClick={() => handleSort("transaction_date")}
                                        >
                                            Date
                                        </th>
                                        <th
                                            className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase cursor-pointer select-none"
                                            onClick={() => handleSort("transaction_reference_no")}
                                        >
                                            Reference No
                                        </th>
                                        <th
                                            className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase cursor-pointer select-none"
                                            onClick={() => handleSort("transaction_code")}
                                        >
                                            Code
                                        </th>
                                        <th
                                            className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase cursor-pointer select-none"
                                            onClick={() => handleSort("mode_of_transaction")}
                                        >
                                            Mode
                                        </th>
                                        <th
                                            className="px-6 py-3 text-xs font-semibold tracking-wider text-right text-gray-700 uppercase cursor-pointer select-none"
                                            onClick={() => handleSort("transaction_amount")}
                                        >
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedTransactions.map((transaction, index) => (
                                        <tr
                                            key={transaction.id}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                                {(page - 1) * pageSize + index + 1}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {formatDateTime(transaction.transaction_date, transaction.transaction_time)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {transaction.transaction_reference_no || "—"}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {transaction.transaction_code?.ca_sa || "—"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {transaction.mode_of_transaction?.mode_of_transaction || "—"}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-right text-green-600 whitespace-nowrap">
                                                {formatCurrency(transaction.transaction_amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-16 text-center">
                            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-sm font-medium text-gray-500">
                                No transactions found
                            </p>
                        </div>
                    )}
                </div>

                {displayedTransactions.length > 0 && (
                    <div className="flex flex-col gap-3 px-6 py-4 bg-white border border-t border-gray-200 rounded-b-xl sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-gray-700">
                            Showing {(page - 1) * pageSize + 1}-
                            {Math.min(page * pageSize, sortedTransactions.length)} of {sortedTransactions.length} transactions
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setPage((current) => Math.max(1, current - 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-50 hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                                disabled={page >= totalPages}
                                className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-50 hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Participating Banks Section */}
                {(() => {
                    const allBanks =
                        displayedTransactions.flatMap((t) =>
                            (t.participating_banks || []).map((bank) => ({
                                ...bank,
                                transaction_ref: t.transaction_reference_no,
                                transaction_date: t.transaction_date,
                            }))
                        ) || [];

                    return allBanks.length > 0 ? (
                        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
                            <div className="px-6 py-4 border-b border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
                                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                    <Building2 className="w-5 h-5 text-blue-600" />
                                    Participating Banks
                                    <span className="ml-2 px-2.5 py-0.5 text-xs font-medium bg-blue-600 text-white rounded-full">
                                        {allBanks.length}
                                    </span>
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {allBanks.map((bank, index) => (
                                        <div
                                            key={bank.id || index}
                                            className="p-4 transition-shadow border border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-white hover:shadow-md"
                                        >
                                            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-blue-200">
                                                <span className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white bg-blue-600 rounded-full">
                                                    {index + 1}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {bank.transaction_ref}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-2.5">
                                                <InfoItem
                                                    label="Bank Code"
                                                    value={
                                                        bank.participating_bank
                                                            ?.bank_code
                                                    }
                                                />
                                                <InfoItem
                                                    label="Bank Name"
                                                    value={
                                                        bank.bank_name ||
                                                        bank.participating_bank
                                                            ?.bank
                                                    }
                                                />
                                                <InfoItem
                                                    label="Account No"
                                                    value={bank.account_no}
                                                />
                                                <div>
                                                    <span className="block mb-1 text-xs font-medium text-gray-500">
                                                        Amount
                                                    </span>
                                                    <p className="text-sm font-bold text-green-600">
                                                        {formatCurrency(
                                                            bank.amount
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : null;
                })()}

                {/* CTR Parties Section */}
                {(() => {
                    const formatCodeName = (entity, codeKeys, nameKeys) => {
                        if (!entity) {
                            return "";
                        }

                        const code =
                            codeKeys.map((key) => entity[key]).find(Boolean) ||
                            "";
                        const name =
                            nameKeys.map((key) => entity[key]).find(Boolean) ||
                            "";

                        if (code && name) {
                            return `${code} - ${name}`;
                        }

                        return code || name || "";
                    };
                    const resolvePartyAccountType = (party) => {
                        if (party?.account_type) {
                            return party.account_type;
                        }

                        if (party?.accountType) {
                            return party.accountType;
                        }

                        const transactionForParty = displayedTransactions.find(
                            (transaction) =>
                                (transaction.parties || []).some(
                                    (transactionParty) =>
                                        transactionParty.id === party.id
                                )
                        );

                        return transactionForParty?.account_type || "";
                    };

                    // Get all parties from all displayed transactions
                    const allParties = displayedTransactions.flatMap(t => t.parties || []) || [];

                    // Show all unique parties (including joint account partners)
                    // Even when filtering by party_id, show all parties from those transactions
                    const uniqueParties = allParties.filter((party, index, self) =>
                        index === self.findIndex(p => p.id === party.id)
                    );

                    return uniqueParties.length > 0 ? (
                        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                    <User className="w-5 h-5 text-[#002868]" />
                                    CTR Party Information
                                    <span className="ml-2 px-2.5 py-0.5 text-xs font-medium bg-[#002868] text-white rounded-full">
                                        {uniqueParties.length}
                                    </span>
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-6">
                                    {uniqueParties.map((party, partyIndex) => (
                                    <React.Fragment key={party.id}>
                                    {(() => {
                                            const sourceOfFund =
                                                party.sourceOfFund ||
                                                party.source_of_fund;
                                            const cityLabel = formatCodeName(
                                                party.city,
                                                ["code", "ccode"],
                                                ["city", "name_of_city"]
                                            );
                                            const countryLabel = formatCodeName(
                                                party.countryCode ||
                                                    party.country_code,
                                                ["value", "country_code"],
                                                ["country_name", "country"]
                                            );
                                            const nameFlag =
                                                party.nameFlag ||
                                                party.name_flag;
                                            const partyFlag =
                                                party.partyFlag ||
                                                party.party_flag;
                                            const idType =
                                                party.idType || party.id_type;
                                            const accountType =
                                                resolvePartyAccountType(party) ||
                                                "N/A";

                                            return (
                                                <div
                                                    className="p-6 transition-shadow border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white rounded-xl hover:shadow-lg"
                                                >
                                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                                        <div className="space-y-3">
                                                            <h6 className="flex items-center gap-2 pb-2 text-xs font-bold text-[#002868] uppercase border-b-2 border-gray-300">
                                                                <User className="w-4 h-4" />
                                                                Personal
                                                                Information
                                                            </h6>
                                                        <InfoItem
                                                            label="Name"
                                                            value={[
                                                                party.last_name,
                                                                party.first_name,
                                                                party.middle_name
                                                                    ? `${party.middle_name.charAt(0)}.`
                                                                    : null,
                                                            ]
                                                                .filter(Boolean)
                                                                .join(", ")}
                                                        />
                                                        <InfoItem
                                                            label="Birthdate"
                                                            value={formatDate(
                                                                party.birthdate
                                                            )}
                                                        />
                                                            <InfoItem
                                                                label="Birthplace"
                                                                value={
                                                                    party.birthplace
                                                                }
                                                            />
                                                            <InfoItem
                                                                label="Nationality"
                                                                value={
                                                                    party.nationality
                                                                }
                                                            />
                                                            <InfoItem
                                                                label="Source of Funds"
                                                                value={
                                                                    sourceOfFund
                                                                        ? [
                                                                              sourceOfFund.sof_code ||
                                                                                  sourceOfFund.code,
                                                                              sourceOfFund.title ||
                                                                                  sourceOfFund.description,
                                                                          ]
                                                                              .filter(
                                                                                  Boolean
                                                                              )
                                                                              .join(
                                                                                  " - "
                                                                              )
                                                                        : ""
                                                                }
                                                            />
                                                        </div>

                                                        <div className="space-y-3">
                                                            <h6 className="flex items-center gap-2 pb-2 text-xs font-bold text-[#002868] uppercase border-b-2 border-gray-300">
                                                                <MapPin className="w-4 h-4" />
                                                                Contact &
                                                                Address
                                                            </h6>
                                                            <InfoItem
                                                                label="Address"
                                                                value={
                                                                    party.address
                                                                }
                                                            />
                                                            <InfoItem
                                                                label="City"
                                                                value={
                                                                    cityLabel
                                                                }
                                                            />
                                                            <InfoItem
                                                                label="Country"
                                                                value={
                                                                    countryLabel
                                                                }
                                                            />
                                                            <InfoItem
                                                                label="Contact Number"
                                                                value={
                                                                    party.contact_no
                                                                }
                                                            />
                                                        </div>

                                                        <div className="space-y-3">
                                                            <h6 className="flex items-center gap-2 pb-2 text-xs font-bold text-[#002868] uppercase border-b-2 border-gray-300">
                                                                <CreditCard className="w-4 h-4" />
                                                                Identification
                                                            </h6>
                                                            <InfoItem
                                                                label="Name Flag"
                                                                value={
                                                                    nameFlag
                                                                        ? [
                                                                              nameFlag.name_flag_code ||
                                                                                  nameFlag.code,
                                                                              nameFlag.description,
                                                                          ]
                                                                              .filter(
                                                                                  Boolean
                                                                              )
                                                                              .join(
                                                                                  " - "
                                                                              )
                                                                        : ""
                                                                }
                                                            />
                                                            <InfoItem
                                                                label="Party Flag"
                                                                value={
                                                                    partyFlag
                                                                        ? [
                                                                              partyFlag.party_flag_code ||
                                                                                  partyFlag.par_code ||
                                                                                  partyFlag.code,
                                                                              partyFlag.description ||
                                                                                  partyFlag.details,
                                                                          ]
                                                                              .filter(
                                                                                  Boolean
                                                                              )
                                                                              .join(
                                                                                  " - "
                                                                              )
                                                                        : ""
                                                                }
                                                            />
                                                            <InfoItem
                                                                label="ID Type"
                                                                value={
                                                                    idType
                                                                        ? [
                                                                              idType.id_code ||
                                                                                  idType.code,
                                                                              idType.title ||
                                                                                  idType.description,
                                                                          ]
                                                                              .filter(
                                                                                  Boolean
                                                                              )
                                                                              .join(
                                                                                  " - "
                                                                              )
                                                                        : ""
                                                                }
                                                            />
                                                            <InfoItem
                                                                label="ID Number"
                                                                value={
                                                                    party.id_no
                                                                }
                                                            />
                                                        </div>

                                                        <div className="space-y-3">
                                                            <h6 className="flex items-center gap-2 pb-2 text-xs font-bold text-[#002868] uppercase border-b-2 border-gray-300">
                                                                <Building2 className="w-4 h-4" />
                                                                Account Details
                                                            </h6>
                                                            <InfoItem
                                                                label="Account Number"
                                                                value={
                                                                    party.account_number
                                                                }
                                                            />
                                                            <InfoItem
                                                                label="Customer Ref No"
                                                                value={
                                                                    party.customer_reference_no
                                                                }
                                                            />
                                                            <InfoItem
                                                                label="Account Type"
                                                                value={
                                                                    accountType
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : null;
                })()}
            </div>

            {/* Export Format Dialog */}
            <ExportFormatDialog
                show={showExportDialog}
                onClose={handleCloseDialog}
                allReports={[scopedReport]}
                isSingleReport={true}
            />
        </AppLayout>
    );
}

// Reusable Info Item Component
function InfoItem({ label, value, icon: Icon }) {
    return (
        <div>
            <span className="flex items-center gap-1.5 mb-1 text-xs font-medium text-gray-500">
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {label}
            </span>
            <p className="text-sm font-medium text-gray-900 break-words">
                {value || "—"}
            </p>
        </div>
    );
}
