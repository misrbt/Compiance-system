import {
    FileSpreadsheet,
    Calendar,
    FileText,
    X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { exportToCSV, exportToExcel } from "@/services/ctrExportService";
import CriteriaSelector from "./export-dialog/CriteriaSelector";
import CustomerPicker from "./export-dialog/CustomerPicker";
import CustomFilters from "./export-dialog/CustomFilters";
import DialogFooter from "./export-dialog/DialogFooter";
import FormatSelector from "./export-dialog/FormatSelector";
import RecordSummary from "./export-dialog/RecordSummary";
import SubmissionTypeSelector from "./export-dialog/SubmissionTypeSelector";
import TransactionDateFilter from "./export-dialog/TransactionDateFilter";
import TransactionList from "./export-dialog/TransactionList";
import { motion, AnimatePresence } from "framer-motion";
import {
    buildCustomerList,
    countTransactions,
    filterReportsByCriteria,
    getCustomerTransactionDates,
    getCustomerTransactions,
    getCustomerTransactionsByPartyIds,
    normalizeDateValue,
    normalizeNameParts,
} from "./export-dialog/helpers";

function SectionCard({ title, description, icon: Icon, children }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-start gap-3 px-5 py-4 border-b border-gray-100">
                {Icon && (
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green-50 text-green-700">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    {description && <p className="text-sm text-gray-600">{description}</p>}
                </div>
            </div>
            <div className="p-5 space-y-4">{children}</div>
        </div>
    );
}

export default function ExportFormatDialog({ show, onClose, allReports, isSingleReport = false }) {
    const singleReportDefaultCriteria = isSingleReport ? "all" : "all";
    const [exportCriteria, setExportCriteria] = useState(singleReportDefaultCriteria);

    // Date filters
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [singleDate, setSingleDate] = useState("");
    const [transactionDateFrom, setTransactionDateFrom] = useState("");
    const [transactionDateTo, setTransactionDateTo] = useState("");
    const [singleTransactionDate, setSingleTransactionDate] = useState("");
    const [transactionDateMode, setTransactionDateMode] = useState("range");

    // Transaction code filter
    const [transactionCode, setTransactionCode] = useState("");

    // Customer filter (main)
    const [customerName, setCustomerName] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [availableTransactions, setAvailableTransactions] = useState([]);
    const [selectedTransactionIds, setSelectedTransactionIds] = useState([]);

    // Custom filters
    const [customDateFrom, setCustomDateFrom] = useState("");
    const [customDateTo, setCustomDateTo] = useState("");
    const [customTransactionCode, setCustomTransactionCode] = useState("");
    const [customCustomerName, setCustomCustomerName] = useState("");
    const [customSelectedCustomer, setCustomSelectedCustomer] = useState(null);
    const [customSearchQuery, setCustomSearchQuery] = useState("");
    const [customFilteredCustomers, setCustomFilteredCustomers] = useState([]);
    const [customShowDropdown, setCustomShowDropdown] = useState(false);
    const [customAvailableTransactionDates, setCustomAvailableTransactionDates] = useState([]);
    const [customSelectedTransactionDates, setCustomSelectedTransactionDates] = useState([]);
    const [customSelectAllDates, setCustomSelectAllDates] = useState(true);

    // Export selection
    const [selectedFormat, setSelectedFormat] = useState(null);
    const [submissionType, setSubmissionType] = useState("A");

    // Refs
    const dropdownRef = useRef(null);
    const customDropdownRef = useRef(null);

    const allCustomers = useMemo(() => buildCustomerList(allReports), [allReports]);
    const transactionCodeOptions = useMemo(() => {
        const codes = new Set();

        allReports.forEach((report) => {
            report.transactions?.forEach((transaction) => {
                const code = transaction.transaction_code?.ca_sa;
                if (code) {
                    codes.add(code.toUpperCase());
                }
            });
        });

        return Array.from(codes).sort();
    }, [allReports]);
    const transactionCodeListId = "transaction-code-options";

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (customDropdownRef.current && !customDropdownRef.current.contains(event.target)) {
                setCustomShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Update dates/transactions when customer changes
    useEffect(() => {
        if (!selectedCustomer) {
            setAvailableTransactions([]);
            setSelectedTransactionIds([]);
            return;
        }

        // Use party_ids from API search result to get transactions
        const transactions = getCustomerTransactionsByPartyIds(allReports, selectedCustomer.party_ids || [selectedCustomer.id]);
        setAvailableTransactions(transactions);
        setSelectedTransactionIds(transactions.map((transaction) => transaction.id));
    }, [allReports, selectedCustomer]);

    useEffect(() => {
        if (!customSelectedCustomer) {
            setCustomAvailableTransactionDates([]);
            setCustomSelectedTransactionDates([]);
            setCustomSelectAllDates(true);
            return;
        }

        const dates = getCustomerTransactionDates(allReports, customSelectedCustomer.fullName);
        setCustomAvailableTransactionDates(dates);
        setCustomSelectedTransactionDates(dates);
        setCustomSelectAllDates(true);
    }, [allReports, customSelectedCustomer]);



    const normalizedCustomSelectedTransactionDates = useMemo(
        () => customSelectedTransactionDates.map(normalizeDateValue),
        [customSelectedTransactionDates]
    );

    const aggregateReportsByCustomer = (reports = []) => {
        const grouped = new Map();

        reports.forEach((report) => {
            report.transactions?.forEach((transaction) => {
                const party = transaction?.parties?.[0];
                if (!party) {
                    return;
                }

                const partyKey = normalizeNameParts(party.first_name, party.middle_name, party.last_name);

                if (!grouped.has(partyKey)) {
                    grouped.set(partyKey, { ...report, transactions: [] });
                }

                grouped.get(partyKey).transactions.push(transaction);
            });
        });

        return Array.from(grouped.values());
    };

    const visibleTransactions = useMemo(() => {
        return availableTransactions;
    }, [availableTransactions]);

    const areAllVisibleTransactionsSelected =
        visibleTransactions.length > 0 &&
        visibleTransactions.every((transaction) => selectedTransactionIds.includes(transaction.id));

    const filteredRecords = useMemo(() => {
        if (exportCriteria === "all") {
            return aggregateReportsByCustomer(allReports);
        }

        return filterReportsByCriteria(allReports, {
            criteria: exportCriteria,
            dateFrom,
            dateTo,
            singleDate,
            transactionCode,
            transactionDateMode,
            transactionDateFrom,
            transactionDateTo,
            singleTransactionDate,
            customerName,
            selectedTransactionIds,
            customDateFrom,
            customDateTo,
            customTransactionCode,
            customCustomerName,
            normalizedCustomSelectedTransactionDates,
        });
    }, [
        allReports,
        exportCriteria,
        dateFrom,
        dateTo,
        singleDate,
        transactionCode,
        transactionDateMode,
        transactionDateFrom,
        transactionDateTo,
        singleTransactionDate,
        customerName,
        selectedTransactionIds,
        selectedTransactionIds,
        customDateFrom,
        customDateTo,
        customTransactionCode,
        customCustomerName,
        normalizedCustomSelectedTransactionDates,
    ]);

    // Show number of reports included (not transactions) to match expected record count
    const recordCount = useMemo(() => filteredRecords.length, [filteredRecords]);

    const allowedCriteria = useMemo(
        () => (isSingleReport ? ["all", "transactionDateRange", "transactionCode"] : null),
        [isSingleReport]
    );

    useEffect(() => {
        if (!allowedCriteria) {
            return;
        }

        if (!allowedCriteria.includes(exportCriteria)) {
            setExportCriteria(allowedCriteria[0]);
        }
    }, [allowedCriteria, exportCriteria]);

    // Search for customers using backend API (like Quick Transaction)
    useEffect(() => {
        let active = true;

        // Don't search if a customer is already selected
        if (selectedCustomer) {
            setFilteredCustomers([]);
            setShowDropdown(false);
            return;
        }

        if (searchQuery.length >= 1) {
            const delayDebounceFn = setTimeout(() => {
                axios
                    .get("/api/search-parties", {
                        params: { query: searchQuery },
                    })
                    .then((response) => {
                        if (!active) return;
                        // Map API response to customer format
                        const customers = response.data.map((party) => ({
                            id: party.id,
                            party_ids: party.party_ids,
                            fullName: party.full_name,
                            firstName: party.first_name,
                            lastName: party.last_name,
                            accountNo: party.account_number || "",
                            is_joint_account: party.is_joint_account,
                        }));
                        setFilteredCustomers(customers);
                        setShowDropdown(true);
                    })
                    .catch((error) => {
                        if (!active) return;
                        console.error("Customer search error:", error);
                        setFilteredCustomers([]);
                    });
            }, 300);

            return () => {
                active = false;
                clearTimeout(delayDebounceFn);
            };
        } else {
            setFilteredCustomers([]);
            setShowDropdown(false);
        }
    }, [searchQuery, selectedCustomer]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setSelectedCustomer(null);
        setCustomerName("");
    };

    const handleCustomerSelect = (customer) => {
        setSelectedCustomer(customer);
        setCustomerName(customer.fullName);
        setSearchQuery(customer.fullName);
        setFilteredCustomers([]); // Clear to prevent "No customers found" message
        setShowDropdown(false);
    };

    const handleClearCustomer = () => {
        setSelectedCustomer(null);
        setCustomerName("");
        setSearchQuery("");
        setFilteredCustomers([]);
        setShowDropdown(false);
    };

    // Search for custom customers using backend API
    useEffect(() => {
        if (customSearchQuery.length >= 1) {
            const delayDebounceFn = setTimeout(() => {
                axios
                    .get("/api/search-parties", {
                        params: { query: customSearchQuery },
                    })
                    .then((response) => {
                        const customers = response.data.map((party) => ({
                            id: party.id,
                            party_ids: party.party_ids,
                            fullName: party.full_name,
                            firstName: party.first_name,
                            lastName: party.last_name,
                            accountNo: party.account_number || "",
                            is_joint_account: party.is_joint_account,
                        }));
                        setCustomFilteredCustomers(customers);
                        setCustomShowDropdown(true);
                    })
                    .catch((error) => {
                        console.error("Custom customer search error:", error);
                        setCustomFilteredCustomers([]);
                    });
            }, 300);

            return () => clearTimeout(delayDebounceFn);
        } else {
            setCustomFilteredCustomers([]);
            setCustomShowDropdown(false);
        }
    }, [customSearchQuery]);

    const handleCustomSearchChange = (e) => {
        const value = e.target.value;
        setCustomSearchQuery(value);
        setCustomSelectedCustomer(null);
        setCustomCustomerName(value);
    };

    const handleCustomCustomerSelect = (customer) => {
        setCustomSelectedCustomer(customer);
        setCustomCustomerName(customer.fullName);
        setCustomSearchQuery(customer.fullName);
        setCustomFilteredCustomers([]); // Clear to prevent "No customers found" message
        setCustomShowDropdown(false);
    };

    const handleClearCustomCustomer = () => {
        setCustomSelectedCustomer(null);
        setCustomCustomerName("");
        setCustomSearchQuery("");
        setCustomFilteredCustomers([]);
        setCustomShowDropdown(false);
    };


    const handleCustomDateToggle = (date) => {
        if (customSelectedTransactionDates.includes(date)) {
            const newDates = customSelectedTransactionDates.filter((d) => d !== date);
            setCustomSelectedTransactionDates(newDates);
            setCustomSelectAllDates(newDates.length === customAvailableTransactionDates.length);
        } else {
            const newDates = [...customSelectedTransactionDates, date];
            setCustomSelectedTransactionDates(newDates);
            setCustomSelectAllDates(newDates.length === customAvailableTransactionDates.length);
        }
    };

    const handleCustomSelectAllDatesToggle = () => {
        if (customSelectAllDates) {
            setCustomSelectedTransactionDates([]);
            setCustomSelectAllDates(false);
        } else {
            setCustomSelectedTransactionDates([...customAvailableTransactionDates]);
            setCustomSelectAllDates(true);
        }
    };

    const handleTransactionToggle = (transactionId) => {
        setSelectedTransactionIds((current) =>
            current.includes(transactionId)
                ? current.filter((id) => id !== transactionId)
                : [...current, transactionId]
        );
    };

    const handleSelectAllTransactionsToggle = (transactionsToToggle) => {
        const idsToToggle = transactionsToToggle.map((transaction) => transaction.id);
        const areAllSelected =
            idsToToggle.length > 0 && idsToToggle.every((id) => selectedTransactionIds.includes(id));

        if (areAllSelected) {
            setSelectedTransactionIds((current) => current.filter((id) => !idsToToggle.includes(id)));
        } else {
            setSelectedTransactionIds((current) => Array.from(new Set([...current, ...idsToToggle])));
        }
    };

    const resetDialog = () => {
        setExportCriteria(singleReportDefaultCriteria);
        setDateFrom("");
        setDateTo("");
        setSingleDate("");
        setTransactionCode("");
        setCustomerName("");
        setSelectedCustomer(null);
        setSearchQuery("");
        setFilteredCustomers([]);
        setShowDropdown(false);
        setAvailableTransactions([]);
        setSelectedTransactionIds([]);
        setCustomDateFrom("");
        setCustomDateTo("");
        setCustomTransactionCode("");
        setCustomCustomerName("");
        setCustomSelectedCustomer(null);
        setCustomSearchQuery("");
        setCustomFilteredCustomers([]);
        setCustomShowDropdown(false);
        setCustomAvailableTransactionDates([]);
        setCustomSelectedTransactionDates([]);
        setCustomSelectAllDates(true);
        setSelectedFormat(null);
        setSubmissionType("A");
        setTransactionDateMode("range");
        setSingleTransactionDate("");
        setTransactionDateFrom("");
        setTransactionDateTo("");
    };

    const handleClose = () => {
        resetDialog();
        onClose();
    };

    const handleDownload = () => {
        if (!selectedFormat) {
            Swal.fire({
                icon: "warning",
                title: "No Format Selected",
                text: "Please select an export format (Excel or CSV).",
            });
            return;
        }

        if (recordCount === 0) {
            Swal.fire({
                icon: "warning",
                title: "No Data",
                text: "No records found matching your export criteria.",
            });
            return;
        }

        try {
            if (selectedFormat === "excel") {
                exportToExcel(filteredRecords, null, submissionType);
                Swal.fire({
                    icon: "success",
                    title: "Excel Exported Successfully!",
                    text: `${recordCount} ${recordCount === 1 ? "record" : "records"} exported to Excel.`,
                    timer: 3000,
                    showConfirmButton: true,
                });
            } else {
                exportToCSV(filteredRecords, null, submissionType);
                Swal.fire({
                    icon: "success",
                    title: "CSV Exported Successfully!",
                    text: `${recordCount} ${recordCount === 1 ? "record" : "records"} exported to CSV.`,
                    timer: 3000,
                    showConfirmButton: true,
                });
            }

            onClose();
            resetDialog();
        } catch (error) {
            console.error("Export error:", error);
            Swal.fire({
                icon: "error",
                title: "Export Failed",
                text: error.message || "An error occurred during export.",
            });
        }
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    <div
                        className="fixed inset-0 bg-black/60"
                        onClick={handleClose}
                        aria-label="Close dialog"
                    ></div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-hidden"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="dialog-title"
                    >
                        <div className="overflow-y-auto max-h-[90vh] bg-gray-50">
                            <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-gradient-to-r from-green-600 to-green-700 text-white shadow-sm">
                                <div>
                                    <h2 id="dialog-title" className="text-2xl font-bold flex items-center gap-2">
                                        <FileSpreadsheet className="w-6 h-6" />
                                        Export CTR Reports
                                    </h2>
                                    <p className="text-sm text-green-100">Choose your filters and export format</p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 rounded-full hover:bg-green-500 transition-colors"
                                    aria-label="Close dialog"
                                    type="button"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                                    <div className="space-y-4">
                                        <SectionCard
                                            title="Export Criteria"
                                            description="Pick how you want to narrow down the records before exporting."
                                            icon={FileText}
                                        >
                                            <CriteriaSelector
                                                value={exportCriteria}
                                                onChange={setExportCriteria}
                                                allowedKeys={allowedCriteria}
                                            />
                                        </SectionCard>

                                        <SectionCard
                                            title="Filter Details"
                                            description="Adjust the fields that correspond to your selected criterion."
                                            icon={Calendar}
                                        >
                                            <div className="space-y-4">
                                                {exportCriteria === "all" && (
                                                    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                                                        Exporting all available records. Switch criteria to limit the
                                                        export.
                                                    </div>
                                                )}

                                                {exportCriteria === "dateRange" && (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                                                Date From
                                                            </label>
                                                            <input
                                                                type="date"
                                                                value={dateFrom}
                                                                onChange={(e) => setDateFrom(e.target.value)}
                                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                                                Date To
                                                            </label>
                                                            <input
                                                                type="date"
                                                                value={dateTo}
                                                                onChange={(e) => setDateTo(e.target.value)}
                                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {exportCriteria === "singleDate" && (
                                                    <div className="grid grid-cols-1 gap-4">
                                                        <div>
                                                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                                                Select Date
                                                            </label>
                                                            <input
                                                                type="date"
                                                                value={singleDate}
                                                                onChange={(e) => setSingleDate(e.target.value)}
                                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                            {exportCriteria === "transactionCode" && (
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Transaction Code
                                        </label>
                                        <input
                                            type="text"
                                            value={transactionCode}
                                            onChange={(e) => setTransactionCode(e.target.value)}
                                            placeholder="e.g., CDEPC"
                                            list={transactionCodeListId}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                </div>
                            )}

                                                {exportCriteria === "customerName" && (
                                                    <CustomerPicker
                                                        label="Customer Name"
                                                        placeholder="Start typing to search customer name..."
                                                        helperText="Type to search by name or account number"
                                                        searchQuery={searchQuery}
                                                        onSearchChange={handleSearchChange}
                                                        selectedCustomer={selectedCustomer}
                                                        onClear={handleClearCustomer}
                                                        filteredCustomers={filteredCustomers}
                                                        showDropdown={showDropdown}
                                                        dropdownRef={dropdownRef}
                                                        onSelectCustomer={handleCustomerSelect}
                                                        extraContent={
                                                            <TransactionList
                                                                heading="Transactions"
                                                                transactions={visibleTransactions}
                                                                selectedTransactionIds={selectedTransactionIds}
                                                                onToggleTransaction={handleTransactionToggle}
                                                                onToggleAll={handleSelectAllTransactionsToggle}
                                                                allSelected={areAllVisibleTransactionsSelected}
                                                            />
                                                        }
                                                    />
                                                )}

                                                {exportCriteria === "transactionDateRange" && (
                                                    <TransactionDateFilter
                                                        mode={transactionDateMode}
                                                        onModeChange={setTransactionDateMode}
                                                        dateFrom={transactionDateFrom}
                                                        dateTo={transactionDateTo}
                                                        singleDate={singleTransactionDate}
                                                        onDateFromChange={setTransactionDateFrom}
                                                        onDateToChange={setTransactionDateTo}
                                                        onSingleDateChange={setSingleTransactionDate}
                                                    />
                                                )}

                                                {exportCriteria === "custom" && (
                                                    <CustomFilters
                                                        dateFrom={customDateFrom}
                                                        dateTo={customDateTo}
                                                        onDateFromChange={setCustomDateFrom}
                                                        onDateToChange={setCustomDateTo}
                                                    transactionCode={customTransactionCode}
                                                    onTransactionCodeChange={setCustomTransactionCode}
                                                    transactionCodeListId={transactionCodeListId}
                                                    customerProps={{
                                                        searchQuery: customSearchQuery,
                                                        onSearchChange: handleCustomSearchChange,
                                                        selectedCustomer: customSelectedCustomer,
                                                        onClear: handleClearCustomCustomer,
                                                            filteredCustomers: customFilteredCustomers,
                                                            showDropdown: customShowDropdown,
                                                            dropdownRef: customDropdownRef,
                                                            onSelectCustomer: handleCustomCustomerSelect,
                                                        }}
                                                        transactionDateProps={{
                                                            dates: customAvailableTransactionDates,
                                                            selectedDates: customSelectedTransactionDates,
                                                            onToggleDate: handleCustomDateToggle,
                                                            onToggleAll: handleCustomSelectAllDatesToggle,
                                                            selectAll: customSelectAllDates,
                                                        }}
                                                        activeFilters={{
                                                            dateRange:
                                                                customDateFrom && customDateTo
                                                                    ? `${customDateFrom} to ${customDateTo}`
                                                                    : "",
                                                            transactionCode: customTransactionCode,
                                                            customerName: customCustomerName,
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </SectionCard>
                                    </div>

                                    <div className="space-y-4">
                                        <SectionCard
                                            title="Review & Export"
                                            description="Confirm the records to export and choose your file output."
                                            icon={FileSpreadsheet}
                                        >
                                            <div className="space-y-4">
                                                <RecordSummary recordCount={recordCount} hidden={isSingleReport} />
                                                <SubmissionTypeSelector
                                                    value={submissionType}
                                                    onChange={setSubmissionType}
                                                    isSingleReport={isSingleReport}
                                                    step={isSingleReport ? "1" : "2"}
                                                />
                                                <FormatSelector
                                                    value={selectedFormat}
                                                    onChange={setSelectedFormat}
                                                    step={isSingleReport ? "2" : "3"}
                                                />
                                            </div>
                                        </SectionCard>
                                    </div>
                                </div>
                            </div>

                            {transactionCodeOptions.length > 0 && (
                                <datalist id={transactionCodeListId}>
                                    {transactionCodeOptions.map((code) => (
                                        <option key={code} value={code} />
                                    ))}
                                </datalist>
                            )}

                            <DialogFooter
                                onCancel={handleClose}
                                onDownload={handleDownload}
                                selectedFormat={selectedFormat}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
