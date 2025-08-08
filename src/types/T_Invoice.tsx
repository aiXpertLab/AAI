export interface InvDB {
    inv_id: string; // Auto-increment ID in DB
    user_id: string | null;
    be_id: string | null; // Link to biz table
    client_id: string | null;
    inv_pdf_template: string| null;

    client_number: string;
    client_company_name: string;
    client_contact_name: string;
    client_contact_title: string;
    client_address: string;
    client_email: string;
    client_secondphone: string;
    client_mainphone: string;
    client_fax: string;
    client_website: string; // Optional website URL

    client_business_number: string;

    client_tax_id: string;
    client_currency: string;
    client_terms_conditions: string;
    client_status: string;
    client_note: string;

    client_payment_term: number;
    client_payment_method: string;

    inv_number: string;
    inv_title: string;
    inv_date: string; // Stored as TEXT
    inv_due_date: string;
    inv_payment_term: number;
    inv_payment_requirement: string;
    inv_reference: string;
    inv_currency: string;

    inv_subtotal: number;
    inv_discount: number;
    inv_tax_amount: number;
    inv_tax_rate: number; // Percentage as a decimal (e.g., 0.15 for 15%)
    inv_tax_label: string; // Name of the tax (e.g., "VAT", "GST")
    inv_shipping: number; // Shipping cost, if applicable
    inv_handling: number; // Shipping cost, if applicable
    inv_deposit: number;
    inv_adjustment: number;
    inv_total: number;

    inv_paid_total: number;
    inv_balance_due: number;
    inv_payment_status: 'Unpaid' | 'Partially Paid' | 'Paid' | 'Overdue';

    is_locked: number;   // 0 or 1
    is_deleted: number;  // 0 or 1

    inv_flag_word: string;
    inv_flag_emoji: string;

    inv_terms_conditions: string;
    inv_notes: string;
    inv_status: string;

    created_at: any; // serverTimestamp()
    updated_at: any; // serverTimestamp()

    inv_items: Partial<ItemDB>[] | null;
    inv_payments: Partial<InvPaymentDB>[] | null;
}


export interface ItemDB {
    item_id: string;
    item_number?: string;
    item_name: string;
    item_description?: string;
    item_sku?: string;
    item_rate: number;
    item_unit?: string;
    item_quantity?: number;
    item_note?: string;
    item_amount?: number;
    item_status?: string;
    is_deleted?: number;
    created_at?: any; // serverTimestamp()
    updated_at?: any; // serverTimestamp()
}

export interface InvPaymentDB {
    pay_id: string;
    pay_date: string; // ISO timestamp text
    pay_amount: number;
    pay_method: string;
    pay_reference: string;
    pay_note: string;
}
