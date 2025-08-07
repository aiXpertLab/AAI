import { SQLiteDatabase } from 'expo-sqlite';

export const createItemsTable = `
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            
            user_id     INTEGER DEFAULT 1,              -- The owner (freelancer/micro biz user)
            biz_id     INTEGER DEFAULT 1,              -- The owner (freelancer/micro biz user)
            client_id   INTEGER DEFAULT 1,             -- The owner (freelancer/micro biz user)

            item_number      TEXT DEFAULT 'item number',                 -- Name of the product/service
            item_name        TEXT DEFAULT 'item name',                 -- Name of the product/service
            item_description TEXT DEFAULT 'item description',                          -- Optional detailed description
            item_sku        TEXT DEFAULT 'SKU',           -- Unit of measurement (e.g., hour, piece)
            item_rate        REAL NOT NULL DEFAULT 0.0,     -- Default price
            item_unit        TEXT DEFAULT 'unit',           -- Unit of measurement (e.g., hour, piece)
            item_note        TEXT DEFAULT 'item note',                          -- Optional detailed description
            
            item_status    TEXT DEFAULT 'active',
            is_locked INTEGER DEFAULT 0,
            is_deleted INTEGER DEFAULT 0,
            
            created_at  TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at  TEXT DEFAULT CURRENT_TIMESTAMP
        );
`;

export async function seedItems(db: SQLiteDatabase) {
    const items = [
        ['ITEM','FBAPMK5M','🚧 Example Item (Tap to Edit)', 'This is a sample item to demonstrate how items work. You can edit or replace it.', 1.00, 'unit', 'This item is for demo purposes only.',1],
        ['T000','SKU 4225-776-3234','Adjustment', 'additional charges or credits', 1.0, 'item', 'Notes.',0],
        ['T120','6IN-RD-CM-CO','Product ', 'Tangible goods or materials delivered', 1500.0, 'project', 'Notes.',0],
        ['T130','SH123-BLK-8','Consulting Session', 'Business strategy session (1hr)', 120.0, 'hour', 'notes',0],
    ];

    for (const item of items) {
        await db.runAsync(`
          INSERT INTO items (
            item_number,    
            item_sku,
            item_name,
            item_description,

            item_rate,
            item_unit,
            item_note,
            is_deleted
          ) VALUES (?,?, ?,?,    ?, ?, ?, ?);
        `, item);
    }
}
