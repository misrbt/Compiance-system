import { Download } from "lucide-react";

export default function DialogFooter({ onCancel, onDownload, selectedFormat }) {
    return (
        <div className="sticky bottom-0 z-10 flex items-center justify-between gap-3 px-6 py-4 bg-gray-50 border-t-2 border-gray-200">
            <button
                onClick={onCancel}
                className="px-6 py-2.5 text-gray-700 font-medium transition-all border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400"
                type="button"
            >
                Cancel
            </button>
            <button
                onClick={onDownload}
                disabled={!selectedFormat}
                className={`inline-flex items-center gap-2 px-8 py-2.5 font-bold text-white rounded-lg transition-all shadow-md ${
                    selectedFormat
                        ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-lg"
                        : "bg-gray-400 cursor-not-allowed"
                }`}
                type="button"
            >
                <Download className="w-5 h-5" />
                Download {selectedFormat ? selectedFormat.toUpperCase() : "File"}
            </button>
        </div>
    );
}
