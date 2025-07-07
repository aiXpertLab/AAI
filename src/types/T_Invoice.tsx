export interface InvDB {
    id: number; // Auto-increment ID in DB
    user_id: number | null;
    biz_id: number | null; // Link to biz table
    me: string|"invoice"; // 'invoice' or 'receipt'

    biz_bk: string; // 0 or 1
    biz_logo: string;
    biz_logo64: string;
    biz_inv_template_id: string;
    biz_name: string;
    biz_address: string;
    biz_email: string;
    biz_phone: string;
    biz_biz_number: string;
    biz_tax_id: string;
    biz_bank_info: string;

    client_id: number | null;
    client_company_name: string;
    client_contact_name: string;
    client_business_number: string;
    client_address: string;
    client_email: string;
    client_mainphone: string;
    client_secondphone: string;
    client_fax: string;
    client_currency: string;
    client_payment_method: string;
    client_terms_conditions: string;
    client_notes: string;
    client_tax_id: string;
    
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
}


export interface InvItemDB {
    id: number;         // Auto ID
    inv_id: number;     // Link to invoice
    item_id: number;   //  item id
    item_number: string; // Item number (SKU) useless
    item_name: string;
    item_description: string;
    item_sku: string;   // Unit of measurement (e.g., hour, piece)
    item_quantity: number;
    item_rate: number;
    item_amount: number;
    item_status: 'active' | 'cancelled';
    created_at: string;
    updated_at: string;
}

export interface InvPaymentDB {
    id: number;
    inv_id: number;
    pay_date: string; // ISO timestamp text
    pay_amount: number;
    pay_method: string;
    pay_reference: string;
    pay_note: string;
}
