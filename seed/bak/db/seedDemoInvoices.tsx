import { SQLiteDatabase } from 'expo-sqlite';
import { useBizStore } from '@/src/stores/InvStore';

import { formatDate2Iso, getTodayISO, addIsoDays } from "@/src/utils/dateUtils";

export async function seedDemoInvoices(db: SQLiteDatabase) {
    const baseDate = new Date(getTodayISO());

    for (let i = 1; i <= 5; i++) {
        const invNumber = `INV-DEMO${10 + i}`;
        let invDate = baseDate.toISOString();
        let dueDate = addIsoDays(invDate, 7);

        const invTotal = +(Math.random() * 900 + 100).toFixed(2); // 100 - 1000
        let invPaid = 0;
        let invBalance = invTotal;
        let status = { emoji: '🔴', word: 'Unpaid', payment_status: 'Unpaid' };

        // Set up the payment status based on the invoice number
        if (i === 1) {
            // Fully paid invoice
            invPaid = invTotal;
            invBalance = 0;
            status = { emoji: '🟢', word: 'Paid', payment_status: 'Paid' };
        } else if (i === 2) {
            // Unpaid invoice
            invPaid = 0;
            invBalance = invTotal;
            status = { emoji: '🔴', word: 'Overdue', payment_status: 'Unpaid' };
        } else if (i === 3) {
            // Partially paid invoice (e.g., 50% paid)
            invPaid = +(invTotal / 2).toFixed(2);
            invBalance = +(invTotal - invPaid).toFixed(2);
            status = { emoji: '🟠', word: 'Partial', payment_status: 'Partially Paid' };
        } else if (i === 5) {
            // Unpaid invoice
            invDate = baseDate.toISOString();
            invDate = addIsoDays(invDate, -10); // 10 days ago
            dueDate = addIsoDays(invDate, 7);
            invPaid = 0;
            invBalance = invTotal;
            status = { emoji: '🔴', word: 'Overdue', payment_status: 'Overdue' };
        }

        // Insert invoice
        await db.runAsync(`
            INSERT INTO invoices (
                user_id, client_id, client_company_name,
                inv_total, inv_paid_total, inv_balance_due, inv_subtotal,
                inv_payment_status,
                inv_notes, inv_number,
                inv_date, inv_due_date,
                inv_flag_emoji, inv_flag_word,
                inv_currency, inv_reference
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);
            `, [
            1, 1, `Demo Client ${i}`,
            invTotal, invPaid, invBalance, invTotal,
            status.payment_status,
            'Demo invoice seeded at startup.',
            invNumber,
            invDate, dueDate,
            status.emoji, status.word,
            'USD', `PO${i}. Tap, delete at bottom.`
        ]);

        // Get the inserted invoice's ID
        const result = await db.getFirstAsync<{ id: number }>(`SELECT id FROM invoices WHERE inv_number = ?`, [invNumber]);
        const inv_id = result?.id;

        // Insert invoice item
        const quantity = Math.floor(Math.random() * 3) + 1; // 1–3
        const rate = +(invTotal / quantity).toFixed(2);
        const amount = +(quantity * rate).toFixed(2);

        await db.runAsync(`
      INSERT INTO inv_items (inv_id, item_name, item_quantity, item_rate, item_amount)
      VALUES (?, ?, ?, ?, ?);
    `, [inv_id!, `Service Package ${i}`, quantity, rate, amount]);

        // Insert payment for paid and partially paid invoices
        if (invPaid > 0) {
            await db.runAsync(`
        INSERT INTO inv_payments (inv_id, pay_amount, pay_method, pay_reference, pay_note)
        VALUES (?, ?, ?, ?, ?);
      `, [inv_id!, invPaid, 'bank transfer', `TXN-SEED-${i}`, i === 3 ? 'Partial payment' : 'Full payment']);
        }
    }
}

export const initNewInv = async (newNumber: string) => {
    const { oBiz } = useBizStore.getState();
    try {
        const today = new Date();
        const dueDate = new Date();
        dueDate.setDate(today.getDate() + 7);


        const fullInvoice = {
            inv_number: newNumber,

            inv_date: formatDate2Iso(today),
            inv_due_date: formatDate2Iso(dueDate),
            inv_reference: 'e.g. PO#1234',

            inv_subtotal: 0,
            inv_discount: 0,
            inv_tax: 0,
            inv_total: 0,
            inv_balance_due: 0,
            inv_terms_conditions: '',
            inv_notes: oBiz?.biz_bank_info || "TD Bank",

            client_company_name: "",

            biz_id: oBiz?.id || 1,
            biz_name: oBiz?.biz_name || "TBD",
            biz_email: oBiz?.biz_email || "my@changeme.com",
            biz_phone: oBiz?.biz_phone || "1-888-168-5868",
            biz_address: oBiz?.biz_address || "1600 Pennsylvania Avenue, Washington DC",
            biz_biz_number: oBiz?.biz_biz_number || "https://www.aibookshub.com",
            biz_bank_info: oBiz?.biz_bank_info || "TD Bank",
            biz_tax_id: oBiz?.biz_tax_id || "T0002R0001",
            biz_logo: oBiz?.biz_logo || "",
            biz_inv_template_id: oBiz?.biz_inv_template_id || "t1",
        };
        return fullInvoice; // return so caller can access it immediately
    } catch (err) {
        console.error("Failed to load invoices:", err);
        return {
            inv_number: "ERR-0000",
            inv_date: new Date().toISOString(),
            inv_due_date: new Date().toISOString(),
            inv_reference: 'e.g. PO#1234',

            inv_subtotal: 0,
            inv_discount: 0,
            inv_tax: 0,
            inv_total: 0,
            inv_balance_due: 0,
            inv_terms_conditions: '',
            inv_notes: oBiz?.biz_bank_info || "TD Bank",

        };
    }
};
