// src/utils/dateUtils.ts

import { Timestamp } from 'firebase/firestore';

export function date2string(date: Date | Timestamp | string | null | undefined): string {
    if (!date) return '';

    const jsDate =
        date instanceof Timestamp
            ? date.toDate()
            : typeof date === 'string'
                ? new Date(date)
                : date;

    return new Intl.DateTimeFormat('en-US', {
        month: 'short', // "Aug"
        day: 'numeric', // "19"
        year: 'numeric', // "2025"
        timeZone: 'UTC', // Ensure UTC to avoid local time shifts
    }).format(jsDate);
}
















/**
 * Format an ISO date string for display in US format, e.g., "May 2, 2025"
 */
export const formatDateForUI = (isoDate: string | null | undefined): string => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};



export const formatDate2Iso = (date: Date): string => {
    return date.toISOString()
};

/**
 * Add N days to an ISO date string and return a new ISO string.
 */
export const addIsoDays = (isoDate: string, days: number): string => {
    const date = new Date(isoDate);
    date.setDate(date.getDate() + days);
    return date.toISOString();
};

export const addDateDays = (date: Date, days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};



/**
 * Get today's date as an ISO string.
 */
export const getTodayISO = (): string => {
    return new Date().toISOString();
};

/**
 * Safely convert ISO or Date to Date object.
 * If invalid, return today's date.
 */
export const safeDate = (value: string | Date | undefined | null): Date => {
    if (!value) return new Date();
    const date = value instanceof Date ? value : new Date(value);
    return isNaN(date.getTime()) ? new Date() : date;
};


