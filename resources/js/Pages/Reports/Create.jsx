import { Head, Link, useForm } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { ArrowLeft, Save } from "lucide-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import TransactionDetails from "./components/TransactionDetails";
import ParticipatingBanks from "./components/ParticipatingBanks";
import Parties from "./components/Parties";

export default function Create({ reportType, transactionType, referenceData }) {
    const [parties, setParties] = useState([{}]); // Start with only 1 party
    const [participatingBanks, setParticipatingBanks] = useState([{}]);

    // Get default MOT for specific transaction types
    const getDefaultMOT = () => {
        if (referenceData.modeOfTransactions.length > 0) {
            // CENC and CENCMS default to MOT 2 (Check)
            if (transactionType === "CENC" || transactionType === "CENCMS") {
                const mot2 = referenceData.modeOfTransactions.find(
                    (m) => m.mod_code === "2"
                );
                return mot2 ? String(mot2.id) : "";
            }
            // CRETU defaults to MOT 4 (Returned Check)
            if (transactionType === "CRETU") {
                const mot4 = referenceData.modeOfTransactions.find(
                    (m) => m.mod_code === "4"
                );
                return mot4 ? String(mot4.id) : "";
            }
        }
        return "";
    };

    // Get default parties - start with 1 party with defaults
    const getDefaultParties = () => {
        const party1 = {};

        // Set default party flag for Party 1 based on transaction type
        if (transactionType === "CEDP") {
            const defaultFlag = referenceData.partyFlags?.find(
                (f) => f.par_code === "A"
            );
            if (defaultFlag) {
                party1.party_flag_id = String(defaultFlag.id);
            }
        } else if (transactionType === "CDEPT") {
            const defaultFlag = referenceData.partyFlags?.find(
                (f) => f.par_code === "T"
            );
            if (defaultFlag) {
                party1.party_flag_id = String(defaultFlag.id);
            }
        } else if (transactionType === "CENC" || transactionType === "CENCMS") {
            // For CENC and CENCMS, default to "A" (user can change to "B")
            const defaultFlag = referenceData.partyFlags?.find(
                (f) => f.par_code === "A"
            );
            if (defaultFlag) {
                party1.party_flag_id = String(defaultFlag.id);

            }
        } else if (transactionType === "CRETU") {
            // For CRETU (Returned Check), default to "A" (user can change to "B")
            const defaultFlag = referenceData.partyFlags?.find(
                (f) => f.par_code === "A"
            );
            if (defaultFlag) {
                party1.party_flag_id = String(defaultFlag.id);
                console.log(
                    `🎯 Setting Party 1 default flag to A for CRETU (can change to B)`
                );
            }
        } else if (
            transactionType === "CWDL" ||
            transactionType === "CWDLA" ||
            transactionType === "CWDLK" ||
            transactionType === "CWDLO" ||
            transactionType === "CWDOB"
        ) {
            // For CWDL (Withdrawals), default to "A"
            const defaultFlag = referenceData.partyFlags?.find(
                (f) => f.par_code === "A"
            );
            if (defaultFlag) {
                party1.party_flag_id = String(defaultFlag.id);
                console.log(
                    `🎯 Setting Party 1 default flag to A for ${transactionType} (withdrawer)`
                );
            }
        }

        return [party1];
    };

    // Get default transaction code ID for the selected transaction type
    const getDefaultTransactionCodeId = () => {
        const transactionCode = referenceData.transactionCodes?.find(
            (tc) => tc.ca_sa === transactionType
        );
        return transactionCode ? String(transactionCode.id) : "";
    };

    const { data, setData, post, processing, errors, transform } = useForm({
        report_type: reportType,
        transaction_type: transactionType,
        transactions: [
            {
                account_type: "",
                transaction_reference_no: "",
                mode_of_transaction_id: getDefaultMOT(),
                transaction_amount: "",
                transaction_code_id: getDefaultTransactionCodeId(),
                transaction_date: "",
                transaction_time: "",
                account_number: "",
                parties: getDefaultParties(),
                participating_banks: [{}],
            },
        ],
    });

    const getTransactionTypeLabel = (code) => {
        // Find the transaction code from referenceData
        const transactionCode = referenceData.transactionCodes?.find(
            (tc) => tc.ca_sa === code
        );
        return transactionCode ? transactionCode.transaction_title : code;
    };

    const updateTransaction = (field, value) => {
        setData("transactions", [
            {
                ...data.transactions[0],
                [field]: value,
            },
        ]);
    };

    const updateParty = (partyIndex, field, value) => {
        const updatedParties = [...data.transactions[0].parties];
        updatedParties[partyIndex] = {
            ...updatedParties[partyIndex],
            [field]: value,
        };
        setData("transactions", [
            {
                ...data.transactions[0],
                parties: updatedParties,
            },
        ]);
    };

    const updateParticipatingBank = (bankIndex, field, value) => {
        const updatedBanks = [...data.transactions[0].participating_banks];
        updatedBanks[bankIndex] = {
            ...updatedBanks[bankIndex],
            [field]: value,
        };
        setData("transactions", [
            {
                ...data.transactions[0],
                participating_banks: updatedBanks,
            },
        ]);
    };

    const addParty = () => {
        const currentParties = data.transactions[0].parties;
        const newPartyIndex = currentParties.length;

        // For CEDP/CDEPT, set default party flag when adding party 2
        let newParty = {};

        if (
            newPartyIndex === 1 &&
            (transactionType === "CEDP" || transactionType === "CDEPT")
        ) {
            const defaultCode = transactionType === "CEDP" ? "A" : "T";
            const defaultFlag = referenceData.partyFlags.find(
                (f) => f.par_code === defaultCode
            );

            if (defaultFlag) {
                console.log(
                    "➕ Setting default party flag for new party:",
                    defaultCode,
                    "ID:",
                    defaultFlag.id
                );
                newParty = { party_flag_id: String(defaultFlag.id) };
            }
        }

        setData("transactions", [
            {
                ...data.transactions[0],
                parties: [...currentParties, newParty],
            },
        ]);

        console.log("➕ Party added with data:", newParty);
    };

    const removeParty = (index) => {
        const accountType = data.transactions[0].account_type;
        const currentPartiesCount = data.transactions[0].parties.length;

        // For Individual/Corporate, cannot remove the only party
        if ((accountType === "Individual" || accountType === "Corporate") && currentPartiesCount <= 1) {
            Swal.fire({
                icon: "error",
                title: "Cannot Remove",
                text: "At least one party is required for Individual/Corporate accounts",
            });
            return;
        }

        // For Joint accounts, must have at least 2 parties
        if (accountType === "Joint" && currentPartiesCount <= 2) {
            Swal.fire({
                icon: "error",
                title: "Cannot Remove",
                text: "Joint accounts must have at least 2 parties",
            });
            return;
        }

        // General fallback - at least 1 party required
        if (currentPartiesCount <= 1) {
            Swal.fire({
                icon: "error",
                title: "Cannot Remove",
                text: "At least one party is required",
            });
            return;
        }

        const updatedParties = data.transactions[0].parties.filter(
            (_, i) => i !== index
        );
        setData("transactions", [
            {
                ...data.transactions[0],
                parties: updatedParties,
            },
        ]);
    };

    const addParticipatingBank = () => {
        setData("transactions", [
            {
                ...data.transactions[0],
                participating_banks: [
                    ...data.transactions[0].participating_banks,
                    {},
                ],
            },
        ]);
    };

    const removeParticipatingBank = (index) => {
        const updatedBanks = data.transactions[0].participating_banks.filter(
            (_, i) => i !== index
        );
        setData("transactions", [
            {
                ...data.transactions[0],
                participating_banks: updatedBanks,
            },
        ]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate Joint account has at least 2 parties
        const accountType = data.transactions[0].account_type;
        const partiesCount = data.transactions[0].parties.length;

        if (accountType === "Joint" && partiesCount < 2) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Joint accounts must have at least 2 parties. Please add another party before submitting.",
                confirmButtonColor: "#d33",
            });
            return;
        }

        // Validate Individual/Corporate account has exactly 1 party
        if ((accountType === "Individual" || accountType === "Corporate") && partiesCount !== 1) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: `${accountType} accounts must have exactly 1 party.`,
                confirmButtonColor: "#d33",
            });
            return;
        }

        const submissionDate = new Date().toISOString().split("T")[0];

        const updatedTransactions = data.transactions.map((transaction) => ({
            ...transaction,
            parties: transaction.parties.map((party) => ({
                ...party,
                account_type: transaction.account_type,
            })),
        }));

        const submitData = {
            ...data,
            submission_date: submissionDate,
            transactions: updatedTransactions,
        };

        // Use transform so the form submits the updated payload (including account_type)
        // Transform the payload for this submit so account_type and submission_date are sent
        transform(() => submitData);

        post("/reports", {
            onSuccess: () => {
                // Flash message handled by BrowseCTR page after redirect
            },
            onError: (errors) => {
                const firstError =
                    errors?.duplicate_party ||
                    Object.values(errors)[0] ||
                    "Please check all required fields and try again";

                Swal.fire({
                    icon: "error",
                    title:
                        errors?.duplicate_party === undefined
                            ? "Validation Failed"
                            : "Duplicate Party Detected",
                    text: firstError,
                    confirmButtonColor: "#d33",
                });
            },
        });
    };

    // Check if participating banks section should be shown based on transaction type and MOT
    const shouldShowParticipatingBanks = () => {
        const motId = data.transactions[0].mode_of_transaction_id;
        if (!motId) return false;

        // Find the selected MOT to check its code
        const selectedMOT = referenceData.modeOfTransactions.find(
            (m) => String(m.id) === String(motId)
        );

        if (!selectedMOT) return false;

        // For CEDP, show when MOT code is 2 (Check) or 3 (Multiple Checks)
        if (transactionType === "CEDP") {
            return selectedMOT.mod_code === "2" || selectedMOT.mod_code === "3";
        }
        // For CDEPT, show only when MOT code is 2 (Check)
        if (transactionType === "CDEPT") {
            return selectedMOT.mod_code === "2";
        }
        // For CENC and CENCMS, show only when MOT code is 2 (Check)
        if (transactionType === "CENC" || transactionType === "CENCMS") {
            return selectedMOT.mod_code === "2";
        }
        // For CRETU (Returned Check), always show (MOT is fixed to 4)
        if (transactionType === "CRETU") {
            return selectedMOT.mod_code === "4";
        }
        // For CWDL (Withdrawals), show only when MOT code is 2 (Check withdrawal)
        if (
            transactionType === "CWDL" ||
            transactionType === "CWDLA" ||
            transactionType === "CWDLK" ||
            transactionType === "CWDLO" ||
            transactionType === "CWDOB"
        ) {
            return selectedMOT.mod_code === "2";
        }
        return false;
    };

    // Check if last name field should be shown based on Name Flag
    // According to AMLA: Use LAST NAME field only if NAME FLAG value is J, CP, CO, S, O and U
    const shouldShowLastName = (nameFlagId) => {
        if (!nameFlagId) return false; // Hide by default if no flag selected
        const nameFlag = referenceData.nameFlags.find(
            (f) => f.id === parseInt(nameFlagId)
        );
        if (!nameFlag) return false;
        // Show last name ONLY for these specific name flag codes as per AMLA requirements
        const codesRequiringLastName = ["J", "CP", "CO", "S", "O", "U", "N"];
        return codesRequiringLastName.includes(nameFlag.name_flag_code);
    };

    // Auto-fill last name with "UNKNOWN" if name flag is U, or clear it if changing to another flag
    const handleNameFlagChange = (partyIndex, value) => {
        console.log("🟢 handleNameFlagChange called:", {
            partyIndex,
            value,
            valueType: typeof value,
        });
        console.log(
            "🟢 Current party data before update:",
            data.transactions[0].parties[partyIndex]
        );

        const nameFlag = referenceData.nameFlags.find(
            (f) => f.id === parseInt(value)
        );

        console.log("🟢 Found nameFlag:", nameFlag);

        // Update both name_flag_id and last_name in a single update to prevent render issues
        const updatedParties = [...data.transactions[0].parties];
        updatedParties[partyIndex] = {
            ...updatedParties[partyIndex],
            name_flag_id: value,
            last_name:
                nameFlag && nameFlag.name_flag_code === "U" ? "UNKNOWN" : "",
        };

        setData("transactions", [
            {
                ...data.transactions[0],
                parties: updatedParties,
            },
        ]);

        console.log("🟢 Updated party data:", updatedParties[partyIndex]);
    };

    // Auto-adjust number of participating banks based on MOT selection
    useEffect(() => {
        const motId = data.transactions[0].mode_of_transaction_id;
        if (motId === "2" || motId === 2) {
            // MOT 2 (Check 1) - Show 1 check
            if (data.transactions[0].participating_banks.length === 0) {
                setData("transactions", [
                    {
                        ...data.transactions[0],
                        participating_banks: [{}],
                    },
                ]);
            }
        }
    }, [data.transactions[0].mode_of_transaction_id]);

    useEffect(() => {
        // Default nationality to Philippines (ISO numeric 608 -> PH) if available
        const defaultCountry =
            referenceData.countryCodes.find((c) => c.value === "PH") ||
            referenceData.countryCodes.find(
                (c) => c.country_name === "Philippines"
            );

        const parties = data.transactions[0].parties;
        if (defaultCountry) {
            parties.forEach((p, idx) => {
                if (!p.nationality) {
                    updateParty(
                        idx,
                        "nationality",
                        defaultCountry.country_name
                    );
                }
            });
        }
    }, [
        transactionType,
        referenceData.countryCodes,
        referenceData.modeOfTransactions,
    ]);

    // Set default party flag when a second party is added
    useEffect(() => {
        const parties = data.transactions[0].parties;

        // When second party is added for CEDP or CDEPT, set default party flag
        if (parties.length >= 2 && referenceData.partyFlags.length > 0) {
            const secondParty = parties[1];

            // Only set if party flag is not already set
            if (!secondParty?.party_flag_id) {
                let defaultCode = null;

                if (transactionType === "CEDP") {
                    defaultCode = "A";
                } else if (transactionType === "CDEPT") {
                    defaultCode = "T";
                }
                // For CENC, CENCMS, CRETU, and CWDL, we don't set a default since it can be A or B (or user-specified)
                if (defaultCode) {
                    const defaultFlag = referenceData.partyFlags.find(
                        (f) => f.par_code === defaultCode
                    );

                    if (defaultFlag) {
                        // Update Party 2 directly with setData
                        const updatedParties = [...parties];
                        updatedParties[1] = {
                            ...updatedParties[1],
                            party_flag_id: String(defaultFlag.id),
                        };

                        setData("transactions", [
                            {
                                ...data.transactions[0],
                                parties: updatedParties,
                            },
                        ]);
                    }
                }
            } else {
                console.log("⏭️ Party flag already set, skipping");
            }
        }
    }, [data.transactions[0].parties]); // Trigger when parties array changes

    // Handle account type changes - adjust number of parties
    useEffect(() => {
        const accountType = data.transactions[0].account_type;
        const currentParties = data.transactions[0].parties;

        if (accountType === "Individual" || accountType === "Corporate") {
            // Limit to 1 party only
            if (currentParties.length > 1) {
                setData("transactions", [
                    {
                        ...data.transactions[0],
                        parties: [currentParties[0]],
                    },
                ]);
            }
        } else if (accountType === "Joint") {
            // Default to 2 parties for Joint Account
            if (currentParties.length < 2) {
                const newParties = [...currentParties];
                // Add parties until we have 2
                while (newParties.length < 2) {
                    newParties.push({});
                }
                setData("transactions", [
                    {
                        ...data.transactions[0],
                        parties: newParties,
                    },
                ]);
            }
        }
    }, [data.transactions[0].account_type]); // Trigger when account type changes

    return (
        <AppLayout>
            <Head title={`Create ${reportType} Report`} />

            <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <Link
                    href="/reports/select-transaction-type"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-[#002868] mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                </Link>

                <div className="mb-6">
                    <div className="flex items-center mb-2 space-x-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#002868] text-white text-sm font-medium">
                            {reportType}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-800 bg-gray-100 rounded-full">
                            {transactionType}
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-[#002868]">
                        {getTransactionTypeLabel(transactionType)}
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Fill in the transaction details below
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <TransactionDetails
                        data={data}
                        referenceData={referenceData}
                        updateTransaction={updateTransaction}
                        transactionType={transactionType}
                    />

                    {/* Participating Banks Section - Always show for CENC, or when MOT is 2/3 for others */}
                    {shouldShowParticipatingBanks() && (
                        <ParticipatingBanks
                            data={data}
                            referenceData={referenceData}
                            updateParticipatingBank={updateParticipatingBank}
                            addParticipatingBank={addParticipatingBank}
                            removeParticipatingBank={removeParticipatingBank}
                            transactionType={transactionType}
                        />
                    )}

                    <Parties
                        data={data}
                        referenceData={referenceData}
                        shouldShowLastName={shouldShowLastName}
                        handleNameFlagChange={handleNameFlagChange}
                        updateParty={updateParty}
                        addParty={addParty}
                        removeParty={removeParty}
                        transactionType={transactionType}
                        accountType={data.transactions[0].account_type}
                        updateTransaction={updateTransaction}
                    />

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Link
                            href="/reports"
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center px-6 py-2.5 bg-[#002868] hover:bg-[#001a4d] text-white rounded-md transition-colors disabled:opacity-50"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            {processing ? "Saving..." : "Save Report"}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
