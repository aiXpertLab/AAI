import { useSQLiteContext } from 'expo-sqlite';
import Toast from 'react-native-toast-message';
import { useInvStore } from '@/src/stores/useInvStore';
import { genInvNumber } from '../utils/genInvNumber';
import { InvDB, InvItemDB } from '@/src/types';

// Assuming genInvNumber is your async function that generates a new invoice number
// import { genInvNumber } from '@/src/utils/invUtils'; 

export const onDuplicate = async () => {
    const db = useSQLiteContext();
    const { oInv } = useInvStore.getState();

    if (!oInv?.id) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'No invoice selected.' });
        return false;
    }

    try {
        // Fetch full invoice record from DB
        const invRows = await db.getAllAsync<InvDB[]>(`SELECT * FROM invoices WHERE id = ?`, [oInv.id]);
        if (invRows.length === 0) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'Invoice not found in database.' });
            return false;
        }
        const invoiceData = invRows[0];

        // Fetch all items for that invoice
        const itemRows = await db.getAllAsync<InvItemDB[]>(`SELECT * FROM inv_items WHERE inv_id = ?`, [oInv.id]);

        // Generate new invoice number
        const newInvNumber = await genInvNumber(db);

        await db.runAsync('BEGIN');

        // Remove fields that should not be duplicated (id, is_deleted etc.) and override inv_number & dates
        const {
            id, is_deleted, inv_number, inv_date, inv_due_date, inv_paid_total, inv_balance_due,
            ...restInvoiceFields
        } = invoiceData[0];

        const now = new Date().toISOString();

        const duplicatedInvoice: Partial<InvDB> = {
            ...restInvoiceFields,
            inv_number: newInvNumber,
            inv_date: now,
            inv_due_date: now,  // or calculate based on payment terms if you want
            inv_paid_total: 0,
            inv_balance_due: invoiceData[0].inv_total,
            is_deleted: 0,
            inv_status: 'Unpaid',
        };

        // Prepare insert for invoice
        const invoiceColumns = Object.keys(duplicatedInvoice).join(', ');
        const invoicePlaceholders = Object.keys(duplicatedInvoice).map(() => '?').join(', ');
        const invoiceValues = Object.values(duplicatedInvoice);

        const insertInvoiceSQL = `INSERT INTO invoices (${invoiceColumns}) VALUES (${invoicePlaceholders})`;
        const insertInvoiceResult = await db.runAsync(insertInvoiceSQL, invoiceValues);

        const newInvoiceId = insertInvoiceResult.lastInsertRowId;

        // Duplicate each item for new invoice id
        for (const item of itemRows) {
            const {
                id: itemId, inv_id, created_at: itemCreatedAt, updated_at: itemUpdatedAt, ...restItemFields
            } = item[0];

            const duplicatedItem: Partial<InvItemDB> = {
                ...restItemFields,
                inv_id: newInvoiceId,
                created_at: now,
                updated_at: now,
            };

            const itemColumns = Object.keys(duplicatedItem).join(', ');
            const itemPlaceholders = Object.keys(duplicatedItem).map(() => '?').join(', ');
            const itemValues = Object.values(duplicatedItem);

            const insertItemSQL = `INSERT INTO inv_items (${itemColumns}) VALUES (${itemPlaceholders})`;
            await db.runAsync(insertItemSQL, itemValues);
        }

        await db.runAsync('COMMIT');

        Toast.show({
            type: 'success',
            text1: 'Invoice duplicated',
            text2: `New invoice #${newInvNumber} created.`,
        });

        return true;
    } catch (error) {
        await db.runAsync('ROLLBACK');
        console.error('Error duplicating invoice:', error);
        Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to duplicate invoice.' });
        return false;
    }
};
