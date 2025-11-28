import { Filter } from "lucide-react";

export default function RecordSummary({ recordCount, hidden }) {
    if (hidden) return null;

    return (
        <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Records Found:</span>
                </div>
                <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full font-bold text-lg">
                    {recordCount}
                </span>
            </div>
        </div>
    );
}
