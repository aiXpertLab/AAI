// src/utils/invoiceUtils.ts
import { useClientCrud } from "@/src/firestore/fs_crud_client";
import { InvDB } from "../types";

export type PaidStatus = 'Unpaid' | 'Partially Paid' | 'Paid' | 'Overdue';


export function calcOverdue(invoices: InvDB[]): InvDB[] {
    const today = new Date();  // Get today's date and time


    // Loop through invoices and check if they are overdue
    const updatedInvoices = invoices.map(inv => {
        if (inv.inv_payment_status !== 'Paid') {
            inv.inv_due_date.setDate(inv.inv_due_date.getDate() - 1);

            if (inv.inv_due_date < today) {
                inv.inv_payment_status = 'Overdue';  // Mark as overdue if due date is before tomorrow
            }else{
                if (inv.inv_balance_due < inv.inv_total) {
                    inv.inv_payment_status = 'Partially Paid';  // Mark as partially paid if due date is today
                } else {
                    inv.inv_payment_status = 'Unpaid';  // Mark as paid if fully paid
                }
            }

        }
        return inv; // Return the updated invoice
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
