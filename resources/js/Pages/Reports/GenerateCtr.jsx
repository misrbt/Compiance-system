import { Head } from "@inertiajs/react";
import { FileText, Calendar, User, CreditCard, Building2, Phone, MapPin, Printer } from "lucide-react";

export default function GenerateCtr({ reports, filters }) {
    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(amount);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-white">
            <Head title="CTR Reports - Generated" />

            {/* Print Button - Hidden when printing */}
            <div className="fixed top-4 right-4 no-print">
                <button
                    onClick={handlePrint}
                    className="inline-flex items-center px-6 py-3 bg-[#002868] hover:bg-[#001a4d] text-white rounded-lg shadow-lg transition-colors"
                >
                    <Printer className="w-5 h-5 mr-2" />
                    Print Report
                </button>
            </div>

            <div className="px-8 py-12 mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 text-center border-b-4 border-[#002868] pb-6">
                    <h1 className="text-4xl font-bold text-[#002868] mb-2">
                        Covered Transaction Report (CTR)
                    </h1>
                    <p className="text-lg text-gray-600">
                        AMLA Compliance Report
                    </p>
                    {(filters.date_from || filters.date_to) && (
                        <p className="mt-2 text-sm text-gray-500">
                            Report Period: {filters.date_from ? formatDate(filters.date_from) : 'All'} - {filters.date_to ? formatDate(filters.date_to) : 'Present'}
                        </p>
                    )}
                    <p className="text-sm text-gray-500">
                        Generated on: {formatDate(new Date())}
                    </p>
                </div>

                {/* Summary */}
                <div className="mb-8 p-6 bg-gray-50 rounded-lg border-2 border-[#002868]">
                    <h2 className="text-xl font-bold text-[#002868] mb-3">Report Summary</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Total Reports</p>
                            <p className="text-2xl font-bold text-[#002868]">{reports.length}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Amount</p>
                            <p className="text-2xl font-bold text-[#002868]">
                                {formatCurrency(
                                    reports.reduce(
                                        (sum, r) =>
                                            sum +
                                            r.transactions.reduce(
                                                (tSum, t) => tSum + parseFloat(t.transaction_amount || 0),
                                                0
                                            ),
                                        0
                                    )
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Transactions</p>
                            <p className="text-2xl font-bold text-[#002868]">
                                {reports.reduce((sum, r) => sum + r.transactions.length, 0)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Reports */}
                {reports.map((report, reportIndex) => (
                    <div
                        key={report.id}
                        className="mb-12 break-inside-avoid"
                    >
                        <div className="bg-white border-2 border-[#002868] rounded-lg overflow-hidden">
                            {/* Report Header */}
                            <div className="bg-[#002868] text-white p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-6 h-6" />
                                        <div>
                                            <h3 className="text-lg font-bold">Report #{reportIndex + 1}</h3>
                                            <p className="text-sm opacity-90">ID: {report.id}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm opacity-90">Submission Date</p>
                                        <p className="font-semibold">{formatDate(report.submission_date)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Transactions */}
                            {report.transactions.map((transaction, transIndex) => (
                                <div
                                    key={transIndex}
                                    className="p-6 border-b border-gray-200 last:border-b-0"
                                >
                                    <h4 className="text-lg font-semibold text-[#002868] mb-4 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5" />
                                        Transaction {transIndex + 1}: {transaction.transaction_code?.transaction_title || "N/A"}
                                    </h4>

                                    {/* Transaction Details */}
                                    <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded">
                                        <div>
                                            <p className="text-xs text-gray-600">Reference Number</p>
                                            <p className="font-semibold">{transaction.transaction_reference_no || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Transaction Date</p>
                                            <p className="font-semibold">{formatDate(transaction.transaction_date)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Transaction Type</p>
                                            <p className="font-semibold">{transaction.transaction_code?.ca_sa || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Mode of Transaction</p>
                                            <p className="font-semibold">{transaction.mode_of_transaction?.mode_of_transaction || "N/A"}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs text-gray-600">Transaction Amount</p>
                                            <p className="text-xl font-bold text-[#002868]">{formatCurrency(transaction.transaction_amount)}</p>
                                        </div>
                                    </div>

                                    {/* Parties */}
                                    <div className="mb-4">
                                        <h5 className="text-md font-semibold text-[#002868] mb-3 flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Parties Involved ({transaction.parties?.length || 0})
                                        </h5>
                                        {transaction.parties?.map((party, partyIndex) => (
                                            <div
                                                key={partyIndex}
                                                className="mb-3 p-4 border border-gray-300 rounded bg-white"
                                            >
                                                <p className="font-semibold text-[#002868] mb-2">
                                                    {party.last_name}, {party.first_name} {party.middle_name}
                                                </p>
                                                <div className="grid grid-cols-3 gap-3 text-sm">
                                                    <div>
                                                        <p className="text-xs text-gray-600">Party Type</p>
                                                        <p>{party.party_flag?.details || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-600">Name Type</p>
                                                        <p>{party.name_flag?.description || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-600">Birthdate</p>
                                                        <p>{formatDate(party.birthdate)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-600">ID Type</p>
                                                        <p>{party.id_type?.id_code || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-600">ID Number</p>
                                                        <p>{party.id_no || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-600">Contact</p>
                                                        <p>{party.contact_no || "N/A"}</p>
                                                    </div>
                                                    <div className="col-span-3">
                                                        <p className="text-xs text-gray-600">Address</p>
                                                        <p>{party.address || "N/A"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Participating Banks */}
                                    {transaction.participating_banks?.length > 0 && (
                                        <div>
                                            <h5 className="text-md font-semibold text-[#002868] mb-3 flex items-center gap-2">
                                                <Building2 className="w-4 h-4" />
                                                Participating Banks ({transaction.participating_banks.length})
                                            </h5>
                                            {transaction.participating_banks.map((bank, bankIndex) => (
                                                <div
                                                    key={bankIndex}
                                                    className="mb-2 p-3 border border-gray-300 rounded bg-gray-50"
                                                >
                                                    <div className="grid grid-cols-3 gap-3 text-sm">
                                                        <div>
                                                            <p className="text-xs text-gray-600">Bank Name</p>
                                                            <p className="font-semibold">{bank.participating_bank?.bank_name || bank.bank_name || "N/A"}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-600">Account Number</p>
                                                            <p>{bank.account_no || "N/A"}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-600">Amount</p>
                                                            <p className="font-semibold">{formatCurrency(bank.amount)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Footer */}
                <div className="mt-12 pt-6 border-t-2 border-gray-300 text-center text-sm text-gray-600">
                    <p>This is a computer-generated report from the AMLA Reporting System</p>
                    <p className="mt-1">Generated on {new Date().toLocaleString()}</p>
                </div>
            </div>

            <style>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                }
            `}</style>
        </div>
    );
}
