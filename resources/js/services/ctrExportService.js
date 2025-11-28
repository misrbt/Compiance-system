import XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import { formatTransactionDate, formatBirthdate } from "@/utils/dateFormatters";
import { toUpperCase } from "@/utils/textFormatters";

/**
 * CTR Export Service
 * Handles Excel export functionality for CTR reports
 */

/**
 * Transform report data for Excel export
 * Groups transactions by party group (same set of parties) - handles both:
 * 1. Multiple parties in one transaction (joint account) - adds party columns horizontally
 * 2. Multiple transactions for same party/parties - adds transaction columns horizontally
 *
 * @param {Array} reports - Array of report objects
 * @returns {Array} Formatted data ready for Excel
 */
export const transformReportDataForExcel = (reports) => {
    // Step 1: Group transactions by their unique party combination
    const partyGroupMap = new Map();

    reports.forEach((report) => {
        report.transactions?.forEach((transaction) => {
            const parties = transaction?.parties || [];

            if (parties.length === 0) {
                return;
            }

            // Create a unique key based on sorted party IDs to group same parties together
            const partyKey = parties
                .map(p => p.id)
                .sort((a, b) => a - b)
                .join('-');

            if (!partyGroupMap.has(partyKey)) {
                // Store unique party data (avoid duplicates from multiple transactions)
                const uniqueParties = parties.filter((party, index, self) =>
                    index === self.findIndex(p => p.id === party.id)
                );

                partyGroupMap.set(partyKey, {
                    parties: uniqueParties,
                    transactions: []
                });
            }

            partyGroupMap.get(partyKey).transactions.push(transaction);
        });
    });

    // Step 2: Transform each party group into a single row
    const rows = [];

    partyGroupMap.forEach((group) => {
        const { parties, transactions } = group;

        // Sort transactions by date
        transactions.sort((a, b) => {
            const dateA = new Date(a?.transaction_date || 0);
            const dateB = new Date(b?.transaction_date || 0);
            return dateA - dateB;
        });

        const row = {
            FIX: "D",
        };

        // Add transaction details for each transaction
        // If multiple transactions: add columns numbered (1, 2, 3...)
        const hasMultipleTransactions = transactions.length > 1;

        transactions.forEach((transaction, txIndex) => {
            const txSuffix = hasMultipleTransactions ? ` ${txIndex + 1}` : "";
            const participatingBanks = transaction?.participating_banks || [];

            row[`Date of Transaction${txSuffix}`] = formatTransactionDate(transaction?.transaction_date);
            row[`Transaction Code${txSuffix}`] = toUpperCase(transaction?.transaction_code?.ca_sa);
            row[`Transaction Reference${txSuffix}`] = toUpperCase(transaction?.transaction_reference_no);
            row[`MOT${txSuffix}`] = toUpperCase(transaction?.mode_of_transaction?.mod_code || "N/A");
            row[`Transaction Amount${txSuffix}`] = transaction?.transaction_amount || "";

            // Add participating banks for this transaction
            participatingBanks.forEach((participatingBank, bankIndex) => {
                const bankSuffix = participatingBanks.length > 1
                    ? `${txSuffix} Bank ${bankIndex + 1}`
                    : txSuffix;

                row[`OPB FLAG${bankSuffix}`] = "OPB";
                row[`Other Participating Bank type${bankSuffix}`] = toUpperCase(
                    participatingBank?.participating_bank?.bank_code
                );
                row[`Name of other participating bank${bankSuffix}`] = toUpperCase(
                    participatingBank?.bank_name
                );
                row[`Check No.${bankSuffix}`] = participatingBank?.account_no || "";
                row[`Amount${bankSuffix}`] = participatingBank?.amount || "";
                row[`Currency Code${bankSuffix}`] = "PHP";
            });
        });

        // Add party information for each party (after all transactions)
        // First party uses normal column names, additional parties get numbered suffixes
        parties.forEach((party, partyIndex) => {
            const partySuffix = partyIndex === 0 ? "" : ` ${partyIndex + 1}`;

            row[`Party Flag${partySuffix}`] = toUpperCase(party?.party_flag?.par_code || "N/A");
            row[`Name Flag${partySuffix}`] = toUpperCase(party?.name_flag?.name_flag_code);
            row[`Lastname${partySuffix}`] = toUpperCase(party?.last_name);
            row[`Firstname${partySuffix}`] = toUpperCase(party?.first_name);
            const middleName = (party?.middle_name || "").trim();
            row[`Middlename${partySuffix}`] = middleName ? toUpperCase(middleName) : "";
            row[`Complete Address${partySuffix}`] = toUpperCase(party?.address);
            row[`Country Code${partySuffix}`] = toUpperCase(party?.country_code?.value);
            row[`City Code${partySuffix}`] = toUpperCase(party?.city?.ccode);
            row[`Account No.${partySuffix}`] = toUpperCase(party?.account_number);
            row[`Birthday${partySuffix}`] = formatBirthdate(party?.birthdate);
            row[`Birthplace${partySuffix}`] = toUpperCase(party?.birthplace);
            row[`Nationality${partySuffix}`] = toUpperCase(party?.nationality);
            row[`ID type${partySuffix}`] = toUpperCase(party?.id_type?.id_code);
            row[`ID no${partySuffix}`] = toUpperCase(party?.id_no);
            row[`Source of Fund${partySuffix}`] = toUpperCase(party?.source_of_fund?.sof_code);
            row[`Contact no.${partySuffix}`] = toUpperCase(party?.contact_no);
            row[`old account no.${partySuffix}`] = toUpperCase(party?.old_acct_no);
        });

        rows.push(row);
    });

    return rows;
};

