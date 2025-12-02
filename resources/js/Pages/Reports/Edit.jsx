import { Head, Link, useForm } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import TransactionDetails from "./components/TransactionDetails";
import ParticipatingBanks from "./components/ParticipatingBanks";
import Parties from "./components/Parties";

export default function Edit({
    report,
    reportType,
    transactionType,
    referenceData,
}) {
    // Helper function to format date for input[type="date"]
    const formatDateForInput = (date) => {
        if (!date) return "";
        // If it's already in YYYY-MM-DD format, return as is
        if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return date;
        }
        // Otherwise, parse and format
        try {
            const d = new Date(date);
            return d.toISOString().split("T")[0];
        } catch {
            return "";
        }
    };

    // Debug: Log party data
    console.log("🔍 Edit - Full Report:", report);
    console.log(
        "🔍 Edit - First Party:",
        report.transactions?.[0]?.parties?.[0]
    );
    console.log(
        "🔍 Edit - Account Number:",
        report.transactions?.[0]?.parties?.[0]?.account_number
    );

    // Initialize form with existing report data
    const { data, setData, put, processing } = useForm({
        report_type: report.report_type,
        transaction_type: transactionType,
        submission_date: formatDateForInput(report.submission_date),
        transactions: report.transactions.map((transaction) => ({
            transaction_reference_no:
                transaction.transaction_reference_no ?? "",
            mode_of_transaction_id: transaction.mode_of_transaction_id
                ? String(transaction.mode_of_transaction_id)
                : "",
            transaction_amount: transaction.transaction_amount ?? "",
            transaction_code_id: transaction.transaction_code_id
                ? String(transaction.transaction_code_id)
                : "",
            transaction_date: formatDateForInput(transaction.transaction_date),
            account_number: transaction.account_number ?? "",
            parties: transaction.parties.map((party) => ({
                party_flag_id: party.party_flag_id
                    ? String(party.party_flag_id)
                    : "",
                name_flag_id: party.name_flag_id
                    ? String(party.name_flag_id)
                    : "",
                first_name: party.first_name ?? "",
                last_name: party.last_name ?? "",
                middle_name: party.middle_name ?? "",
                address: party.address ?? "",
                country_code_id: party.country_code_id
                    ? String(party.country_code_id)
                    : "",
                city_id: party.city_id ? String(party.city_id) : "",
                account_number: party.account_number ?? "",
                birthdate: formatDateForInput(party.birthdate),
                birthplace: party.birthplace ?? "",
                nationality: party.nationality ?? "",
                id_type_id: party.id_type_id ? String(party.id_type_id) : "",
                id_no: party.id_no ?? "",
                source_of_fund_id: party.source_of_fund_id
                    ? String(party.source_of_fund_id)
                    : "",
                contact_no: party.contact_no ?? "",
                transaction_amount: party.transaction_amount ?? "",
                customer_reference_no: party.customer_reference_no ?? "",
                old_acct_no: party.old_acct_no ?? "",
            })),
            participating_banks: transaction.participating_banks?.map(
                (bank) => ({
                    participating_bank_id: bank.participating_bank_id
                        ? String(bank.participating_bank_id)
                        : "",
                    bank_name: bank.bank_name ?? "",
                    account_no: bank.account_no ?? "",
                    amount: bank.amount ?? "",
                })
            ) || [{}],
        })),
    });

    const getTransactionTypeLabel = (code) => {
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
                newParty = { party_flag_id: String(defaultFlag.id) };
            }
        }

        setData("transactions", [
            {
                ...data.transactions[0],
                parties: [...currentParties, newParty],
            },
        ]);
    };

    const removeParty = (index) => {
        if (data.transactions[0].parties.length <= 1) {
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

        put(`/reports/${report.id}`, {
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Report updated successfully",
                    confirmButtonColor: "#002868",
                    timer: 2500,
                    timerProgressBar: true,
                });
            },
            onError: (errors) => {
                console.error("Update errors:", errors);
                Swal.fire({
                    icon: "error",
                    title: "Update Failed",
                    text: "Please check all required fields and try again",
                    confirmButtonColor: "#d33",
                });
            },
        });
    };

    const shouldShowParticipatingBanks = () => {
        const motId = data.transactions[0].mode_of_transaction_id;
        if (!motId) return false;

        const selectedMOT = referenceData.modeOfTransactions.find(
            (m) => String(m.id) === String(motId)
        );

        if (!selectedMOT) return false;

        if (transactionType === "CEDP") {
            return selectedMOT.mod_code === "2" || selectedMOT.mod_code === "3";
        }
        if (transactionType === "CDEPT") {
            return selectedMOT.mod_code === "2";
        }
        if (transactionType === "CENC" || transactionType === "CENCMS") {
            return selectedMOT.mod_code === "2";
        }
        if (transactionType === "CRETU") {
            return selectedMOT.mod_code === "4";
        }
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

    const shouldShowLastName = (nameFlagId) => {
        if (!nameFlagId) return false;
        const nameFlag = referenceData.nameFlags.find(
            (f) => f.id === parseInt(nameFlagId)
        );
        if (!nameFlag) return false;
        const codesRequiringLastName = ["J", "CP", "CO", "S", "O", "U"];
        return codesRequiringLastName.includes(nameFlag.name_flag_code);
    };

    const handleNameFlagChange = (partyIndex, value) => {
        const nameFlag = referenceData.nameFlags.find(
            (f) => f.id === parseInt(value)
        );

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
    };

    useEffect(() => {
        const motId = data.transactions[0].mode_of_transaction_id;
        if (motId === "2" || motId === 2) {
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

    return (
        <AppLayout>
            <Head title={`Edit ${reportType} Report`} />

            <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <Link
                    href="/reports/browse-ctr"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-[#002868] mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Reports
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
                        Edit {getTransactionTypeLabel(transactionType)}
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Update the transaction details below
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <TransactionDetails
                        data={data}
                        referenceData={referenceData}
                        updateTransaction={updateTransaction}
                        transactionType={transactionType}
                    />

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
                    />

                    <div className="flex justify-end space-x-4">
                        <Link
                            href="/reports/browse-ctr"
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
                            {processing ? "Updating..." : "Update Report"}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
