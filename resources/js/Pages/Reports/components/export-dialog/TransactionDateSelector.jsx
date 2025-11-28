import { Calendar } from "lucide-react";
import { formatDisplayDate } from "./helpers";

const themeClasses = {
    blue: {
        border: "border-blue-200",
        bg: "bg-blue-50",
        text: "text-blue-700",
        button: "text-blue-600 hover:text-blue-800",
        checkbox: "text-blue-600",
    },
    purple: {
        border: "border-purple-200",
        bg: "bg-purple-50",
        text: "text-purple-700",
        button: "text-purple-600 hover:text-purple-800",
        checkbox: "text-purple-600",
    },
};

export default function TransactionDateSelector({
    dates,
    selectedDates,
    onToggleDate,
    onToggleAll,
    selectAll,
    heading = "Select Transaction Dates",
    theme = "blue",
}) {
    const classes = themeClasses[theme] ?? themeClasses.blue;

    if (!dates?.length) {
        return null;
    }

    return (
        <div className={`mt-4 p-4 ${classes.bg} border ${classes.border} rounded-lg`}>
            <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-900">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    {heading}
                </label>
                <button
                    type="button"
                    onClick={onToggleAll}
                    className={`text-xs font-medium underline ${classes.button}`}
                >
                    {selectAll ? "Deselect All" : "Select All"}
                </button>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-2">
                {dates.map((date) => (
                    <label
                        key={date}
                        className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            checked={selectedDates.includes(date)}
                            onChange={() => onToggleDate(date)}
                            className={`w-4 h-4 ${classes.checkbox} border-gray-300 rounded ${
                                theme === "purple" ? "focus:ring-purple-500" : "focus:ring-blue-500"
                            }`}
                        />
                        <span className="text-sm text-gray-900">{formatDisplayDate(date)}</span>
                    </label>
                ))}
            </div>
            <p className={`mt-2 text-xs ${classes.text}`}>
                {selectedDates.length} of {dates.length} dates selected
            </p>
        </div>
    );
}
