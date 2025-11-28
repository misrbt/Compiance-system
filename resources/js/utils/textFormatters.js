/**
 * Text formatting utilities for CTR reports
 */

/**
 * Convert value to uppercase string
 * Handles null/undefined values gracefully
 *
 * @param {any} value - The value to convert
 * @returns {string} Uppercase string or empty string
 */
export const toUpperCase = (value) => {
    if (value === null || value === undefined) return "";
    return String(value).toUpperCase();
};

/**
 * Safely get string value with fallback
 *
 * @param {any} value - The value to convert
 * @param {string} fallback - Fallback value (default: "")
 * @returns {string} String value or fallback
 */
export const toString = (value, fallback = "") => {
    if (value === null || value === undefined) return fallback;
    return String(value);
};
