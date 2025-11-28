export default function SubmissionTypeSelector({ value, onChange, step, isSingleReport }) {
    return (
        <div className="p-5 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-600 text-white rounded-full font-bold">
                    {isSingleReport ? "1" : step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Submission Type</h3>
            </div>
            <select
                className="w-full px-4 py-2.5 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white font-medium"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="A">Add (A)</option>
                <option value="E">Edit (E)</option>
                <option value="D">Delete (D)</option>
                <option value="T">Test (T)</option>
            </select>
        </div>
    );
}
