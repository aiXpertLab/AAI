import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';
import { BizDB } from '@/src/types'; // Make sure you define this type

const db = useSQLiteContext();

export const useLogoCrud = () => {
    const updateLogo = useCallback(
        (uri: string, onSuccess?: () => void, onError?: (e: any) => void) => {
            db.runAsync(
                `UPDATE biz SET biz_logo = ? WHERE biz_me = ?`, [uri, '666']
            )
                .then(onSuccess)
                .catch(onError);
        },
        [db]
    );

    return { updateLogo };
};


// // fetchUserAndbiz.ts

// import { SQLiteDatabase } from 'expo-sqlite';

// // import { Biz, Tax } from "@/src/types";
// import { BizDB } from '@/src/types';

// export const fetchBiz = async (
//     db: SQLiteDatabase,
//     bizMe: string = '666'
// ): Promise<{ biz: BizDB | null }> => {
//     try {
//         const [bizResult] = await Promise.all([
//             db.getFirstAsync<BizDB>('SELECT * FROM biz WHERE biz_me = ?', [bizMe]),
//         ]);

//         return {
//             biz: bizResult ?? null,
//         };
//     } catch (error) {
//         console.error('Error fetching user and biz:', error);
//         return {
//             biz: null,
//         };
//     }
// };


// export const updateBiz = async (
//     db: SQLiteDatabase,
//     biz: BizDB,
// ): Promise<boolean> => {
//     try {
//         await db.runAsync(
//             `UPDATE Biz 
//              SET biz_name = ?, biz_address = ?, biz_email = ?, biz_phone = ?, biz_currency = ?, biz_description = ?
//              WHERE biz_me = ?`,
//             [
//                 biz.biz_name,
//                 biz.biz_address,
//                 biz.biz_email,
//                 biz.biz_phone,
//                 biz.biz_currency,
//                 biz.biz_description,
//                 '666', // assuming this is always '666'
//             ]
//         );
//         return true;
//     } catch (error) {
//         console.error("Error updating Biz:", error);
//         return false;
//     }
// };


// export const insertTax = async (
//     db: SQLiteDatabase,
//     tax: Tax,
// ): Promise<boolean> => {
//     try {
//         await db.runAsync(
//             `INSERT INTO Tax (
//                user_id,
//                biz_id,
//                tax_name,
//                tax_rate,
//                tax_number,
//                tax_type,
//                tax_note,
//                tax_status
//              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 1,
//                 666,
//                 tax.tax_name,
//                 parseFloat(tax.tax_rate) / 100,
//                 tax.tax_number,
//                 tax.tax_type ?? 'type',
//                 tax.tax_note ?? 'Tax note.',
//                 tax.tax_status ?? 'active',
//             ]
//         );
//         return true;
//     } catch (error) {
//         console.error("Error updating Biz:", error);
//         return false;
//     }
// };


// export const updateTaxStatus = async (
//     db: SQLiteDatabase,
//     taxId: number,
//     status: string = 'deleted'
//   ): Promise<boolean> => {
//     try {
//       await db.runAsync(
//         `UPDATE Tax 
//          SET tax_status = ? 
//          WHERE id = ?`,
//         [status, taxId]
//       );
//       return true;
//     } catch (error) {
//       console.error("Error updating Tax status:", error);
//       return false;
//     }
//   };
  