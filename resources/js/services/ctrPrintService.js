import { formatTransactionDate, formatBirthdate } from "@/utils/dateFormatters";
import { toUpperCase } from "@/utils/textFormatters";

/**
 * CTR Print Service
 * Handles print functionality for CTR reports in landscape table format
 */

/**
 * Transform report data for printing (same as Excel format)
 */
export const transformReportDataForPrint = (reports) => {
    return reports.map((report) => {
        const transaction = report.transactions?.[0];
        const party = transaction?.parties?.[0];
        const participatingBanks = transaction?.participating_banks || [];

        // Main transaction row - ONE ROW per transaction/person
        const row = {
            FIX: "D",
            "Date of Transaction": formatTransactionDate(transaction?.transaction_date),
            "Transaction Code": toUpperCase(transaction?.transaction_code?.ca_sa),
            "Transaction Ref": toUpperCase(transaction?.transaction_reference_no),
            MOT: toUpperCase(transaction?.mode_of_transaction?.mod_code || "N/A"),
            "Transaction Amount": transaction?.transaction_amount || "",
        };

        // Add ALL participating banks as additional columns in the SAME row
        participatingBanks.forEach((participatingBank, index) => {
            const suffix = participatingBanks.length > 1 ? ` ${index + 1}` : "";
            row[`OPB FLAG${suffix}`] = "OPB";
            row[`Other Participating Bank type${suffix}`] = toUpperCase(
                participatingBank?.participating_bank?.bank_code
            );
            row[`Name of other participating bank${suffix}`] = toUpperCase(
                participatingBank?.bank_name
            );
            row[`Check No.${suffix}`] = participatingBank?.account_no || "";
            row[`Amount${suffix}`] = participatingBank?.amount || "";
            row[`Currency Code${suffix}`] = "PHP";
        });

        // Add party information
        row["Party Flag"] = toUpperCase(party?.party_flag?.par_code || "N/A");
        row["Transaction Reference"] = toUpperCase(transaction?.transaction_reference_no);
        row["Name Flag"] = toUpperCase(party?.name_flag?.name_flag_code);
        row["Lastname"] = toUpperCase(party?.last_name);
        row["Firstname"] = toUpperCase(party?.first_name);
        row["Middlename"] = toUpperCase(party?.middle_name);
        row["Complete Address"] = toUpperCase(party?.address);
        row["Country Code"] = toUpperCase(party?.country_code?.value);
        row["City Code"] = toUpperCase(party?.city?.ccode);
        row["Account No."] = toUpperCase(party?.account_number);
        row["Birthday"] = formatBirthdate(party?.birthdate);
        row["Birthplace"] = toUpperCase(party?.birthplace);
        row["Nationality"] = toUpperCase(party?.nationality);
        row["ID type"] = toUpperCase(party?.id_type?.id_code);
        row["ID no"] = toUpperCase(party?.id_no);
        row["Source of Fund"] = toUpperCase(party?.source_of_fund?.sof_code);
        row["Contact no."] = toUpperCase(party?.contact_no);
        row["old account no."] = toUpperCase(party?.old_acct_no);

        return row;
    });
};

/**
 * Generate print window with landscape table
 */
export const printCTRReport = (reports, submissionType = "A") => {
    if (!reports || reports.length === 0) {
        throw new Error("No reports to print");
    }

    const formattedData = transformReportDataForPrint(reports);

    // Get all column headers from the first row
    const headers = formattedData.length > 0 ? Object.keys(formattedData[0]) : [];

    // Generate header row (H row)
    const headerRow = {
        type: "H",
        version: "1",
        institutionCode: "004004825000000000",
        reportType: "CTR",
        format: "X",
        submissionType: submissionType,
    };

    // Generate footer row (T row)
    const footerRow = {
        type: "T",
        recordCount: formattedData.length.toString(),
        filler: "",
    };

    // Create HTML for print
    const printHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>CTR Report - Print</title>
            <style>
                @page {
                    size: landscape;
                    margin: 0.5cm;
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: Arial, sans-serif;
                    font-size: 9px;
                    padding: 10px;
                }

                .print-header {
                    text-align: center;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #002868;
                }

                .print-header h1 {
                    color: #002868;
                    font-size: 18px;
                    margin-bottom: 5px;
                }

                .print-header p {
                    color: #666;
                    font-size: 11px;
                }

                .meta-info {
                    background-color: #f0f0f0;
                    padding: 8px;
                    margin-bottom: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-weight: bold;
                    font-size: 10px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 10px;
                }

                th, td {
                    border: 1px solid #333;
                    padding: 4px 6px;
                    text-align: left;
                    vertical-align: top;
                    word-wrap: break-word;
                }

                th {
                    background-color: #002868;
                    color: white;
                    font-weight: bold;
                    font-size: 8px;
                    text-transform: uppercase;
                    position: sticky;
                    top: 0;
                }

                td {
                    font-size: 8px;
                }

                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }

                .footer-info {
                    margin-top: 10px;
                    padding-top: 10px;
                    border-top: 2px solid #002868;
                    text-align: center;
                    font-size: 10px;
                    color: #666;
                }

                .footer-meta {
                    background-color: #f0f0f0;
                    padding: 8px;
                    margin-top: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-weight: bold;
                    font-size: 10px;
                }

                @media print {
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-header">
                <h1>RBT Bank Inc. - RBT Compliance Hub</h1>
                <p>Covered Transaction Report (CTR)</p>
                <p>Generated: ${new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })}</p>
            </div>

            <div class="meta-info">
                Header: ${headerRow.type} | : ${headerRow.version} | : ${headerRow.institutionCode} | Type: ${headerRow.reportType} | Format: ${headerRow.format} | Submission: ${headerRow.submissionType}
            </div>

            <table>
                <thead>
                    <tr>
                        ${headers.map((header) => `<th>${header}</th>`).join("")}
                    </tr>
                </thead>
                <tbody>
                    ${formattedData
            .map(
                (row) => `
                        <tr>
                            ${headers
                        .map((header) => `<td>${row[header] || ""}</td>`)
                        .join("")}
                        </tr>
                    `
            )
            .join("")}
                </tbody>
            </table>

            <div class="footer-meta">
                Trailer: ${footerRow.type} | Total Records: ${footerRow.recordCount}
            </div>

            <div class="footer-info">
                <p><strong>RBT Bank Inc.</strong> | MIS Department</p>
                <p>🔒 BSP Regulated Anti-Money Laundering Act Compliance Hub</p>
            </div>

            <script>
                window.onload = function() {
                    window.print();
                    window.onafterprint = function() {
                        window.close();
                    };
                };
            </script>
        </body>
        </html>
    `;

    // Open print window
    const printWindow = window.open("", "_blank");
    if (printWindow) {
        printWindow.document.write(printHTML);
        printWindow.document.close();
    } else {
        throw new Error("Unable to open print window. Please allow popups for this site.");
    }
};
