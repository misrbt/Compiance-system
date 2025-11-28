import { formatDisplayDate } from "./helpers";

export default function TransactionList({
    transactions,
    selectedTransactionIds,
    onToggleTransaction,
    onToggleAll,
    allSelected,
    heading,
}) {
    if (!transactions?.length) {
        return null;
    }

    const selectedCount = selectedTransactionIds.filter((id) =>
        transactions.some((transaction) => transaction.id === id)
    ).length;

    return (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-900">{heading}</label>
                <button
                    type="button"
                    onClick={() => onToggleAll(transactions)}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 underline"
                >
                    {allSelected ? "Deselect All" : "Select All"}
                </button>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2">
                {transactions.map((transaction) => (
                    <label
                        key={transaction.id}
                        className="flex items-center gap-3 p-3 bg-white border border-blue-100 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                    >
                        <input
                            type="checkbox"
                            checked={selectedTransactionIds.includes(transaction.id)}
                            onChange={() => onToggleTransaction(transaction.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
                        />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                                {formatDisplayDate(transaction.transactionDate)}
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5">
                                Amount: {transaction.amount ?? 0} | Code: {transaction.transactionCode || "N/A"}
                            </p>
                        </div>
                    </label>
                ))}
            </div>
            <p className="mt-2 text-xs text-blue-700">
                {selectedCount} of {transactions.length} transactions selected
            </p>
        </div>
    );
}
