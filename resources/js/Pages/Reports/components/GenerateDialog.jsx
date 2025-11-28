import {
    Calendar,
    FileDown,
    Search,
    Download,
    Printer,
    FileSpreadsheet,
    FileType,
    FileText,
    X,
} from "lucide-react";
import { useState } from "react";

export default function GenerateReportDialog({
    show,
    onClose,
    useDateRange,
    setUseDateRange,
    generateDateFrom,
    setGenerateDateFrom,
    generateDateTo,
    setGenerateDateTo,
    searchQuery,
    handleSearchInDialog,
    handleExport,
}) {
    const [actionType, setActionType] = useState("add"); // new state for select field

    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col m-4 animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-[#002868] to-[#001a4d]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white/10">
                                <FileDown className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    Generate CTR Report
                                </h2>
                                <p className="text-sm text-white/80">
                                    Configure and export your report
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 transition-all rounded-lg text-white/80 hover:text-white hover:bg-white/10"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    {/* Action Select Field */}
                    <div className="p-6 border border-gray-200 bg-gradient-to-br from-gray-50 to-white rounded-xl">
                        <h3 className="text-lg font-semibold text-[#002868] mb-2 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Choose Action
                        </h3>
                        <select
                            value={actionType}
                            onChange={(e) => setActionType(e.target.value)}
                            className="w-full mt-2 p-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-[#002868] focus:border-[#002868] outline-none"
                        >
                            <option value="add">Add</option>
                            <option value="edit">Edit</option>
                            <option value="delete">Delete</option>
                            <option value="test">Test</option>
                        </select>
                    </div>

                    {/* Export Options */}
                    <div className="p-6 border border-gray-200 bg-gradient-to-br from-gray-50 to-white rounded-xl">
                        <h3 className="text-lg font-semibold text-[#002868] mb-2 flex items-center gap-2">
                            <Download className="w-5 h-5" />
                            Choose Export Format
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <ExportButton
                                onClick={() => handleExport("print")}
                                icon={<Printer className="w-5 h-5" />}
                                color="#002868"
                                title="Print / PDF"
                                subtitle="Printable view"
                            />
                            <ExportButton
                                onClick={() => handleExport("excel")}
                                icon={<FileSpreadsheet className="w-5 h-5" />}
                                color="green"
                                title="Excel"
                                subtitle=".xlsx file"
                            />
                            <ExportButton
                                onClick={() => handleExport("csv")}
                                icon={<FileType className="w-5 h-5" />}
                                color="blue"
                                title="CSV"
                                subtitle=".csv file"
                            />
                            <ExportButton
                                onClick={() => handleExport("word")}
                                icon={<FileText className="w-5 h-5" />}
                                color="blue"
                                title="Word"
                                subtitle=".docx file"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper component for export buttons
function ExportButton({ onClick, icon, color, title, subtitle }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:shadow-md transition-all group`}
            style={{ borderColor: color }}
        >
            <div
                className={`p-3 rounded-lg group-hover:scale-110 transition-all`}
                style={{
                    backgroundColor: `${color}20`,
                }}
            >
                {icon}
            </div>
            <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
        </button>
    );
}
