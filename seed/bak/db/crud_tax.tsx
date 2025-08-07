import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';
import { TaxDB } from '@/src/types';

export const useTaxCrud = () => {
    const db = useSQLiteContext();

    const insertTax = useCallback(
        (taxline: Partial<TaxDB>, onSuccess?: () => void, onError?: (e: any) => void) => {
            db.runAsync(
                `INSERT INTO tax (
          tax_name, tax_rate, tax_number, tax_note
        ) VALUES (?, ?, ?, ? )`,
                [
                    taxline.tax_name ?? 'TBD',
                    taxline.tax_rate ?? 0,
                    taxline.tax_number ?? 'unit',
                    taxline.tax_note ?? ''
                ]
            )
                .then(onSuccess)
                .catch(onError);
        },
        [db]
    );

    const updateTax = useCallback(
        (taxline: Partial<TaxDB>, onSuccess?: () => void, onError?: (e: any) => void) => {
            if (taxline.id == null) { return; }

            db.runAsync(
                `UPDATE tax SET
                tax_name = ?,
                tax_rate = ?,
                tax_number = ?,
                tax_note = ?,
                is_deleted = ?,
                updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
                [
                    taxline.tax_name ?? 'TBD',
                    taxline.tax_rate ?? 0,
                    taxline.tax_number ?? 'unit',
                    taxline.tax_note ?? '',
                    taxline.is_deleted ?? 0,
                    taxline.id,
                ]
            )
                .then(onSuccess)
                .catch(onError);
        },
        [db]
    );
    return { insertTax, updateTax };
};
