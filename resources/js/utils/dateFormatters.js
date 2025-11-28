/**
 * Date formatting utilities for CTR reports
 */

/**
 * Format date to YYYYMMDDHHmmss (e.g., 20251003092242)
 * Used for transaction dates with time
 *
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted date string
 */
export const formatTransactionDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

/**
 * Format birthdate to YYYYMMDD (e.g., 19880321)
 * Date only, no time component
 *
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted date string
 */
export const formatBirthdate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
};

/**
 * Format date for display (e.g., "Jan 1, 2025")
 *
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};
