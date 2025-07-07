import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { useInvStore, useInvItemListStore } from '@/src/stores/useInvStore';
import { genInvNumber } from '@/src/utils/genInvNumber';
import { InvDB, InvItemDB } from '@/src/types';

export const useInvoiceCrud = () => {
    const db = useSQLiteContext();

    const saveInvoice = useCallback(async () => {
        const { oInv } = useInvStore.getState();

        const { oInvItemList: oInvItems } = useInvItemListStore.getState();

        console.log("Saving invoice to DB: oInv", oInv);
        console.log("Saving invoice to DB: oInvItems", oInvItems);

        if (!oInv) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'Invoice data is not available.' });
            return false;
        }

        // Validation: Check if client company name is empty or only whitespace
        if (!oInv.client_company_name?.trim()) {
            Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Client company name cannot be empty or just whitespace.' });
            return false;
        }

        // Validation: Check for duplicate invoice number
        const existing = await db.getAllAsync('SELECT id FROM invoices WHERE inv_number = ?', [oInv.inv_number!]);
        if (existing.length > 0) {
            Toast.show({ type: 'error', text1: 'Duplicate Invoice', text2: `Invoice #${oInv.inv_number} already exists.` });
            return false;
        }
        const query = `
            INSERT INTO invoices (
                inv_number, inv_date, inv_due_date,
                client_company_name, inv_total, inv_subtotal, inv_tax_label, inv_tax_rate, inv_tax_amount, inv_discount,
                inv_deposit, inv_adjustment, inv_notes, inv_reference,
                inv_payment_term, inv_payment_requirement, inv_currency,
                biz_logo, biz_name, biz_address, biz_email, biz_phone, inv_balance_due,
                client_contact_name, client_email, client_address, client_mainphone,
                biz_inv_template_id,
                updated_at  
            ) VALUES (?, ?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?,?, ?, ?,?,strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
        `;

        const sanitizeInvoice = (inv: Record<string, any>) => [
            inv.inv_number, inv.inv_date, inv.inv_due_date,
            inv.client_company_name, inv.inv_total, inv.inv_subtotal, inv.inv_tax_label, inv.inv_tax_rate, inv.inv_tax_amount, inv.inv_discount,
            inv.inv_deposit, inv.inv_adjustment, inv.inv_notes, inv.inv_reference,
            inv.inv_payment_term, inv.inv_payment_requirement, inv.inv_currency,
            inv.biz_logo, inv.biz_name, inv.biz_address, inv.biz_email, inv.biz_phone, inv.inv_total,
            inv.client_contact_name, inv.client_email, inv.client_address, inv.client_mainphone,
            inv.biz_inv_template_id ?? 't1', // Default template ID if not provided
        ].map(v => v ?? null);

        try {
            await db.runAsync('BEGIN');
            const invoiceResult = await db.runAsync(query, sanitizeInvoice(oInv));
            const newInvoiceId = invoiceResult.lastInsertRowId;

            for (const item of oInvItems || []) {
                await db.runAsync(`
                    INSERT INTO inv_items (
                        inv_id, item_name, item_description,
                        item_quantity, item_rate, item_amount,
                        item_id, item_number
                    ) VALUES (?, ?, ?, ?, ?,?,?,?)
                `, [
                    newInvoiceId,
                    item.item_name ?? '',
                    item.item_description ?? '',
                    item.item_quantity ?? 1,
                    item.item_rate ?? 0,
                    item.item_amount ?? 0,
                    item.item_id ?? '',
                    item.item_number ?? '',
                ]);
            }

            await db.runAsync('COMMIT');
            Toast.show({
                type: 'success',
                text1: `Invoice #${oInv.inv_number} saved successfully.`,
                position: 'bottom',
            });
            return true;
        } catch (err) {
            await db.runAsync('ROLLBACK');
            console.error("Error saving invoice:", err);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to save invoice.' });
            return false;
        }
    }, [db]);


    const deleteInvoice = useCallback(async (invoiceId: number, invoiceNumber: string) => {
        try {
            await db.runAsync(
                'UPDATE invoices SET is_deleted = 1 WHERE id = ?',
                [invoiceId]
            );
            return true;
        } catch (err) {
            console.error("Error deleting invoice:", err);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to delete invoice.' });
            return false;
        }
    }, [db]);


    const restoreDeletedInvoice = useCallback(async (invoiceId: number, invoiceNumber: string) => {
        try {
            await db.runAsync(
                'UPDATE invoices SET is_deleted = 0 WHERE id = ?',
                [invoiceId]
            );
            Toast.show({
                type: 'success',
                text1: 'Deleted invocie restored.',
                text2: `Invoice ${invoiceNumber} was restored.`,
                position: 'bottom',
            });
            return true;
        } catch (err) {
            console.error("Error restoring invoice:", err);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to restore invoice.' });
            return false;
        }
    }, [db]);


    const lockInvoice = useCallback(async (invoiceId: number, invoiceNumber: string) => {
        try {
            await db.runAsync(
                'UPDATE invoices SET is_locked = 1 WHERE id = ?',
                [invoiceId]
            );
            return true;
        } catch (err) {
            console.error("Error locking invoice:", err);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to delete invoice.' });
            return false;
        }
    }, [db]);

    const restoreArchived = useCallback(async (invoiceId: number, invoiceNumber: string) => {
        try {
            await db.runAsync(
                'UPDATE invoices SET is_locked = 0 WHERE id = ?',
                [invoiceId]
            );
            Toast.show({
                type: 'success',
                text1: 'Archived Invoice Restored',
                text2: `Invoice ${invoiceNumber} has been restored from archieved.`,
                position: 'bottom',
            });
            return true;
        } catch (err) {
            console.error("Error restoring invoice:", err);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to restore invoice.' });
            return false;
        }
    }, [db]);

    const updateInvoice = useCallback(async () => {
        const { oInv } = useInvStore.getState();
        const { oInvItemList: oInvItems } = useInvItemListStore.getState();

        console.log(JSON.stringify(oInv, null, 4));

        if (!oInv || !oInv.id) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'Invoice data is missing or invalid.' });
            return false;
        }

        if (!oInv.client_company_name?.trim()) {
            Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Client company name cannot be empty or just whitespace.' });
            return false;
        }

        // Validation: Prevent duplicate invoice number (exclude current ID)
        const existing = await db.getAllAsync(
            'SELECT id FROM invoices WHERE inv_number = ? AND id != ?',
            [oInv.inv_number!, oInv.id]
        );
        if (existing.length > 0) {
            Toast.show({ type: 'error', text1: 'Duplicate Invoice', text2: `Invoice #${oInv.inv_number} already exists.` });
            return false;
        }

        const updateQuery = `
        UPDATE invoices SET
            inv_number = ?, inv_date = ?, inv_due_date = ?,
            client_company_name = ?, inv_total = ?, inv_subtotal = ?, inv_tax_label = ?, inv_tax_rate=?, inv_tax_amount=?, inv_discount = ?,
            inv_deposit = ?, inv_adjustment = ?, inv_notes = ?, inv_reference = ?,
            inv_payment_term = ?, inv_payment_requirement = ?, inv_currency = ?,
            biz_logo = ?, biz_name = ?, biz_address = ?, biz_email = ?, biz_phone = ?, inv_balance_due = ?,
            client_contact_name = ?, client_email = ?, client_address = ?, client_mainphone = ?,
            biz_inv_template_id = ?,
            updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
        WHERE id = ?
    `;

        const sanitizeInvoice = (inv: Record<string, any>) => [
            inv.inv_number, inv.inv_date, inv.inv_due_date,
            inv.client_company_name, inv.inv_total, inv.inv_subtotal, inv.inv_tax_label, inv.inv_tax_rate, inv.inv_tax_amount, inv.inv_discount,
            inv.inv_deposit, inv.inv_adjustment, inv.inv_notes, inv.inv_reference,
            inv.inv_payment_term, inv.inv_payment_requirement, inv.inv_currency,
            inv.biz_logo, inv.biz_name, inv.biz_address, inv.biz_email, inv.biz_phone, inv.inv_total,
            inv.client_contact_name, inv.client_email, inv.client_address, inv.client_mainphone,
            inv.biz_inv_template_id,
            inv.id
        ].map(v => v ?? null);

        try {
            await db.runAsync('BEGIN');

            await db.runAsync(updateQuery, sanitizeInvoice(oInv));

            // Delete old items and insert new ones
            await db.runAsync('DELETE FROM inv_items WHERE inv_id = ?', [oInv.id]);

            for (const item of oInvItems || []) {
                await db.runAsync(`
                INSERT INTO inv_items (
                    inv_id, item_name, item_description,
                    item_quantity, item_rate, item_amount
                ) VALUES (?, ?, ?, ?, ?, ?)
            `, [
                    oInv.id,
                    item.item_name ?? '',
                    item.item_description ?? '',
                    item.item_quantity ?? 1,
                    item.item_rate ?? 0,
                    item.item_amount ?? 0,
                ]);
            }

            await db.runAsync('COMMIT');
            Toast.show({
                type: 'success',
                text1: `Invoice #${oInv.inv_number} updated successfully.`,
                position: 'bottom',
            });
            return true;
        } catch (err) {
            await db.runAsync('ROLLBACK');
            console.error("Error updating invoice:", err);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to update invoice.' });
            return false;
        }
    }, [db]);


    const duplicateInvoice = useCallback(async () => {
        const { oInv } = useInvStore.getState();

        if (!oInv?.id) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'No invoice selected to duplicate.' });
            return false;
        }

        try {
            await db.runAsync('BEGIN');

            // 1. Get the complete source invoice data from database
            const sourceInvoice = await db.getFirstAsync<InvDB>(
                'SELECT * FROM invoices WHERE id = ?',
                [oInv.id]
            );

            if (!sourceInvoice) {
                Toast.show({ type: 'error', text1: 'Error', text2: 'Source invoice not found in database.' });
                await db.runAsync('ROLLBACK');
                return false;
            }

            // 2. Get all items for the source invoice
            const sourceItems = await db.getAllAsync<InvItemDB>(
                'SELECT * FROM inv_items WHERE inv_id = ?',
                [oInv.id]
            );

            // 3. Generate new invoice number
            const newInvNumber = await genInvNumber(db);

            // 4. Prepare the new invoice data
            const newInvoiceData = {
                ...sourceInvoice,
                id: undefined, // Will be auto-generated
                inv_number: newInvNumber,
                inv_date: new Date().toISOString().split('T')[0],
                inv_paid_total: 0,
                inv_balance_due: sourceInvoice.inv_total,
                inv_payment_status: 'Unpaid' as const,
                is_locked: 0,
                is_deleted: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            // Remove the id property to allow auto-increment
            const { id, ...insertData } = newInvoiceData;

            // 5. Insert the new invoice
            const invoiceInsertResult = await db.runAsync(
                `INSERT INTO invoices (${Object.keys(insertData).join(',')}) 
             VALUES (${Object.keys(insertData).map(() => '?').join(',')})`,
                Object.values(insertData)
            );

            const newInvoiceId = invoiceInsertResult.lastInsertRowId;

            // 6. Insert all items for the new invoice
            for (const item of sourceItems) {
                await db.runAsync(
                    `INSERT INTO inv_items (
                    inv_id, item_id, item_number, item_name, 
                    item_description, item_quantity, item_rate, 
                    item_amount, item_status, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        newInvoiceId,
                        item.item_id,
                        item.item_number,
                        item.item_name,
                        item.item_description,
                        item.item_quantity,
                        item.item_rate,
                        item.item_amount,
                        item.item_status,
                        new Date().toISOString(),
                        new Date().toISOString()
                    ]
                );
            }

            await db.runAsync('COMMIT');


            Toast.show({
                type: 'success',
                text1: 'Invoice Duplicated',
                text2: `New invoice #${newInvNumber} created from #${sourceInvoice.inv_number}`,
                position: 'bottom'
            });

            return true;
        } catch (err) {
            await db.runAsync('ROLLBACK');
            console.error("Error duplicating invoice:", err);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to duplicate invoice.'
            });
            return false;
        }
    }, [db]);

    return { duplicateInvoice, saveInvoice, deleteInvoice, lockInvoice, updateInvoice, restoreDeletedInvoice, restoreArchived };
};
