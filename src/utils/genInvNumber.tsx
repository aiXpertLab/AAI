import { SQLiteDatabase } from 'expo-sqlite';

/**
 * Generates a sequential invoice number starting with INV-100001
 * @param db SQLite database instance
 * @returns Promise<string> - Generated invoice number (e.g., "INV-100001")
 */
export const genInvNumber = async (db: SQLiteDatabase): Promise<string> => {
    try {
        // Option 1: Count-based (always sequential even if invoices are deleted)
        const countResult = await db.getFirstAsync<{ count: number }>(
            "SELECT COUNT(*) as count FROM Invoices"
        );
        const nextNum = 100000 + (countResult?.count || 0) + 1;
        return `INV-${nextNum}`;

        /* 
        // Option 2: MAX-based (skips numbers if invoices are deleted)
        const maxResult = await db.getFirstAsync<{ max_num: number }>(
            "SELECT MAX(CAST(SUBSTR(inv_number, 5) AS INTEGER)) as max_num FROM Invoices"
        );
        const nextNum = (maxResult?.max_num || 100000) + 1;
        return `INV-${nextNum}`;
        */
    } catch (err) {
        console.error("Error generating invoice number:", err);
        // Fallback with timestamp-based number in the 100000+ range
        return `INV-${100000 + Math.floor(Date.now() % 10000)}`;
    }
};