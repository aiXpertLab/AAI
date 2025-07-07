import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';
import { ItemDB } from '@/src/types';

export const useItemCrud = () => {
    const db = useSQLiteContext();

    const insertItem = useCallback(
        (item: Partial<ItemDB>, onSuccess?: () => void, onError?: (e: any) => void) => {
            db.runAsync(
                `INSERT INTO items (
                   item_name, item_rate, item_unit, item_description, item_sku
                ) VALUES (?, ?, ?, ?, ?)`,
                [
                    item.item_name ?? 'TBD',
                    item.item_rate ?? 0,
                    item.item_unit ?? 'unit',
                    item.item_description ?? '',
                    item.item_sku ?? 'sku'
                ]
            )
                .then(onSuccess)
                .catch(onError);
        },
        [db]
    );





    const updateItem = useCallback(
        (item: Partial<ItemDB>, onSuccess?: () => void, onError?: (e: any) => void) => {
            if (item.id == null) { return; }

            db.runAsync(
                `UPDATE items SET
                item_name = ?,
                item_sku = ?,
                item_rate = ?,
                item_unit = ?,
                item_description = ?,
                is_deleted = ?,
                updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
                [
                    item.item_name ?? 'TBD',
                    item.item_sku ?? 'sku',
                    item.item_rate ?? 999,
                    item.item_unit ?? 'unit',
                    item.item_description ?? '',
                    item.is_deleted ?? 0,
                    item.id,
                ]
            )
                .then(onSuccess)
                .catch(onError);
        },
        [db]
    );
    return { insertItem, updateItem };
};
