import { SQLiteDatabase } from 'expo-sqlite';
import { getTodayISO, addIsoDays } from "@/src/utils/dateUtils";

export const createInvoicesTable = `
        -- invoices table (user-specific invoices)
        CREATE TABLE IF NOT EXISTS invoices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            me TEXT         DEFAULT 'invoice',  -- The owner (freelancer/micro biz user)
            user_id     INTEGER DEFAULT 1,              -- The owner (freelancer/micro biz user)
            biz_id     INTEGER DEFAULT 1,              -- The owner (freelancer/micro biz user)
            client_id   INTEGER DEFAULT 1,

            biz_bk      TEXT DEFAULT 'BK.',
            biz_logo    TEXT DEFAULT '',
            biz_logo64    TEXT DEFAULT '',
            biz_name    TEXT DEFAULT 'My Corporation',  -- The owner (freelancer/micro bi user)
            biz_address TEXT DEFAULT '1600 Pennsylvania Ave.,\nWashington DC',  -- The owner (freelancer/micro bi user),
            biz_email   TEXT DEFAULT 'change@me.com',  -- The owner (freelancer/micro bi user),
            biz_phone   TEXT DEFAULT '1-888-168-5868',  -- The owner (freelancer/micro bi user),
            biz_biz_number  TEXT DEFAULT '821235679RC0001',
            biz_tax_id  TEXT DEFAULT '1685868RT001',  -- The owner (freelancer/micro bi user),
            biz_bank_info   TEXT DEFAULT 'TD Bank',  -- The owner (freelancer/micro bi user),
            biz_inv_template_id TEXT DEFAULT 't1',
            
            client_contact_name TEXT DEFAULT 'Contact',
            client_company_name TEXT DEFAULT 'My Client',
            client_address TEXT DEFAULT '',
            client_email TEXT DEFAULT '',
            client_mainphone TEXT DEFAULT '',
            client_secondphone TEXT DEFAULT '',
            client_fax TEXT DEFAULT '',
            client_currency TEXT DEFAULT 'USD',
            client_payment_method TEXT DEFAULT 'Bank Transfer',
            client_payment_term INTEGER DEFAULT 7,
            client_business_number TEXT DEFAULT '123456789',
            client_tax_id TEXT DEFAULT '123456789',
            client_notes TEXT DEFAULT 'Thank you for your business!',   
            client_terms_conditions TEXT DEFAULT 'Client Terms.',

            inv_number  TEXT NOT NULL UNIQUE,
            inv_title   TEXT DEFAULT 'Invoice',

            inv_date    TEXT  DEFAULT CURRENT_TIMESTAMP, --2025-04-19 14:42:00
            inv_due_date TEXT DEFAULT CURRENT_TIMESTAMP, --2025-04-19 14:42:00,
            inv_payment_requirement  TEXT DEFAULT "Net 30 days",
            inv_payment_term         INTEGER DEFAULT 7,
            inv_reference   TEXT DEFAULT 'Add reference (e.g. PO#)',
            inv_currency TEXT DEFAULT 'USD',

            inv_subtotal  REAL  DEFAULT 0.0,
            inv_discount  REAL  DEFAULT 0.0,
            inv_tax_label TEXT DEFAULT 'Tax',
            inv_tax_rate  REAL  DEFAULT 0.0,
            inv_tax_amount  REAL  DEFAULT 0.0,
            inv_shipping   REAL  DEFAULT 0.0,
            inv_handling   REAL  DEFAULT 0.0,
            inv_deposit   REAL  DEFAULT 0.0,
            inv_adjustment   REAL  DEFAULT 0.0,
            inv_total     REAL  DEFAULT 0.0,

            -- 🔥 NEW FIELDS FOR PAYMENT TRACKING
            inv_paid_total      REAL DEFAULT 0.0,              -- 🔥 total paid
            inv_balance_due     REAL DEFAULT 0.0,             -- 🔥 balance left
            inv_payment_status  TEXT DEFAULT 'Unpaid',     -- 🔥 status: unpaid / partially_paid / paid / overpaid
            
            is_locked INTEGER DEFAULT 0,
            is_deleted INTEGER DEFAULT 0,

            inv_flag_word     TEXT DEFAULT 'Unpaid',
            inv_flag_emoji    TEXT DEFAULT '🟡',


            inv_status  TEXT DEFAULT 'active',
            inv_pdf_template TEXT DEFAULT 'default',
            inv_notes     TEXT DEFAULT 'Thank you for your business!',                      
            inv_terms_conditions TEXT DEFAULT 'Thank you for your business!',                      

            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (client_id) REFERENCES clients(id)
        );





        -- Create inv_items table (products/services for invoice)
        CREATE TABLE IF NOT EXISTS inv_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            inv_id INTEGER NOT NULL,
            
            item_id INTEGER,
            item_number TEXT,   
            item_name TEXT,
            item_description TEXT,
            item_sku TEXT DEFAULT 'SKU',  -- Unit of measurement (e.g., hour, piece)

            item_rate REAL ,
            item_unit TEXT,
            item_note TEXT,

            item_quantity REAL ,
            item_amount REAL,
            item_status  TEXT DEFAULT 'active',

            is_locked INTEGER DEFAULT 0,
            is_deleted INTEGER DEFAULT 0,
            
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (inv_id) REFERENCES invoices(id)
        );
        
        -- 🔥 NEW TABLE: payments
        CREATE TABLE IF NOT EXISTS inv_payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            inv_id INTEGER NOT NULL DEFAULT 1,                         -- 🔥 Link to invoice

            pay_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            pay_amount REAL NOT NULL DEFAULT 0.0,                  -- 🔥 Amount paid
            pay_method TEXT DEFAULT 'bank transfer',             -- e.g., credit card, bank transfer, cash
            pay_reference TEXT DEFAULT '',                                  -- e.g., transaction ID
            pay_note TEXT DEFAULT '',

            is_locked INTEGER DEFAULT 0,
            is_deleted INTEGER DEFAULT 0,

            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (inv_id) REFERENCES invoices(id)
        );
`;

export async function seedInvoices(db: SQLiteDatabase, invNumber: string, invAmount: number, inv_id: number) {
    const flag = ['🔴'];

    const invDate = getTodayISO(); // → "2025-05-02T12:34:56.000Z"
    const dueDate = addIsoDays(invDate, 7); // → "2025-05-09T12:34:56.000Z"    

    await db.runAsync(`
            INSERT INTO invoices (
                user_id, client_id, client_company_name, inv_total,inv_balance_due, inv_notes, inv_number,
                inv_date, inv_due_date, inv_flag_emoji, inv_flag_word, inv_currency, inv_reference
            ) VALUES (?, ?, ?, ?, ?, ?, ?,?,?, '🔴','Overdue', 'USD' ,'PO#28388');
        `, [1, 1, 'Client TBD', invAmount, invAmount, 'Thank you for your business!', invNumber, invDate, dueDate]);

    await db.runAsync(`
        INSERT INTO inv_items (inv_id, item_name, item_quantity, item_rate, item_amount)
        VALUES (?, ?, ?, ?, ?); `, [inv_id, "Service", 1, 1000, 3824.83]);
}