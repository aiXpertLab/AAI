// src/utils/invoiceUtils.ts
import { useClientCrud} from "@/src/firestore/fs_crud_client";

export type PaidStatus = 'Unpaid' | 'Partially Paid' | 'Paid' | 'Overdue';

export async function checkOverdueInvoices(db: any) {
    const today = new Date().toISOString().split('T')[0];

    try {
        await db.runAsync(
            `UPDATE invoices 
            SET inv_payment_status = 'Overdue',
                updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
            WHERE inv_payment_status IN ('Unpaid', 'Partially Paid')
                AND inv_due_date < ?
                AND inv_paid_total < inv_total`,
                [today]
        );
    } catch (error) {
        console.error("Failed to update overdue invoices:", error);
        throw error; // Re-throw if you want to catch it in the main init
    }
}


export async function updateInvoiceStatus(invoiceId:any) {
    const today = new Date().toISOString().split('T')[0];

}




// async function addPayment(invoiceId, amount) {
//     const db = await SQLite.openDatabase('invoices.db');
//     await db.runAsync(
//         'UPDATE invoices SET paid_total = paid_total + ? WHERE id = ?',
//         [amount, invoiceId]
//     );
//     await updateInvoiceStatus(invoiceId);
// }



// async function getInvoices() {
//     await checkAllOverdueInvoices(); // Quick check
//     return db.getAllAsync('SELECT * FROM invoices ORDER BY due_date');
// }


// utils/invoiceUtils.ts
export async function attachClientNames(invoices: any[]) {
    const { fetch1Client } = useClientCrud();
    return Promise.all(
        invoices.map(async (inv) => {
            const client = await fetch1Client(inv.client_id);
            return {
                ...inv,
                client_company_name: client?.client_company_name || "(Unknown)",
            };
        })
    );
}
