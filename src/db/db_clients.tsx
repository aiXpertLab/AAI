import { SQLiteDatabase } from 'expo-sqlite';

export const createClientsTable = `
-- Clients Clients  Clients Clients

        CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id     INTEGER DEFAULT 1,              -- The owner (freelancer/micro biz user)
        biz_id      INTEGER DEFAULT 1,              -- The owner (freelancer/micro biz user)
        
        client_number TEXT  DEFAULT 'client number',
        client_company_name TEXT DEFAULT 'company name',
        client_contact_name TEXT DEFAULT 'contact name',
        client_contact_title TEXT DEFAULT 'Manager', -- Optional title for the contact person
        client_business_number TEXT DEFAULT '123456RT001',
        client_tax_id TEXT DEFAULT '123456RT001',
        client_address TEXT DEFAULT 'address',
        client_email TEXT DEFAULT 'email',
        client_mainphone TEXT DEFAULT 'main phone',
        client_secondphone TEXT DEFAULT 'second phone',
        client_fax TEXT DEFAULT 'fax',
        client_website TEXT DEFAULT 'https://example.com', -- Optional website URL
        client_currency TEXT DEFAULT 'USD',
        client_template_id TEXT DEFAULT 't1', -- Optional template for invoices/estimates

        client_status TEXT DEFAULT 'active',
        client_note     TEXT DEFAULT 'note',                          -- Optional detailed description

        is_locked INTEGER DEFAULT 0,
        is_deleted INTEGER DEFAULT 0,

        client_payment_method TEXT DEFAULT 'Bank Transfer',
        client_payment_term INTEGER DEFAULT 7,
        client_terms_conditions TEXT DEFAULT 'Payment due in 7 days.',

        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
`;



export async function seedClients(db: SQLiteDatabase) {
    const clients = [
        ['Demo Client 1', '123 Maple Street, Springfield', 'Alice Johnson', 'alice.johnson@example.com', '555-123-4567', 'Preferred contact time: Morning', 'USD', 15],
        ['Demo Client 2', '456 Oak Avenue, Riverdale', 'Bob Smith', 'bob.smith@example.com', '555-234-5678', 'Send invoice by email only', 'CAD', 30],
        ['Demo Client 3', '789 Pine Road, Fairview', 'Carol Lee', 'carol.lee@example.com', '555-345-6789', 'Call before 5 PM', 'GBP', 7],
        ['Demo Client 4', '321 Birch Blvd, Centerville', 'David Kim', 'david.kim@example.com', '555-456-7890', 'Pays on the 15th of each month', 'USD', 30],
        ['Demo Client 5', '654 Cedar Lane, Lakeside', 'Emma Brown', 'emma.brown@example.com', '555-567-8901', 'Requires itemized invoices', 'OTHER', 15],
    ];

    for (const client of clients) {
        await db.runAsync(`
            INSERT INTO clients (
                client_company_name, client_address, client_contact_name, client_email, client_mainphone, client_note,
                client_currency, client_payment_term) 
                VALUES (?, ?, ?,  ?, ?, ?,?,?);`,
            client);
    }
}
