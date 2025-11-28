import { Head, Link, useForm } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { ArrowLeft, Save } from "lucide-react";
import Swal from "sweetalert2";
import TransactionDetails from "./components/TransactionDetails";

export default function EditTransaction({
    report,
    reportType,
    transactionType,
    referenceData,
    partyName,
}) {

    // Helper function to format date for input[type="date"]
    const formatDateForInput = (date) => {
        if (!date) return "";
        if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return date;
        }
        try {
            const d = new Date(date);
            return d.toISOString().split("T")[0];
        } catch {
            return "";
        }
    };

    // Initialize form with all transactions for this customer/party
    const { data, setData, put, processing } = useForm({
        report_type: report.report_type,
        transaction_type: transactionType,
        submission_date: formatDateForInput(report.submission_date),
        transactions: report.transactions.map((transaction) => ({
            transaction_id: transaction.id,
            transaction_reference_no:
                transaction.transaction_reference_no ?? "",
            mode_of_transaction_id: transaction.mode_of_transaction_id
                ? String(transaction.mode_of_transaction_id)
                : "",
            transaction_amount: transaction.transaction_amount ?? "",
            transaction_code_id: transaction.transaction_code_id
                ? String(transaction.transaction_code_id)
                : "",
            transaction_date: formatDateForInput(transaction.transaction_date),
            account_number: transaction.account_number ?? "",
        })),
    });

    const updateTransaction = (transactionIndex, field, value) => {
        const updatedTransactions = [...data.transactions];
        updatedTransactions[transactionIndex] = {
            ...updatedTransactions[transactionIndex],
            [field]: value,
        };
        setData("transactions", updatedTransactions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        put(`/reports/${report.id}/update-transactions`, {
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Transactions updated successfully",
                    timer: 2000,
                    showConfirmButton: false,
                });
            },
            onError: () => {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Please check all required fields",
                });
            },
        });
    };

    return (
        <AppLayout>
            <Head title={`Edit Transactions - ${partyName}`} />

            <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <Link
                    href="/reports/browse-ctr"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-[#002868] mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Reports
                </Link>

                <div className="mb-6">
                    <div className="flex items-center mb-2 space-x-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#002868] text-white text-sm font-medium">
                            {reportType}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-800 bg-gray-100 rounded-full">
                            {transactionType}
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-[#002868]">
                        Edit Transactions for {partyName}
                    </h1>
                    <p className="mt-1 text-gray-600">
                        {data.transactions.length} transaction
                        {data.transactions.length !== 1 ? "s" : ""} found for
                        this customer
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* List of Transactions */}
                    <div className="space-y-4">
                        {data.transactions.map((transaction, index) => (
                            <div
                                key={index}
                                className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm"
                            >
                                {/* Transaction Header */}
                                <div className="flex items-center p-4 space-x-4 bg-gradient-to-r from-blue-50 to-white">
                                    <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-bold text-white rounded-full bg-[#002868]">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#002868]">
                                            Transaction Ref:{" "}
                                            {transaction.transaction_reference_no ||
                                                "N/A"}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Amount: ₱
                                            {parseFloat(
                                                transaction.transaction_amount ||
                                                    0
                                            ).toLocaleString()}
                                            {" • "}
                                            Date:{" "}
                                            {transaction.transaction_date
                                                ? new Date(
                                                      transaction.transaction_date
                                                  ).toLocaleDateString()
                                                : "Not set"}
                                        </p>
                                    </div>
                                </div>

                                {/* Transaction Form - Always Visible */}
                                <div className="p-6 border-t">
                                    <TransactionDetails
                                        data={{
                                            transactions: [transaction],
                                        }}
                                        referenceData={referenceData}
                                        updateTransaction={(field, value) =>
                                            updateTransaction(
                                                index,
                                                field,
                                                value
                                            )
                                        }
                                        transactionType={transactionType}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4">
                        <Link
                            href="/reports/browse-ctr"
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center px-6 py-2.5 bg-[#002868] hover:bg-[#001a4d] text-white rounded-md transition-colors disabled:opacity-50"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            {processing
                                ? "Updating..."
                                : "Update All Transactions"}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
