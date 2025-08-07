// fetchUserAndbiz.ts

import { SQLiteDatabase } from 'expo-sqlite';

// import { Biz, Tax } from "@/src/types";
import { BE_DB, TaxDB } from '@/src/types';

export const fetchBiz = async (
    db: SQLiteDatabase,
    bizMe: string = '666'
): Promise<{ biz: BE_DB | null }> => {
    try {
        const [bizResult] = await Promise.all([
            db.getFirstAsync<BE_DB>('SELECT * FROM biz WHERE biz_me = ?', [bizMe]),
        ]);

        return {
            biz: bizResult ?? null,
        };
    } catch (error) {
        console.error('Error fetching user and biz:', error);
        return {
            biz: null,
        };
    }
};


export const updateBiz = async (
    db: SQLiteDatabase,
    biz: BE_DB,
): Promise<boolean> => {
    try {
        console.log("Updating biz info...");
        await db.runAsync(
            `UPDATE Biz 
             SET biz_logo=?, biz_name = ?, biz_biz_number = ?, biz_address = ?, biz_email = ?, biz_phone = ?, biz_currency = ?, biz_description = ?
             WHERE me = ?`,
            [
                biz.biz_logo,
                biz.biz_name,
                biz.biz_address,
                biz.biz_email,
                biz.biz_phone,
                biz.biz_currency,
                biz.biz_description,
                'meme', // assuming this is always '666'
            ]
        );
        return true;
    } catch (error) {
        console.error("Error updating Biz:", error);
        return false;
    }
};


export const insertTax = async (
    db: SQLiteDatabase,
    tax: TaxDB,
): Promise<boolean> => {
    try {
        await db.runAsync(
            `INSERT INTO Tax (
               user_id,
               biz_id,
               tax_name,
               tax_rate,
               tax_number,
               tax_type,
               tax_note,
               tax_status
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                1,
                666,
                tax.tax_name,
                tax.tax_rate / 100,
                tax.tax_number ?? 'nmn',
                tax.tax_type ?? 'type',
                tax.tax_note ?? 'Tax note.',
                tax.tax_status ?? 'active',
            ]
        );
        return true;
    } catch (error) {
        console.error("Error updating Biz:", error);
        return false;
    }
};


export const updateTaxStatus = async (
    db: SQLiteDatabase,
    taxId: number,
    is_deleted: number = 0,
    status: string = 'deleted'
): Promise<boolean> => {
    try {
        console.log
        await db.runAsync(
            `UPDATE Tax 
         SET tax_status = ? , is_deleted = ?
         WHERE id = ?`,
            [status, is_deleted, taxId]
        );
        return true;
    } catch (error) {
        console.error("Error updating Tax status:", error);
        return false;
    }
};

