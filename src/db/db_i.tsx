import { SQLiteDatabase } from 'expo-sqlite';
import { createBizTables, seedUsersBiz } from './db_biz';
import { createClientsTable, seedClients } from './db_clients';
import { createInvoicesTable, seedInvoices } from './db_invoices';
import { createItemsTable, seedItems } from './db_items';
import { seedDemoInvoices } from './seedDemoInvoices';

// Function to initialize or migrate the database
export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 1;  // Increment the version to match schema changes

    const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    const currentDbVersion = result?.user_version ?? 0;

    if (currentDbVersion >= DATABASE_VERSION) {
        // return;         
        console.log('new db created.');
    }

    // Drop existing tables (if any) and recreate them with the new schema
    await db.execAsync(`
        PRAGMA journal_mode = 'wal';

        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS biz;
        DROP TABLE IF EXISTS clients;
        DROP TABLE IF EXISTS tax;
        DROP TABLE IF EXISTS payment_methods;

        DROP TABLE IF EXISTS invoices;
        DROP TABLE IF EXISTS items;
        DROP TABLE IF EXISTS inv_items;
        DROP TABLE IF EXISTS inv_payments;
    `);

    await db.execAsync(createBizTables);
    await seedUsersBiz(db);

    await db.execAsync(createClientsTable);
    await seedClients(db);

    await db.execAsync(createItemsTable);
    await seedItems(db);

    await db.execAsync(createInvoicesTable);
    // await seedInvoices(db, "INV-000001", 3824.83, 1); // for testing
    // await seedInvoices(db, "INV-000002", 126.27, 2)   // for default

    await seedDemoInvoices(db);
    // Update user version to the current version
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}