import { ItemDB, ItemUI } from '@/src/types';

export const convertUIToDB = (ui: ItemUI): ItemDB => ({
    id: ui.id,
    user_id: ui.user_id,
    item_name: ui.item_name,
    item_description: ui.item_description,
    item_unit_price: parseFloat(ui.item_unit_price),
    item_unit: ui.item_unit,
    item_note: ui.item_note,
    item_status: ui.item_status,
});

export const convertDBToUI = (db: ItemDB): ItemUI => ({
    id: db.id,
    user_id: db.user_id,
    item_name: db.item_name,
    item_description: db.item_description,
    item_unit_price: db.item_unit_price.toString(),
    item_unit: db.item_unit,
    item_note: db.item_note,
    item_status: db.item_status,
});
