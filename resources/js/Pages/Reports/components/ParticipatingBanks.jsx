import { AnimatePresence, motion } from "framer-motion";
import { Building2, Trash2 } from "lucide-react";

export default function ParticipatingBanks({ data, referenceData, updateParticipatingBank, addParticipatingBank, removeParticipatingBank, transactionType }) {
    const handleNoClick = () => {
        // Scroll to the Parties section
        const partiesSection = document.querySelector('[data-section="parties"]');
        if (partiesSection) {
            partiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-[#002868] flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Other Participating Banks (Check Details)
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    {transactionType === 'CENC' && 'Required for check encashment transactions'}
                    {transactionType === 'CENCMS' && 'Required for MC/CC/TC check encashment transactions. Select your own bank for same-bank checks, or the external bank for other-bank checks.'}
                    {transactionType === 'CEDP' && 'Required when Mode of Transaction is Check (2) or Multiple Checks (3)'}
                    {transactionType === 'CDEPT' && 'Required when Mode of Transaction is Check (2)'}
                    {transactionType === 'CRETU' && 'Required for returned check transactions. Enter details of the check that was returned or dishonored.'}
                    {(transactionType === 'CWDL' || transactionType === 'CWDLA' || transactionType === 'CWDLK' || transactionType === 'CWDLO' || transactionType === 'CWDOB') && 'Required only when Mode of Transaction is Check (2) for check-based withdrawals.'}
                </p>
            </div>

            <AnimatePresence>
                {data.transactions[0].participating_banks.map((bank, bankIndex) => (
                    <motion.div
                        key={bankIndex}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pb-4 mb-4 border-b border-gray-200 last:border-b-0"
                    >
                        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Other Participating Bank Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={bank.participating_bank_id || ""}
                                    onChange={(e) => updateParticipatingBank(bankIndex, "participating_bank_id", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                >
                                    <option value="">Select bank type</option>
                                    {referenceData.participatingBanks.map((pb) => (
                                        <option key={pb.id} value={pb.id}>
                                            {pb.bank_code} - {pb.bank}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Name of Other Participating Bank <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={bank.bank_name || ""}
                                    onChange={(e) => updateParticipatingBank(bankIndex, "bank_name", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Check Account No. <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={bank.account_no || ""}
                                    onChange={(e) => updateParticipatingBank(bankIndex, "account_no", e.target.value)}
                                    placeholder="Enter account number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Amount <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={bank.amount || ""}
                                    onChange={(e) => updateParticipatingBank(bankIndex, "amount", e.target.value)}
                                    placeholder="Enter amount"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002868]"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Currency</label>
                                <input
                                    type="text"
                                    value="PHP"
                                    disabled
                                    className="w-full px-3 py-2 text-gray-600 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {bankIndex === data.transactions[0].participating_banks.length - 1 && (
                            <div className="p-4 mt-4 rounded-md bg-gray-50">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Add Another Check?</label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={addParticipatingBank}
                                        className="px-4 py-2 text-sm font-medium text-white bg-[#002868] rounded-md hover:bg-[#001a4d] transition-colors"
                                    >
                                        Yes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNoClick}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        )}

                        {bankIndex !== data.transactions[0].participating_banks.length - 1 && (
                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={() => removeParticipatingBank(bankIndex)}
                                    className="inline-flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-800"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Remove This Check
                                </button>
                            </div>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}


