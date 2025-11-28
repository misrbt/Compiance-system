import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { FileText, AlertTriangle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SelectType() {
    const reportTypes = [
        {
            type: 'CTR',
            title: 'Covered Transaction Report',
            description: 'Report for covered transactions as defined by AMLA regulations',
            icon: FileText,
            color: 'bg-[#002868]',
            hoverColor: 'hover:bg-[#001a4d]',
        },
        {
            type: 'STR',
            title: 'Suspicious Transaction Report',
            description: 'Report for suspicious transactions that may indicate money laundering',
            icon: AlertTriangle,
            color: 'bg-red-600',
            hoverColor: 'hover:bg-red-700',
        },
    ];

    return (
        <AppLayout>
            <Head title="Select Report Type" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    href="/reports"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-[#002868] mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Reports
                </Link>

                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-[#002868] mb-2">Submit a New Report</h1>
                    <p className="text-gray-600">Select the type of report you want to submit</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {reportTypes.map((reportType, index) => {
                        const Icon = reportType.icon;
                        return (
                            <motion.div
                                key={reportType.type}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    href="/reports/submit-options"
                                    className="block h-full"
                                >
                                    <div className="h-full bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-[#D4AF37] transition-all p-6 hover:shadow-md">
                                        <div className={`inline-flex p-3 rounded-lg ${reportType.color} text-white mb-4`}>
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {reportType.title}
                                        </h3>
                                        <p className="text-gray-600">
                                            {reportType.description}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
