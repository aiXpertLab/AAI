// src/utils/invoiceUtils.ts
import { useClientCrud } from "@/src/firestore/fs_crud_client";
import { InvDB } from "../types";

export type PaidStatus = 'Unpaid' | 'Partially Paid' | 'Paid' | 'Overdue';


export function calcOverdue(invoices: InvDB[]): InvDB[] {
    const today0 = new Date();  // Get today's date and time
    today0.setHours(0, 0, 0, 0);

    // Loop through invoices and check if they are overdue
    const updatedInvoices = invoices.map(inv => {
        const { inv_due_date, inv_total, inv_balance_due } = inv;

        if (inv_balance_due <= 0) {
            inv.inv_payment_status = "Paid";
        } else if (inv_due_date < today0) {
            inv.inv_payment_status = "Overdue";
        } else if (inv_balance_due === inv_total) {
            inv.inv_payment_status = "Unpaid";
        } else if (inv_balance_due < inv_total) {
            inv.inv_payment_status = "Partially Paid";
        }

        return inv;
    });

    return updatedInvoices; // Return the updated array of invoices
}




export async function checkOverdueInvoicesSQLite(db: any) {
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




// utils/invoiceUtils.ts
export async function attachClientNames(invoices: any[]) {
    const { fetch1Client } = useClientCrud();
    return Promise.all(
        invoices.map(async (inv) => {
            const client = await fetch1Client(inv.client_id);
            return {
                ...inv,
                client_company_name: client?.client_company_name ?? null,
                client_contact_name: client?.client_contact_name ?? null,
                client_email: client?.client_email ?? null,
                client_phone: client?.client_mainphone ?? null,
                client_address: client?.client_address ?? null,
            };
        })
    );
}
