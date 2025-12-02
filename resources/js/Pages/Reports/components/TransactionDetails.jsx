export default function TransactionDetails({
    data,
    referenceData,
    updateTransaction,
    transactionType,
}) {
    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-[#002868] mb-4 flex items-center">
                Transaction Details
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Transaction Reference Number{" "}
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.transactions[0].transaction_reference_no}
                        onChange={(e) =>
                            updateTransaction(
                                "transaction_reference_no",
                                e.target.value
                            )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Mode of Transaction{" "}
                        <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={data.transactions[0].mode_of_transaction_id}
                        onChange={(e) =>
                            updateTransaction(
                                "mode_of_transaction_id",
                                e.target.value
                            )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868] max-h-60 overflow-y-auto"
                        size="1"
                        required
                    >
                        <option value="">Select mode</option>
                        {referenceData.modeOfTransactions.map((mode) => (
                            <option key={mode.id} value={mode.id}>
                                {mode.mod_code} - {mode.mode_of_transaction}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Transaction Amount{" "}
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={data.transactions[0].transaction_amount}
                        onChange={(e) =>
                            updateTransaction(
                                "transaction_amount",
                                e.target.value
                            )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Transaction Code <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={data.transactions[0].transaction_code_id}
                        onChange={(e) =>
                            updateTransaction(
                                "transaction_code_id",
                                e.target.value
                            )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                        required
                    >
                        <option value="">Select transaction code</option>
                        {referenceData.transactionCodes?.map((code) => (
                            <option
                                key={code.id}
                                value={code.id}
                                className={code.ca_sa === transactionType ? "font-bold bg-blue-50" : ""}
                            >
                                {code.ca_sa} - {code.transaction_title}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Transaction Date{" "}
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={data.transactions[0].transaction_date || ''}
                        onChange={(e) =>
                            updateTransaction(
                                "transaction_date",
                                e.target.value
                            )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Transaction Time{" "}
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="time"
                        step="1"
                        value={data.transactions[0].transaction_time || ''}
                        onChange={(e) =>
                            updateTransaction(
                                "transaction_time",
                                e.target.value
                            )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                        required
                    />
                </div>
            </div>
        </div>
    );
}
