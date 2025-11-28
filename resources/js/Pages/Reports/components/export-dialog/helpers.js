export const normalizeFullName = (fullName = "") =>
    fullName.replace(/\s+/g, " ").trim().toLowerCase();

export const normalizeNameParts = (firstName = "", middleName = "", lastName = "") =>
    normalizeFullName(`${firstName} ${middleName} ${lastName}`);

export const normalizeDateValue = (dateInput = "") => {
    if (!dateInput) {
        return "";
    }

    if (dateInput instanceof Date) {
        return dateInput.toISOString().slice(0, 10);
    }

    const parts = dateInput.toString().split(/[T ]/);
    if (parts[0]?.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return parts[0];
    }

    const parsed = new Date(dateInput);
    return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
};

export const formatDisplayDate = (date) =>
    date
        ? new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "No date provided";

export const getTransactionKey = (transaction, reportId, index = 0) => {
    if (transaction?.id) {
        return transaction.id;
    }

    const reference = transaction?.transaction_reference_no || "ref";
    const date = transaction?.transaction_date || "date";

    return `${reportId || "report"}-${index}-${reference}-${date}`;
};

export const buildCustomerList = (reports = []) => {
    const customersMap = new Map();

    reports.forEach((report) => {
        report.transactions?.forEach((transaction) => {
            transaction.parties?.forEach((party) => {
                const firstName = party?.first_name || "";
                const lastName = party?.last_name || "";
                const middleName = party?.middle_name || "";

                if (!firstName && !lastName) {
                    return;
                }

                const fullName = `${firstName} ${middleName} ${lastName}`.replace(/\s+/g, " ").trim();
                const key = normalizeNameParts(firstName, middleName, lastName);

                if (!customersMap.has(key)) {
                    customersMap.set(key, {
                        fullName,
                        firstName,
                        lastName,
                        middleName,
                        accountNo: party?.account_number || "",
                    });
                }
            });
        });
    });

    return Array.from(customersMap.values()).sort((a, b) => a.fullName.localeCompare(b.fullName));
};

export const getCustomerTransactionDates = (reports = [], customerFullName) => {
    const normalizedTargetName = normalizeFullName(customerFullName);
    const dates = new Set();

    reports.forEach((report) => {
        report.transactions?.forEach((transaction) => {
            const matchesCustomer = transaction.parties?.some(
                (party) =>
                    normalizeNameParts(party?.first_name, party?.middle_name, party?.last_name) ===
                    normalizedTargetName
            );

            if (matchesCustomer && transaction.transaction_date) {
                dates.add(transaction.transaction_date);
            }
        });
    });

    return Array.from(dates).sort((a, b) => new Date(b) - new Date(a));
};

export const getCustomerTransactions = (reports = [], customerFullName) => {
    const normalizedTargetName = normalizeFullName(customerFullName);
    const transactions = [];

    reports.forEach((report) => {
        report.transactions?.forEach((transaction, index) => {
            const matchesCustomer = transaction.parties?.some(
                (party) =>
                    normalizeNameParts(party?.first_name, party?.middle_name, party?.last_name) ===
                    normalizedTargetName
            );

            if (matchesCustomer) {
                transactions.push({
                    id: getTransactionKey(transaction, report.id, index),
                    transactionDate: transaction.transaction_date,
                    amount: transaction.transaction_amount,
                    transactionCode: transaction.transaction_code?.ca_sa || "",
                    referenceNo: transaction.transaction_reference_no || "",
                    transaction,
                });
            }
        });
    });

    return transactions.sort(
        (a, b) => new Date(b.transactionDate || 0) - new Date(a.transactionDate || 0)
    );
};

export const getCustomerTransactionsByPartyIds = (reports = [], partyIds = []) => {
    const transactions = [];

    reports.forEach((report) => {
        report.transactions?.forEach((transaction, index) => {
            // Check if transaction has ALL the party IDs (for joint accounts)
            const transactionPartyIds = transaction.parties?.map(p => p.id) || [];
            const hasAllParties = partyIds.every(id => transactionPartyIds.includes(id));

            if (hasAllParties && transactionPartyIds.length === partyIds.length) {
                transactions.push({
                    id: getTransactionKey(transaction, report.id, index),
                    transactionDate: transaction.transaction_date,
                    amount: transaction.transaction_amount,
                    transactionCode: transaction.transaction_code?.ca_sa || "",
                    referenceNo: transaction.transaction_reference_no || "",
                    transaction,
                });
            }
        });
    });

    return transactions.sort(
        (a, b) => new Date(b.transactionDate || 0) - new Date(a.transactionDate || 0)
    );
};

