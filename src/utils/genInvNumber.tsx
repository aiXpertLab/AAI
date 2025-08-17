import { doc, runTransaction } from "firebase/firestore";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { useModalStore, useFirebaseUserStore, useTaxStore } from '@/src/stores/'
import { app } from "@/src/config/firebaseConfig";

export const getInvoiceNumber = async (): Promise<string> => {
    const db = getFirestore(app);
    const { FirebaseUser } = useFirebaseUserStore.getState();
    const uid = FirebaseUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    const docRef = doc(db, `aiai/be_${uid}`);

    const invoiceNumber = await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(docRef);
        const data = docSnap.data()!;

        const current = data.be_next_invoice_number;
        const prefix = data.be_invoice_prefix || "INV";

        transaction.update(docRef, {
            be_next_invoice_number: current + 1,
        });

        return `${prefix}-${current}`;
    });

    return invoiceNumber;
};


// import { SQLiteDatabase } from 'expo-sqlite';

// /**
//  * Generates a sequential invoice number starting with INV-100001
//  * @param db SQLite database instance
//  * @returns Promise<string> - Generated invoice number (e.g., "INV-100001")
//  */
// export const genInvNumber = async (db: SQLiteDatabase): Promise<string> => {
//     try {
//         // Option 1: Count-based (always sequential even if invoices are deleted)
//         const countResult = await db.getFirstAsync<{ count: number }>(
//             "SELECT COUNT(*) as count FROM Invoices"
//         );
//         const nextNum = 100000 + (countResult?.count || 0) + 1;
//         return `INV-${nextNum}`;

//         /*
//         // Option 2: MAX-based (skips numbers if invoices are deleted)
//         const maxResult = await db.getFirstAsync<{ max_num: number }>(
//             "SELECT MAX(CAST(SUBSTR(inv_number, 5) AS INTEGER)) as max_num FROM Invoices"
//         );
//         const nextNum = (maxResult?.max_num || 100000) + 1;
//         return `INV-${nextNum}`;
//         */
//     } catch (err) {
//         console.error("Error generating invoice number:", err);
//         // Fallback with timestamp-based number in the 100000+ range
//         return `INV-${100000 + Math.floor(Date.now() % 10000)}`;
//     }
// };