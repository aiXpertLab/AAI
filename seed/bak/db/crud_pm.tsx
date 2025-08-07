import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';
import {PMDB } from '@/src/types';

export const usePMCrud = () => {
    const db = useSQLiteContext();

    const insertPM = useCallback(
        (pm: Partial<PMDB>, onSuccess?: () => void, onError?: (e: any) => void) => {
            db.runAsync(
                `INSERT INTO payment_methods (
          pm_name, pm_note
        ) VALUES (?, ?  )`,
                [
                    pm.pm_name ?? 'TBD',
                    pm.pm_note ?? ''
                ]
            )
                .then(onSuccess)
                .catch(onError);
        },
        [db]
    );

    const updatePM = useCallback(
        (pm: Partial<PMDB>, onSuccess?: () => void, onError?: (e: any) => void) => {
            if (pm.id == null) { return; }

            db.runAsync(
                `UPDATE  payment_methods SET
                pm_name = ?,
                pm_note = ?,
                is_deleted = ?,
                updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
                [
                    pm.pm_name ?? 'TBD',
                    pm.pm_note ?? '',
                    pm.is_deleted ?? 0,
                    pm.id,
                ]
            )
                .then(onSuccess)
                .catch(onError);
        },
        [db]
    );
    return { insertPM,updatePM };
};