export const filterReportsByCriteria = (reports = [], options) => {
    const {
        criteria,
        dateFrom,
        dateTo,
        singleDate,
        transactionCode,
        transactionDateMode,
        transactionDateFrom,
        transactionDateTo,
        singleTransactionDate,
        customerName,
        normalizedSelectedTransactionDates,
        selectedTransactionIds,
        customDateFrom,
        customDateTo,
        customTransactionCode,
        customCustomerName,
        normalizedCustomSelectedTransactionDates = [],
    } = options;

    let filtered = [...reports];

    if (criteria === "dateRange" && dateFrom && dateTo) {
        const from = normalizeDateValue(dateFrom);
        const to = normalizeDateValue(dateTo);

        filtered = filtered.filter((report) => {
            const reportDate = normalizeDateValue(report.submission_date);
            return reportDate >= from && reportDate <= to;
        });
    } else if (criteria === "singleDate" && singleDate) {
        const target = normalizeDateValue(singleDate);

        filtered = filtered.filter(
            (report) => normalizeDateValue(report.submission_date) === target
        );
    } else if (criteria === "transactionCode" && transactionCode) {
        const normalizedCode = transactionCode.toLowerCase();
        filtered = filtered.flatMap((report) => {
            const matchingTransactions =
                report.transactions?.filter((transaction) => {
                    const reportTransCode = transaction.transaction_code?.ca_sa || "";
                    return reportTransCode.toLowerCase().includes(normalizedCode);
                }) || [];

            if (matchingTransactions.length > 0) {
                return [{ ...report, transactions: matchingTransactions }];
            }

            return [];
        });
    } else if (criteria === "transactionDateRange") {
        if (transactionDateMode === "range" && transactionDateFrom && transactionDateTo) {
            const filterDateFromStr = normalizeDateValue(transactionDateFrom);
            const filterDateToStr = normalizeDateValue(transactionDateTo);

            filtered = filtered.flatMap((report) => {
                const matchingTransactions =
                    report.transactions?.filter((transaction) => {
                        const transDateStr = normalizeDateValue(transaction.transaction_date);
                        return transDateStr >= filterDateFromStr && transDateStr <= filterDateToStr;
                    }) || [];

                if (matchingTransactions.length > 0) {
                    return [{ ...report, transactions: matchingTransactions }];
                }

                return [];
            });
        } else if (transactionDateMode === "single" && singleTransactionDate) {
            const filterDateStr = normalizeDateValue(singleTransactionDate);

            filtered = filtered.flatMap((report) => {
                const matchingTransactions =
                    report.transactions?.filter((transaction) => {
                        const transDateStr = normalizeDateValue(transaction.transaction_date);
                        return transDateStr === filterDateStr;
                    }) || [];

                if (matchingTransactions.length > 0) {
                    return [{ ...report, transactions: matchingTransactions }];
                }

                return [];
            });
        }
    } else if (criteria === "customerName" && (customerName || selectedTransactionIds?.length > 0)) {
        // Filter by selected transaction IDs only (customer already matched via party_ids)
        filtered = filtered.flatMap((report) => {
            const matchingTransactions =
                report.transactions?.filter((transaction, index) => {
                    const transactionKey = getTransactionKey(transaction, report.id, index);
                    return selectedTransactionIds.includes(transactionKey);
                }) || [];

            if (matchingTransactions.length > 0) {
                return [{ ...report, transactions: matchingTransactions }];
            }

            return [];
        });
    } else if (criteria === "custom") {
        const hasCustomDateFrom = Boolean(customDateFrom);
        const hasCustomDateTo = Boolean(customDateTo);

        if (hasCustomDateFrom || hasCustomDateTo) {
            const filterDateFrom = normalizeDateValue(customDateFrom);
            const filterDateTo = normalizeDateValue(customDateTo);

            filtered = filtered.filter((report) => {
                const reportDate = normalizeDateValue(report.submission_date);

                if (filterDateFrom && reportDate < filterDateFrom) {
                    return false;
                }

                if (filterDateTo && reportDate > filterDateTo) {
                    return false;
                }

                return true;
            });
        }

        const normalizedCustomCode = customTransactionCode?.trim().toLowerCase();
        if (normalizedCustomCode) {

            filtered = filtered.flatMap((report) => {
                const matchingTransactions =
                    report.transactions?.filter((transaction) => {
                        const reportTransCode = transaction.transaction_code?.ca_sa || "";
                        return reportTransCode.toLowerCase().includes(normalizedCustomCode);
                    }) || [];

                if (matchingTransactions.length > 0) {
                    return [{ ...report, transactions: matchingTransactions }];
                }

                return [];
            });
        }

        const searchName = normalizeFullName(customCustomerName);

        if (searchName) {

            filtered = filtered.flatMap((report) => {
                const matchingTransactions =
                    report.transactions?.filter((transaction) => {
                        const matchesName = transaction.parties?.some((party) =>
                            normalizeNameParts(
                                party?.first_name,
                                party?.middle_name,
                                party?.last_name
                            ).includes(searchName)
                        );

                        if (!matchesName) {
                            return false;
                        }

                        if (normalizedCustomSelectedTransactionDates.length > 0) {
                            const transDateStr = normalizeDateValue(transaction.transaction_date);
                            return normalizedCustomSelectedTransactionDates.includes(transDateStr);
                        }

                        return true;
                    }) || [];

                if (matchingTransactions.length > 0) {
                    return [{ ...report, transactions: matchingTransactions }];
                }

                return [];
            });
        }
    }

    return filtered;
};

export const countTransactions = (filteredReports = []) =>
    filteredReports.reduce((total, report) => total + (report.transactions?.length || 0), 0);
