import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Plus, Trash2, User } from "lucide-react";

export default function Parties({
    data,
    referenceData,
    shouldShowLastName,
    handleNameFlagChange,
    updateParty,
    addParty,
    removeParty,
    transactionType,
    accountType,
    updateTransaction,
}) {
    const formatContactForInput = (value) => {
        if (!value) {
            return "";
        }

        // Extract only digits
        let digits = value.replace(/[^0-9]/g, "");

        // Handle different formats:
        // - 09175844766 (stored format) -> 9175844766
        // - 639175844766 -> 9175844766
        // - +(63) 9175844766 -> 9175844766
        if (digits.startsWith("63")) {
            digits = digits.slice(2);
        }

        if (digits.startsWith("0")) {
            digits = digits.slice(1);
        }

        return digits;
    };

    const buildStoredContactValue = (digits) => {
        if (!digits) {
            return "";
        }

        // Store in format: 09175844766
        return `0${digits}`;
    };

    return (
        <div
            data-section="parties"
            className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#002868] flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Parties Information
                    {accountType === "Individual" || accountType === "Corporate" ? (
                        <span className="ml-3 text-xs font-normal text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            (1 party only)
                        </span>
                    ) : accountType === "Joint" ? (
                        <span className="ml-3 text-xs font-normal text-gray-600 bg-blue-100 px-2 py-1 rounded">
                            (Joint Account)
                        </span>
                    ) : null}
                </h2>
                {/* Only show Add Party button for Joint accounts */}
                {accountType === "Joint" && (
                    <button
                        type="button"
                        onClick={addParty}
                        className="inline-flex items-center px-3 py-1.5 bg-[#002868] hover:bg-[#001a4d] text-white text-sm rounded-md transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Party
                    </button>
                )}
            </div>

            {/* Account Type Selection */}
            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Account Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <select
                        value={accountType || ""}
                        onChange={(e) =>
                            updateTransaction("account_type", e.target.value)
                        }
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#002868]"
                        required
                    >
                        <option value="">Select account type</option>
                        <option value="Individual">Individual Account</option>
                        <option value="Corporate">Corporate Account</option>
                        <option value="Joint">Joint Account</option>
                    </select>
                    <ChevronDown className="absolute w-4 h-4 text-gray-500 pointer-events-none right-3 top-1/2 -translate-y-1/2" />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                    {!accountType && "Select an account type to configure parties"}
                    {accountType === "Individual" && "Individual accounts can only have 1 party"}
                    {accountType === "Corporate" && "Corporate accounts can only have 1 party"}
                    {accountType === "Joint" && "Joint accounts require at least 2 parties"}
                </p>
            </div>

            {/* Warning for Joint accounts with less than 2 parties */}
            {accountType === "Joint" && data.transactions[0].parties.length < 2 && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="text-sm font-semibold text-yellow-800">
                                Joint Account Requires 2 or More Parties
                            </p>
                            <p className="text-xs text-yellow-700 mt-1">
                                Please add at least one more party before submitting the report.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {data.transactions[0].parties.map((party, partyIndex) => (
                    <motion.div
                        key={partyIndex}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pb-6 mb-6 border-b border-gray-200 last:border-b-0"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Party {partyIndex + 1}
                            </h3>
                            {data.transactions[0].parties.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeParty(partyIndex)}
                                    className="text-sm text-red-600 hover:text-red-800"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Party Flag{" "}
                                    <span className="text-red-500">*</span>
                                    {(transactionType === "CENC" ||
                                        transactionType === "CENCMS") &&
                                        partyIndex >= 0 && (
                                            <span className="ml-2 text-xs text-gray-500">
                                                (A or B for {transactionType})
                                            </span>
                                        )}
                                    {transactionType === "CRETU" &&
                                        partyIndex >= 0 && (
                                            <span className="ml-2 text-xs text-gray-500">
                                                (A or B - drawer/payee)
                                            </span>
                                        )}
                                    {(transactionType === "CWDL" ||
                                        transactionType === "CWDLA" ||
                                        transactionType === "CWDLK" ||
                                        transactionType === "CWDLO" ||
                                        transactionType === "CWDOB") &&
                                        partyIndex === 0 && (
                                            <span className="ml-2 text-xs text-gray-500">
                                                (Default A - withdrawer)
                                            </span>
                                        )}
                                </label>
                                <select
                                    value={(() => {
                                        const val = party.party_flag_id
                                            ? String(party.party_flag_id)
                                            : "";
                                        if (partyIndex === 1) {
                                            console.log(
                                                "🎯 Party 2 Flag Value:",
                                                val,
                                                "Type:",
                                                typeof val
                                            );
                                        }
                                        return val;
                                    })()}
                                    onChange={(e) =>
                                        updateParty(
                                            partyIndex,
                                            "party_flag_id",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                    required
                                >
                                    <option value="">Select flag</option>
                                    {referenceData.partyFlags.map((flag) => (
                                        <option
                                            key={flag.id}
                                            value={String(flag.id)}
                                        >
                                            {flag.par_code} - {flag.details}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Name Flag{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={(() => {
                                        const val = party.name_flag_id
                                            ? String(party.name_flag_id)
                                            : "";
                                        return val;
                                    })()}
                                    onChange={(e) => {
                                        handleNameFlagChange(
                                            partyIndex,
                                            e.target.value
                                        );
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                    required
                                >
                                    <option value="">
                                        -- Choose party type --
                                    </option>
                                    {referenceData.nameFlags.map((flag) => (
                                        <option key={flag.id} value={flag.id}>
                                            {flag.name_flag_code} -{" "}
                                            {flag.description}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {shouldShowLastName(party.name_flag_id) && (
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Last Name{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={party.last_name || ""}
                                        onChange={(e) =>
                                            updateParty(
                                                partyIndex,
                                                "last_name",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                        required
                                        placeholder={(() => {
                                            const nameFlag =
                                                referenceData.nameFlags.find(
                                                    (f) =>
                                                        f.id ===
                                                        parseInt(
                                                            party.name_flag_id
                                                        )
                                                );
                                            return nameFlag?.name_flag_code ===
                                                "U"
                                                ? "UNKNOWN"
                                                : "Enter last name";
                                        })()}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    First Name{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={party.first_name || ""}
                                    onChange={(e) =>
                                        updateParty(
                                            partyIndex,
                                            "first_name",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Middle Name
                                </label>
                                <input
                                    type="text"
                                    value={party.middle_name || ""}
                                    onChange={(e) =>
                                        updateParty(
                                            partyIndex,
                                            "middle_name",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                />
                            </div>

                            <div className="md:col-span-3">
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Address
                                </label>
                                <textarea
                                    value={party.address || ""}
                                    onChange={(e) =>
                                        updateParty(
                                            partyIndex,
                                            "address",
                                            e.target.value
                                        )
                                    }
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Country
                                </label>
                                <select
                                    value={party.country_code_id || ""}
                                    onChange={(e) =>
                                        updateParty(
                                            partyIndex,
                                            "country_code_id",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                >
                                    <option value="">Select country</option>
                                    {referenceData.countryCodes.map(
                                        (country) => (
                                            <option
                                                key={country.id}
                                                value={country.id}
                                            >
                                                {country.country_name}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    City
                                </label>
                                <select
                                    value={party.city_id || ""}
                                    onChange={(e) =>
                                        updateParty(
                                            partyIndex,
                                            "city_id",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                >
                                    <option value="">Select city</option>
                                    {referenceData.cities.map((city) => (
                                        <option key={city.id} value={city.id}>
                                            {city.name_of_city}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Account Number
                                </label>
                                <input
                                    type="text"
                                    value={(() => {
                                        console.log(
                                            `🏦 Party ${partyIndex} account_number:`,
                                            party.account_number
                                        );
                                        return party.account_number || "";
                                    })()}
                                    onChange={(e) =>
                                        updateParty(
                                            partyIndex,
                                            "account_number",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Account number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Birthdate
                                </label>
                                <input
                                    type="date"
                                    value={party.birthdate || ""}
                                    onChange={(e) =>
                                        updateParty(
                                            partyIndex,
                                            "birthdate",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Birthplace
                                </label>
                                <select
                                    value={party.birthplace || ""}
                                    onChange={(e) =>
                                        updateParty(
                                            partyIndex,
                                            "birthplace",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                >
                                    <option value="">Select city</option>
                                    {referenceData.cities.map((city) => (
                                        <option
                                            key={city.id}
                                            value={city.name_of_city}
                                        >
                                            {city.name_of_city}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Nationality
                                </label>
                                <select
                                    value={party.nationality || ""}
                                    onChange={(e) =>
                                        updateParty(
                                            partyIndex,
                                            "nationality",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                >
                                    <option value="">Select nationality</option>
                                    {referenceData.countryCodes.map(
                                        (country) => (
                                            <option
                                                key={
                                                    country.id || country.value
                                                }
                                                value={country.country_name}
                                            >
                                                {country.value} -{" "}
                                                {country.country_name}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    ID Type
                                </label>
                                <select
                                    value={party.id_type_id || ""}
                                    onChange={(e) =>
                                        updateParty(
                                            partyIndex,
                                            "id_type_id",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                >
                                    <option value="">Select ID type</option>
                                    {referenceData.idTypes.map((idType) => (
                                        <option
                                            key={idType.id}
                                            value={idType.id}
                                        >
                                            {idType.id_code} - {idType.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    ID Number
                                </label>
                                <input
                                    type="text"
                                    value={party.id_no || ""}
                                    onChange={(e) =>
                                        updateParty(
                                            partyIndex,
                                            "id_no",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Source of Funds
                                </label>
                                <select
                                    value={party.source_of_fund_id || ""}
                                    onChange={(e) =>
                                        updateParty(
                                            partyIndex,
                                            "source_of_fund_id",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                >
                                    <option value="">Select source</option>
                                    {referenceData.sourceOfFunds.map((sof) => (
                                        <option key={sof.id} value={sof.id}>
                                            {sof.sof_code} - {sof.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Contact Number
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="e.g., 09123456789, +639123456789, or +(63) 9123456789"
                                    value={`+(63) ${formatContactForInput(
                                        party.contact_no
                                    )}`}
                                    onChange={(e) => {
                                        let digits = e.target.value
                                            .replace(/[^\d]/g, "")
                                            .replace(/^63/, "")
                                            .replace(/^0+/, "");

                                        if (digits && digits[0] !== "9") {
                                            const firstNineIndex =
                                                digits.indexOf("9");
                                            digits =
                                                firstNineIndex >= 0
                                                    ? digits.slice(
                                                          firstNineIndex
                                                      )
                                                    : "";
                                        }

                                        if (digits.length > 10) {
                                            digits = digits.slice(0, 10);
                                        }

                                        updateParty(
                                            partyIndex,
                                            "contact_no",
                                            buildStoredContactValue(digits)
                                        );
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Philippine mobile number (must start with 9 and have 10 digits).
                                </p>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Customer Reference No.
                                </label>
                                <input
                                    type="text"
                                    value={party.customer_reference_no || ""}
                                    onChange={(e) =>
                                        updateParty(
                                            partyIndex,
                                            "customer_reference_no",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Old Account No.
                                </label>
                                <input
                                    type="text"
                                    value={party.old_acct_no || ""}
                                    onChange={(e) =>
                                        updateParty(
                                            partyIndex,
                                            "old_acct_no",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
