import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function SelectTransactionType({
    reportType,
    transactionCodes,
}) {
    const [selectedType, setSelectedType] = useState(null);

    const types = transactionCodes.map((code) => ({
        code: code.ca_sa,
        label: code.transaction_title,
    }));

    const handleContinue = () => {
        if (selectedType) {
            router.get('/reports/create', {
                report_type: reportType,
                transaction_type: selectedType,
            });
        }
    };

    return (
        <AppLayout>
            <Head title={`Select Transaction Type - ${reportType}`} />

            <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
                {/* Sticky header bar - stays below navigation */}
                <div className="sticky top-[80px] z-30 bg-white py-4 mb-6">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/reports/select-type"
                            className="inline-flex items-center text-sm text-gray-600 hover:text-[#002868]"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Report Type Selection
                        </Link>

                        <button
                            onClick={handleContinue}
                            disabled={!selectedType}
                            className={`inline-flex items-center px-6 py-3 rounded-md transition-all ${
                                selectedType
                                    ? "bg-[#002868] hover:bg-[#001a4d] text-white"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            Continue
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                </div>

                {/* Title Section */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center px-3 py-1 mb-4 text-sm font-medium text-white rounded-full bg-[#002868]">
                        {reportType}
                    </div>
                    <h1 className="mb-2 text-3xl font-bold text-[#002868]">
                        Select Transaction Type
                    </h1>
                    <p className="text-gray-600">
                        Choose the type of transaction you want to report
                    </p>
                </div>

                {/* Grid of types */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {types.map((type, index) => (
                        <motion.div
                            key={type.code}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <button
                                onClick={() => setSelectedType(type.code)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all h-full ${
                                    selectedType === type.code
                                        ? "border-[#D4AF37] bg-[#002868] text-white"
                                        : "border-gray-200 bg-white hover:border-[#002868]"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="mb-1 font-mono text-sm opacity-75">
                                            {type.code}
                                        </div>
                                        <div className="text-sm font-medium break-words">
                                            {type.label}
                                        </div>
                                    </div>
                                    {selectedType === type.code && (
                                        <div className="flex items-center justify-center flex-shrink-0 w-5 h-5 rounded-full bg-[#D4AF37]">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                    )}
                                </div>
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
