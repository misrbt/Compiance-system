import { Calendar, FileText, User } from "lucide-react";
import CustomerPicker from "./CustomerPicker";
import TransactionDateSelector from "./TransactionDateSelector";

export default function CustomFilters({
    dateFrom,
    dateTo,
    onDateFromChange,
    onDateToChange,
    transactionCode,
    onTransactionCodeChange,
    transactionCodeListId,
    customerProps,
    transactionDateProps,
    activeFilters,
}) {
    return (
        <div className="mt-4 p-4 bg-white rounded-lg border-2 border-purple-300">
            <div className="mb-4 pb-3 border-b border-purple-200">
                <h4 className="font-bold text-purple-900 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Combine Multiple Filters
                </h4>
                <p className="text-xs text-purple-700 mt-1">Use one or more filters to narrow down your data</p>
            </div>

            <div className="mb-4">
                <label className="flex items-center gap-1 mb-2 text-sm font-semibold text-gray-700">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    Date Range (Optional)
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block mb-1 text-xs text-gray-600">From</label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => onDateFromChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-xs text-gray-600">To</label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => onDateToChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <label className="flex items-center gap-1 mb-2 text-sm font-semibold text-gray-700">
                    <FileText className="w-4 h-4 text-purple-600" />
                    Transaction Code (Optional)
                </label>
                <input
                    type="text"
                    value={transactionCode}
                    onChange={(e) => onTransactionCodeChange(e.target.value)}
                    placeholder="e.g., CDEPC"
                    list={transactionCodeListId}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>

            <CustomerPicker
                label="Customer Name (Optional)"
                placeholder="Start typing to search customer name..."
                helperText="Type to search by name or account number"
                theme="purple"
                {...customerProps}
                extraContent={
                    <TransactionDateSelector
                        theme="purple"
                        heading="Select Transaction Dates"
                        dates={transactionDateProps.dates}
                        selectedDates={transactionDateProps.selectedDates}
                        onToggleDate={transactionDateProps.onToggleDate}
                        onToggleAll={transactionDateProps.onToggleAll}
                        selectAll={transactionDateProps.selectAll}
                    />
                }
            />

            {(activeFilters.dateRange || activeFilters.transactionCode || activeFilters.customerName) && (
                <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-xs font-semibold text-purple-900 mb-2">Active Filters:</p>
                    <div className="space-y-1 text-xs text-purple-700">
                        {activeFilters.dateRange && (
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>Date: {activeFilters.dateRange}</span>
                            </div>
                        )}
                        {activeFilters.transactionCode && (
                            <div className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                <span>Transaction Code: {activeFilters.transactionCode}</span>
                            </div>
                        )}
                        {activeFilters.customerName && (
                            <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>Customer: {activeFilters.customerName}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
