import { Search as SearchIcon, X, User, Check } from "lucide-react";

const themeStyles = {
    blue: {
        accent: "blue",
        border: "border-blue-200",
        bg: "bg-blue-50",
        text: "text-blue-900",
        highlight: "text-blue-600",
        button: "text-blue-600 hover:text-blue-800",
    },
    purple: {
        accent: "purple",
        border: "border-purple-200",
        bg: "bg-purple-50",
        text: "text-purple-900",
        highlight: "text-purple-600",
        button: "text-purple-600 hover:text-purple-800",
    },
};

export default function CustomerPicker({
    label,
    placeholder,
    searchQuery,
    onSearchChange,
    selectedCustomer,
    onClear,
    filteredCustomers,
    showDropdown,
    dropdownRef,
    onSelectCustomer,
    helperText,
    extraContent,
    theme = "blue",
}) {
    const styles = themeStyles[theme] ?? themeStyles.blue;
    const containerBorder = theme === "purple" ? "border-purple-200" : "border-blue-200";
    const dropdownBorder = theme === "purple" ? "border-purple-300" : "border-blue-300";
    const dropdownHeader = theme === "purple" ? "bg-purple-50 border-purple-200" : "bg-blue-50 border-blue-200";
    const countText = theme === "purple" ? "text-purple-900" : "text-blue-900";

    return (
        <div className={`mt-4 p-4 bg-white rounded-lg border ${containerBorder}`}>
            <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
            <div className="relative" ref={dropdownRef}>
                <div className="relative">
                    <SearchIcon
                        className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2 z-10"
                        aria-hidden="true"
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={onSearchChange}
                        placeholder={placeholder}
                        className={`w-full py-2.5 pl-10 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            selectedCustomer ? "border-green-500 bg-green-50" : "border-gray-300"
                        } ${
                            styles.accent === "purple" ? "focus:ring-purple-500" : "focus:ring-blue-500"
                        }`}
                        autoComplete="off"
                    />
                    {selectedCustomer && (
                        <button
                            onClick={onClear}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors"
                            type="button"
                            aria-label="Clear selected customer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {selectedCustomer && (
                    <div className="mt-4 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="px-4 py-3 bg-gradient-to-r from-[#002868] to-[#003d99] flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-10 h-10 text-sm font-bold text-white rounded-full bg-white/20 backdrop-blur-sm">
                                    {selectedCustomer.firstName?.charAt(0).toUpperCase()}
                                    {selectedCustomer.lastName?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base font-semibold text-white">
                                            {selectedCustomer.fullName}
                                        </h3>
                                    </div>
                                    {selectedCustomer.accountNo && (
                                        <p className="text-xs text-blue-100">
                                            Account: {selectedCustomer.accountNo}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showDropdown && !selectedCustomer && filteredCustomers.length > 0 && (
                    <div
                        className={`absolute z-50 w-full mt-1 bg-white border-2 ${dropdownBorder} rounded-lg shadow-xl max-h-64 overflow-y-auto`}
                    >
                        <div className={`p-2 ${dropdownHeader} sticky top-0`}>
                            <p className={`text-xs font-semibold ${countText}`}>
                                Found {filteredCustomers.length}{" "}
                                {filteredCustomers.length === 1 ? "customer" : "customers"}
                            </p>
                        </div>
                        {filteredCustomers.map((customer, index) => (
                            <button
                                key={`${customer.fullName}-${customer.accountNo}-${index}`}
                                type="button"
                                onClick={() => onSelectCustomer(customer)}
                                className="w-full px-4 py-2.5 text-left transition-colors border-b hover:bg-blue-50 last:border-b-0"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center justify-center text-sm font-semibold text-white rounded-full w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0">
                                        {customer.firstName?.charAt(0).toUpperCase()}
                                        {customer.lastName?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">
                                            {customer.fullName}
                                        </p>
                                        {customer.accountNo && (
                                            <p className="text-xs text-gray-500 truncate">
                                                Account: {customer.accountNo}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {showDropdown && !selectedCustomer && searchQuery.trim().length > 0 && filteredCustomers.length === 0 && (
                    <div
                        className={`absolute z-50 w-full mt-1 bg-white border-2 ${dropdownBorder} rounded-lg shadow-xl p-4`}
                    >
                        <div className="text-center text-gray-500">
                            <SearchIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p className="font-medium">No customers found</p>
                            <p className="text-xs mt-1">Try a different search term</p>
                        </div>
                    </div>
                )}

                {!selectedCustomer && searchQuery.trim().length === 0 && helperText && (
                    <p className="mt-2 text-xs text-gray-600 flex items-center gap-1">
                        <SearchIcon className="w-3 h-3" />
                        {helperText}
                    </p>
                )}
            </div>

            {extraContent}
        </div>
    );
}
