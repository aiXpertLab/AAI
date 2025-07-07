import { useSQLiteContext, SQLiteDatabase } from 'expo-sqlite';
import { InvDB } from '@/src/types';
import { useInvStore, useInvItemListStore } from '@/src/stores/useInvStore';
import Toast from 'react-native-toast-message';

export const insertInvoice = async (db: any, oInv: any): Promise<number> => {
    const result = await db.runAsync(
        `INSERT INTO invoices (
            user_id, client_id,
            client_company_name, client_contact_name, client_address,
            inv_number, inv_date, inv_total, inv_subtotal, inv_due_date,
            inv_flag_word, inv_flag_emoji, inv_currency, inv_payment_term,
            inv_terms_conditions, inv_status, inv_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            oInv.user_id ?? 1,
            oInv.client_id,
            oInv.client_company_name,
            oInv.client_contact_name,
            oInv.client_address,
            oInv.inv_number,
            oInv.inv_date,
            oInv.inv_total,
            oInv.inv_subtotal,
            oInv.inv_due_date,
            oInv.inv_flag_word || 'unpaid',
            oInv.inv_flag_emoji || '🟡',
            oInv.inv_currency || 'USD',
            parseInt(oInv.inv_payment_days, 10) || 30,
            oInv.inv_terms_conditions || '',
            oInv.inv_status || 'active',
            oInv.inv_notes || ''
        ]
    );

    return result.lastInsertRowId;
};



export const updateInvoice = async (db: ReturnType<typeof useSQLiteContext>, oInv: InvDB) => {
    console.log('updateInvoice', oInv.id);
    return await db.runAsync(
        `UPDATE invoices SET
            
        biz_name = ?, 
        biz_address = ?, 
        biz_email = ?, 
        biz_phone = ?, 
        biz_biz_number = ?,
        
        inv_number = ?, 
        inv_date =?, 
        inv_due_date=?, 
        inv_reference=?,

        client_company_name=?, 
        client_contact_name=?,
        client_address=?,
        client_email=?,
        client_mainphone=?,
        client_currency=?,

        inv_subtotal = ?,
        inv_discount = ?,
        inv_tax = ?,
        inv_deposit = ?,
        inv_adjustment = ?,
        inv_total = ?,
        inv_balance_due = ?,
        

        inv_notes = ?,
        inv_payment_requirement = ?,
        inv_currency = ?,
           
        updated_at = CURRENT_TIMESTAMP

      WHERE id = ?`,
        oInv.biz_name , 
        oInv.biz_address , 
        oInv.biz_email , 
        oInv.biz_phone , 
        oInv.biz_biz_number ,
        
        oInv.inv_number , 
        oInv.inv_date , 
        oInv.inv_due_date, 
        oInv.inv_reference,

        oInv.client_company_name, 
        oInv.client_contact_name,
        oInv.client_address,
        oInv.client_email,
        oInv.client_mainphone,
        oInv.client_currency,

        oInv.inv_subtotal ,
        oInv.inv_discount ,
        oInv.inv_tax ,
        oInv.inv_deposit ,
        oInv.inv_adjustment ,
        oInv.inv_total ,
        oInv.inv_balance_due ,
        

        oInv.inv_notes ,
        oInv.inv_payment_requirement ,
        oInv.inv_currency ,

        oInv.id
    );
    console.log('updateInvoice', oInv.inv_number, );
};
