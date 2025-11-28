import { Calendar } from "lucide-react";

export default function TransactionDateFilter({
    mode,
    onModeChange,
    dateFrom,
    dateTo,
    singleDate,
    onDateFromChange,
    onDateToChange,
    onSingleDateChange,
}) {
    return (
        <div className="mt-4 p-4 bg-white rounded-lg border-2 border-green-300">
            <div className="mb-4 pb-3 border-b border-green-200">
                <h4 className="font-bold text-green-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Transaction Date
                </h4>
                <p className="text-xs text-gray-600 mt-1">Filter by the date when the transaction occurred</p>
            </div>

            <div className="flex p-1 mb-4 bg-gray-100 rounded-lg w-fit">
                <button
                    onClick={() => onModeChange("range")}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                        mode === "range" ? "bg-white text-green-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                    type="button"
                >
                    Date Range
                </button>
                <button
                    onClick={() => onModeChange("single")}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                        mode === "single" ? "bg-white text-green-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                    type="button"
                >
                    Specific Date
                </button>
            </div>

            {mode === "range" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">From Date</label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => onDateFromChange(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">To Date</label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => onDateToChange(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                </div>
            ) : (
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Select Date</label>
                    <input
                        type="date"
                        value={singleDate}
                        onChange={(e) => onSingleDateChange(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                </div>
            )}

            {mode === "range" && dateFrom && dateTo && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-xs font-semibold text-green-900">
                        Filtering transactions from {new Date(dateFrom).toLocaleDateString()} to{" "}
                        {new Date(dateTo).toLocaleDateString()}
                    </p>
                </div>
            )}

            {mode === "single" && singleDate && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-xs font-semibold text-green-900">
                        Filtering transactions on {new Date(singleDate).toLocaleDateString()}
                    </p>
                </div>
            )}
        </div>
    );
}
