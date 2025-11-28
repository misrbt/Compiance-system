import { Head, Link, useForm } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { ArrowLeft, Save, Search, Building2, Trash2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import axios from "axios";

export default function DataEntry({ referenceData, preselectedParty }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedParty, setSelectedParty] = useState(preselectedParty || null);
    const [showTransactionForm, setShowTransactionForm] = useState(!!preselectedParty);

    const { data, setData, post, processing, errors, reset } = useForm({
        party_ids: preselectedParty?.party_ids || [preselectedParty?.id] || [],
        submission_date: "",
        transaction_reference_no: "",
        mode_of_transaction_id: "",
        transaction_amount: "",
        transaction_code_id: "",
        transaction_date: "",
        transaction_time: "",
        participating_banks: [],
    });



    // Search for parties (autocomplete)
    useEffect(() => {
        if (searchQuery.length >= 1) {
            setIsSearching(true);
            const delayDebounceFn = setTimeout(() => {
                axios
                    .get("/api/search-parties", {
                        params: { query: searchQuery },
                    })
                    .then((response) => {
                        setSearchResults(response.data);
                        setIsSearching(false);
                    })
                    .catch((error) => {
                        console.error("Search error:", error);
                        setIsSearching(false);
                    });
            }, 300);

            return () => clearTimeout(delayDebounceFn);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const handleSelectParty = (party) => {
        setSelectedParty(party);
        // Handle both joint accounts (with party_ids array) and single parties
        const partyIds = party.party_ids || [party.id];
        setData("party_ids", partyIds);
        setSearchQuery("");
        setSearchResults([]);
        setShowTransactionForm(true);
    };

    const handleClearSelection = () => {
        setSelectedParty(null);
        setShowTransactionForm(false);
        setData("party_ids", []);
        setSearchQuery("");
        reset();
    };

    const updateParticipatingBank = (bankIndex, field, value) => {
        const updatedBanks = [...data.participating_banks];
        updatedBanks[bankIndex] = {
            ...updatedBanks[bankIndex],
            [field]: value,
        };
        setData("participating_banks", updatedBanks);
    };

    const addParticipatingBank = () => {
        setData("participating_banks", [...data.participating_banks, {}]);
    };

    const removeParticipatingBank = (index) => {
        const updatedBanks = data.participating_banks.filter(
            (_, i) => i !== index
        );
        setData("participating_banks", updatedBanks);
    };



    // Simplified participating banks logic for Data Entry
    // Show when MOT is 2 (Check) or 3 (Multiple Checks)
    const shouldShowParticipatingBanks = useMemo(() => {
        const motId = data.mode_of_transaction_id;

        if (!motId) {
            return false;
        }

        // Find the selected MOT to check its code
        const selectedMOT = referenceData.modeOfTransactions.find(
            (m) => String(m.id) === String(motId)
        );

        if (!selectedMOT) {
            return false;
        }

        // Show participating banks for MOT 2 (Check) or 3 (Multiple Checks)
        return selectedMOT.mod_code === "2" || selectedMOT.mod_code === "3";
    }, [data.mode_of_transaction_id, referenceData.modeOfTransactions]);

    // Ensure participating bank rows only exist when required by MOT selection
    useEffect(() => {
        if (shouldShowParticipatingBanks && data.participating_banks.length === 0) {
            setData("participating_banks", [{}]);
            return;
        }

        if (!shouldShowParticipatingBanks && data.participating_banks.length > 0) {
            setData("participating_banks", []);
        }
    }, [shouldShowParticipatingBanks, data.participating_banks.length, setData]);

    const combineDateAndTime = () => {
        if (!data.transaction_date) {
            return "";
        }

        const time = data.transaction_time || "00:00:00";
        const [hh = "00", mm = "00", ss = "00"] = time.split(":");
        const safeTime = `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}:${ss.padStart(2, "0")}`;

        return `${data.transaction_date} ${safeTime}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const currentDate = new Date().toISOString().split("T")[0];

        // Prepare submission data
        const submissionData = {
            ...data,
            submission_date: currentDate,
            transaction_date: combineDateAndTime(),
        };

        console.log("  📤 Final submissionData:", submissionData);

        // Post the form directly with the data
        post("/reports/quick-transaction", {
            data: submissionData,
            onError: (errors) => {
                // Get first error message
                const firstError = Object.values(errors)[0];
                Swal.fire({
                    icon: "error",
                    title: "Validation Error",
                    html: `<p class="text-sm">${firstError || "Please fill in all required fields marked with *"}</p>`,
                });
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Data Entry - Quick Transaction" />

            <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <Link
                    href="/reports/browse-ctr"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-[#002868] mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to CTR Reports
                </Link>

                <div className="mb-6">
                    <div className="flex items-center mb-2 space-x-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#002868] text-white text-sm font-medium">
                            Data Entry
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-[#002868]">
                        Quick Transaction Entry
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Search for an existing client and record a new
                        transaction
                    </p>
                </div>

                {/* Party Search Section */}
                {!showTransactionForm && (
                    <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex items-center mb-4">
                            <Search className="w-6 h-6 text-[#002868] mr-2" />
                            <h2 className="text-xl font-semibold text-[#002868]">
                                Search for Client
                            </h2>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002868] focus:border-[#002868]"
                                autoFocus
                            />

                            {/* Search Results Dropdown - Facebook Style (Only Names) */}
                            {searchResults.length > 0 && (
                                <div className="absolute z-10 w-full mt-2 overflow-hidden overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg max-h-80">
                                    {searchResults.map((party) => (
                                        <button
                                            key={party.id}
                                            type="button"
                                            onClick={() =>
                                                handleSelectParty(party)
                                            }
                                            className="w-full px-4 py-2.5 text-left transition-colors border-b hover:bg-blue-50 last:border-b-0"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center justify-center text-sm font-semibold text-white rounded-full w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600">
                                                    {party.first_name
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                    {party.last_name
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {party.full_name}
                                                    </p>
                                                    {party.is_joint_account && (
                                                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full mt-1">
                                                            Joint Account
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {isSearching && (
                                <p className="mt-2 text-sm text-gray-500">
                                    Searching...
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Selected Party Info & Transaction Form */}
                {showTransactionForm && selectedParty && (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Compact Selected Client Info Card */}
                        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
                            {/* Client Header */}
                            <div className="px-4 py-3 bg-gradient-to-r from-[#002868] to-[#003d99] flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    {/* Avatar */}
                                    <div className="flex items-center justify-center w-10 h-10 text-sm font-bold text-white rounded-full bg-white/20 backdrop-blur-sm">
                                        {selectedParty.first_name
                                            ?.charAt(0)
                                            .toUpperCase()}
                                        {selectedParty.last_name
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </div>
                                    {/* Name */}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-base font-semibold text-white">
                                                {selectedParty.full_name}
                                            </h3>
                                            {selectedParty.is_joint_account && (
                                                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-blue-700 bg-white rounded-full">
                                                    Joint Account
                                                </span>
                                            )}
                                        </div>
                                        {/* Show account number only for single party, hide for joint accounts */}
                                        {!selectedParty.is_joint_account && selectedParty.account_number && (
                                            <p className="text-xs text-blue-100">
                                                Account: {selectedParty.account_number}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleClearSelection}
                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-white/10 border border-white/30 rounded-md hover:bg-white/20 transition-all duration-200"
                                >
                                    <svg
                                        className="w-3.5 h-3.5 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                    Change
                                </button>
                            </div>
                        </div>

                        {/* Transaction Details */}
                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold text-[#002868] mb-4 flex items-center">
                                Transaction Details
                            </h2>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Transaction Reference Number */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Transaction Reference No.{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.transaction_reference_no}
                                        onChange={(e) =>
                                            setData(
                                                "transaction_reference_no",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                        required
                                    />
                                    {errors.transaction_reference_no && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.transaction_reference_no}
                                        </p>
                                    )}
                                </div>

                                {/* Transaction Code */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Transaction Code{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.transaction_code_id}
                                        onChange={(e) =>
                                            setData(
                                                "transaction_code_id",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                        required
                                    >
                                        <option value="">
                                            Select transaction type...
                                        </option>
                                        {referenceData.transactionCodes.map(
                                            (code) => (
                                                <option
                                                    key={code.id}
                                                    value={code.id}
                                                >
                                                    {code.ca_sa} -{" "}
                                                    {code.transaction_title}
                                                </option>
                                            )
                                        )}
                                    </select>
                                    {errors.transaction_code_id && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.transaction_code_id}
                                        </p>
                                    )}
                                </div>

                                {/* Transaction Amount */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Transaction Amount{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.transaction_amount}
                                        onChange={(e) =>
                                            setData(
                                                "transaction_amount",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                        required
                                    />
                                    {errors.transaction_amount && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.transaction_amount}
                                        </p>
                                    )}
                                </div>

                                {/* Transaction Date */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Transaction Date{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.transaction_date}
                                        onChange={(e) =>
                                            setData(
                                                "transaction_date",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                        required
                                    />
                                    {errors.transaction_date && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.transaction_date}
                                        </p>
                                    )}
                                </div>

                                {/* Transaction Time */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Transaction Time{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        step="1"
                                        value={data.transaction_time}
                                        onChange={(e) =>
                                            setData(
                                                "transaction_time",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                        required
                                    />
                                    {errors.transaction_time && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.transaction_time}
                                        </p>
                                    )}
                                </div>

                                {/* Mode of Transaction */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Mode of Transaction (MOT){" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.mode_of_transaction_id}
                                        onChange={(e) =>
                                            setData(
                                                "mode_of_transaction_id",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                        required
                                    >
                                        <option value="">Select mode...</option>
                                        {referenceData.modeOfTransactions.map(
                                            (mode) => (
                                                <option
                                                    key={mode.id}
                                                    value={mode.id}
                                                >
                                                    {mode.mod_code} -{" "}
                                                    {mode.mode_of_transaction}
                                                </option>
                                            )
                                        )}
                                    </select>
                                    {errors.mode_of_transaction_id && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.mode_of_transaction_id}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Participating Banks Section */}
                        {shouldShowParticipatingBanks && (
                            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                                <div className="mb-4">
                                    <h2 className="text-xl font-semibold text-[#002868] flex items-center">
                                        <Building2 className="w-5 h-5 mr-2" />
                                        Other Participating Banks (Check
                                        Details)
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Enter check details when Mode of
                                        Transaction is Check (2) or Multiple
                                        Checks (3)
                                    </p>
                                </div>

                                {data.participating_banks.map(
                                    (bank, bankIndex) => (
                                        <div
                                            key={bankIndex}
                                            className="pb-4 mb-4 border-b border-gray-200 last:border-b-0"
                                        >
                                            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                                        Other Participating Bank
                                                        Type{" "}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </label>
                                                    <select
                                                        value={
                                                            bank.participating_bank_id ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            updateParticipatingBank(
                                                                bankIndex,
                                                                "participating_bank_id",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                                        required
                                                    >
                                                        <option value="">
                                                            Select bank type
                                                        </option>
                                                        {referenceData.participatingBanks.map(
                                                            (pb) => (
                                                                <option
                                                                    key={pb.id}
                                                                    value={
                                                                        pb.id
                                                                    }
                                                                >
                                                                    {
                                                                        pb.bank_code
                                                                    }{" "}
                                                                    - {pb.bank}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    {errors[`participating_banks.${bankIndex}.participating_bank_id`] && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {errors[`participating_banks.${bankIndex}.participating_bank_id`]}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                                        Name of Other
                                                        Participating Bank{" "}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            bank.bank_name || ""
                                                        }
                                                        onChange={(e) =>
                                                            updateParticipatingBank(
                                                                bankIndex,
                                                                "bank_name",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                                        required
                                                    />
                                                    {errors[`participating_banks.${bankIndex}.bank_name`] && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {errors[`participating_banks.${bankIndex}.bank_name`]}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                                        Check Account No.{" "}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            bank.account_no ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            updateParticipatingBank(
                                                                bankIndex,
                                                                "account_no",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Enter account number"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                                        required
                                                    />
                                                    {errors[`participating_banks.${bankIndex}.account_no`] && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {errors[`participating_banks.${bankIndex}.account_no`]}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                                        Amount{" "}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={
                                                            bank.amount || ""
                                                        }
                                                        onChange={(e) =>
                                                            updateParticipatingBank(
                                                                bankIndex,
                                                                "amount",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Enter amount"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                                        required
                                                    />
                                                    {errors[`participating_banks.${bankIndex}.amount`] && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {errors[`participating_banks.${bankIndex}.amount`]}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                                        Currency
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value="PHP"
                                                        disabled
                                                        className="w-full px-3 py-2 text-gray-600 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
                                                    />
                                                </div>
                                            </div>

                                            {bankIndex ===
                                                data.participating_banks
                                                    .length -
                                                    1 && (
                                                <div className="p-4 mt-4 rounded-md bg-gray-50">
                                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                                        Add Another Check?
                                                    </label>
                                                    <div className="flex gap-4">
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                addParticipatingBank
                                                            }
                                                            className="px-4 py-2 text-sm font-medium text-white bg-[#002868] rounded-md hover:bg-[#001a4d] transition-colors"
                                                        >
                                                            Yes
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                                        >
                                                            No
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {bankIndex !==
                                                data.participating_banks
                                                    .length -
                                                    1 && (
                                                <div className="mt-4">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeParticipatingBank(
                                                                bankIndex
                                                            )
                                                        }
                                                        className="inline-flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-800"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Remove This Check
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex items-center justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleClearSelection}
                                className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-6 py-3 bg-[#002868] hover:bg-[#001a4d] text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                <Save className="w-5 h-5 mr-2" />
                                {processing
                                    ? "Processing..."
                                    : "Record Transaction"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </AppLayout>
    );
}
