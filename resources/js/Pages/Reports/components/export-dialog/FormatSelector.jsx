import { FileSpreadsheet, File, Check } from "lucide-react";

const options = [
    {
        value: "excel",
        title: "Excel",
        description: "Microsoft Excel (.xlsx)",
        icon: FileSpreadsheet,
    },
    {
        value: "csv",
        title: "CSV",
        description: "Comma Separated (.csv)",
        icon: File,
    },
];

export default function FormatSelector({ value, onChange, step }) {
    return (
        <div className="p-5 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full font-bold">
                    {step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Select Export Format</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {options.map((option) => {
                    const Icon = option.icon;
                    const isActive = value === option.value;
                    return (
                        <button
                            key={option.value}
                            onClick={() => onChange(option.value)}
                            className={`p-5 border-2 rounded-lg transition-all ${
                                isActive
                                    ? "border-green-600 bg-green-50 shadow-lg ring-2 ring-green-600"
                                    : "border-gray-300 hover:border-green-400 bg-white"
                            }`}
                            type="button"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`flex items-center justify-center w-14 h-14 rounded-lg ${
                                        isActive ? "bg-green-100" : "bg-gray-100"
                                    }`}
                                >
                                    <Icon
                                        className={`w-8 h-8 ${
                                            isActive ? "text-green-600" : "text-gray-600"
                                        }`}
                                    />
                                </div>
                                <div className="text-left flex-1">
                                    <h4 className="font-bold text-lg text-gray-900">{option.title}</h4>
                                    <p className="text-sm text-gray-600">{option.description}</p>
                                </div>
                                {isActive && (
                                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
