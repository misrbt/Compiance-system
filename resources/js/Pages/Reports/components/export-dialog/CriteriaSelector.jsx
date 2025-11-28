import { Calendar, Filter, FileText, Search as SearchIcon, Check, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

const criteriaConfig = [
    {
        key: "all",
        label: "All Records",
        description: "Export everything",
        color: "green",
        icon: Filter,
    },
    {
        key: "dateRange",
        label: "Date Range",
        description: "From and To dates",
        color: "blue",
        icon: Calendar,
    },
    {
        key: "singleDate",
        label: "Single Date",
        description: "Specific date only",
        color: "blue",
        icon: Calendar,
    },
    {
        key: "transactionCode",
        label: "Transaction Code",
        description: "Filter by code",
        color: "blue",
        icon: FileText,
    },
    {
        key: "customerName",
        label: "Customer Name",
        description: "Search by name",
        color: "blue",
        icon: SearchIcon,
    },
    {
        key: "transactionDateRange",
        label: "Transaction Date",
        description: "By transaction date",
        color: "green",
        icon: Calendar,
    },
    {
        key: "custom",
        label: "Custom",
        description: "Combine filters",
        color: "purple",
        icon: Filter,
    },
];

const colorClasses = {
    green: {
        active: "border-green-600 bg-green-50 shadow-md",
        idle: "border-gray-300 hover:border-green-400 bg-white",
        icon: "text-green-600",
    },
    blue: {
        active: "border-blue-600 bg-blue-50 shadow-md",
        idle: "border-gray-300 hover:border-blue-400 bg-white",
        icon: "text-blue-600",
    },
    purple: {
        active: "border-purple-600 bg-purple-50 shadow-md",
        idle: "border-gray-300 hover:border-purple-400 bg-white",
        icon: "text-purple-600",
    },
};

export default function CriteriaSelector({ value, onChange, allowedKeys }) {
    const availableCriteria = useMemo(() => {
        if (!allowedKeys || allowedKeys.length === 0) {
            return criteriaConfig;
        }

        return criteriaConfig.filter((item) => allowedKeys.includes(item.key));
    }, [allowedKeys]);

    const [isOpen, setIsOpen] = useState(!value);

    const handleSelect = (key) => {
        onChange(key);
        setIsOpen(false);
    };

    const selectedItem = availableCriteria.find((item) => item.key === value);

    if (!isOpen && selectedItem) {
        const classes = colorClasses[selectedItem.color];
        const Icon = selectedItem.icon;

        return (
            <button
                onClick={() => setIsOpen(true)}
                className={`w-full p-4 border-2 rounded-lg transition-all text-left flex items-center justify-between ${classes.active} hover:opacity-90`}
                type="button"
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full bg-white/50`}>
                        <Icon className={`w-5 h-5 ${classes.icon}`} />
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900">{selectedItem.label}</div>
                        <div className="text-xs text-gray-600">{selectedItem.description}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/50 px-3 py-1.5 rounded-full">
                    <span>Change Criteria</span>
                    <ChevronDown className="w-4 h-4" />
                </div>
            </button>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableCriteria.map((item) => {
                const isActive = value === item.key;
                const classes = colorClasses[item.color];
                const Icon = item.icon;

                return (
                    <button
                        key={item.key}
                        onClick={() => handleSelect(item.key)}
                        className={`relative p-4 border-2 rounded-lg transition-all text-left ${
                            isActive ? classes.active : classes.idle
                        }`}
                        type="button"
                    >
                        {isActive && (
                            <div className="absolute top-3 right-3">
                                <Check className={`w-5 h-5 ${classes.icon}`} />
                            </div>
                        )}
                        <Icon className={`w-5 h-5 mb-2 ${isActive ? classes.icon : "text-gray-600"}`} />
                        <div className="font-semibold text-gray-900">{item.label}</div>
                        <div className="text-xs text-gray-600 mt-1">{item.description}</div>
                    </button>
                );
            })}
        </div>
    );
}