const formatCsvValue = (value) => {
    if (value === undefined || value === null) {
        return "";
    }

    if (typeof value === "number") {
        const numericString = value.toString();

        if (Number.isFinite(value) && Math.abs(value) >= 1e11) {
            return `="${numericString}"`;
        }

        return numericString;
    }

    if (typeof value === "string") {
        const trimmed = value.trim();

        if (/^\d{11,}$/.test(trimmed)) {
            return `="${trimmed}"`;
        }

        return value;
    }

    return value.toString();
};

/** Apply simple styling to all worksheet cells */
function applyWorksheetStyling(worksheet) {
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let R = 0; R <= range.e.r; ++R) {
        for (let C = 0; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            const cell = worksheet[cellAddress];
            if (cell) {
                cell.s = {
                    alignment: { horizontal: "center", vertical: "center" },
                };
            }
        }
    }
}

/** Auto column width */
export const setAutoColumnWidths = (worksheet, formattedData) => {
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    const colWidths = [];

    for (let C = 0; C <= range.e.c; C++) {
        let max = 0;
        for (let R = 0; R <= range.e.r; R++) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            const cell = worksheet[cellAddress];
            if (!cell || cell.v === undefined || cell.v === null) {
                continue;
            }

            const cellValue = cell.v.toString();
            max = Math.max(max, cellValue.length);
        }

        // Add small padding to the longest content in the column
        colWidths.push({ wch: Math.max(max + 2, 5) });
    }

    worksheet["!cols"] = colWidths;
};

/**
 * Export CTR reports to Excel file
 */
export const exportToExcel = (reports, filename, submissionType = "A") => {
    if (!reports || reports.length === 0) {
        throw new Error("No reports to export");
    }

    // Convert JSON data
    const formattedData = transformReportDataForExcel(reports);

    // Convert to array-of-arrays (AOA) for raw CTR-style output
    const ctrHeader = [["H", "1", "004004825000000000", "CTR", "X", submissionType]];
    const dataRows = formattedData.map((r) => Object.values(r));
    const trailer = [["T", formattedData.length.toString(), ""]];

    // Combine header + data + trailer
    const sheetData = [...ctrHeader, ...dataRows, ...trailer];

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // Apply column widths & styling
    setAutoColumnWidths(worksheet, formattedData);
    applyWorksheetStyling(worksheet);

    // CTR Header Style
    const headerStyle = {
        alignment: { horizontal: "center", vertical: "center" },
    };
    ["A1", "B1", "C1", "D1", "E1", "F1"].forEach((cell) => {
        if (worksheet[cell]) worksheet[cell].s = headerStyle;
    });

    // Footer Style
    const footerRowIndex = ctrHeader.length + formattedData.length;
    const footerCell = XLSX.utils.encode_cell({ r: footerRowIndex, c: 0 });
    if (worksheet[footerCell]) {
        worksheet[footerCell].s = {
            font: { italic: true, color: { rgb: "555555" } },
            alignment: { horizontal: "center" },
        };
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CTR Reports");

    // Export file
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const defaultFilename = `CTR_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
    saveAs(blob, filename || defaultFilename);
};

/**
 * Export CTR reports to CSV file
 */
export const exportToCSV = (reports, filename, submissionType = "A") => {
    if (!reports || reports.length === 0) {
        throw new Error("No reports to export");
    }

    const formattedData = transformReportDataForExcel(reports);
    const ctrHeader = [["H", "1", "004004825000000000", "CTR", "X", submissionType]];
    const dataRows = formattedData.map((row) => Object.values(row).map(formatCsvValue));
    const trailer = [["T", formattedData.length.toString(), ""]];
    const sheetData = [...ctrHeader, ...dataRows, ...trailer];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const defaultFilename = `CTR_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    saveAs(blob, filename || defaultFilename);
};
