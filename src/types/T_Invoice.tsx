export interface InvDB {
    inv_id: string; // Auto-increment ID in DB
    user_id: string;// reserved
    be_id: string;  // reserved
    client_id: string;// Link to client table

    inv_number: string; //INV-0001
    inv_date: Date;
    inv_due_date: Date;

    inv_title: string;  // INVOICE, top title for printing
    inv_template_id: string;  // t1

    inv_payment_term: number;
    inv_payment_requirement: string;
    inv_reference: string;
    inv_currency: string;

    inv_subtotal: number;
    inv_discount: number;   // -
    inv_tax_label: string;  // Name of the tax (e.g., "VAT", "GST")
    inv_tax_rate: number;   // Percentage as a decimal (e.g., 0.15 for 15%)
    inv_tax_amount: number; // -

    inv_shipping: number;   // Shipping cost, if applicable
    inv_handling: number;   // Shipping cost, if applicable
    inv_deposit: number;    // -
    inv_adjustment: number; // +
    inv_total: number;

    inv_paid_total: number;
    inv_balance_due: number;
    inv_payment_status: 'Unpaid' | 'Partially Paid' | 'Paid' | 'Overdue';

    inv_tnc: string;
    inv_notes: string;

    inv_items: ItemDB[];
    inv_payments: PMDB[];

    status: string;
    is_active: number;
    is_locked: number;
    is_deleted: number;
    created_at?: Date;
    updated_at?: Date;
}


export interface ItemDB {
    item_id: string;
    item_number: string;

    item_name: string;
    item_rate: number;
    item_unit: string;
    item_sku: string;
    item_description: string;

    status: string;
    is_active: number;
    is_locked: number;
    is_deleted: number;
    created_at?: Date;
    updated_at?: Date;

    item_quantity: number;  // for InvItem only
    item_note: string;      // for InvItem only
    item_amount: number;    // for InvItem only
}



export interface PMDB {
    pm_id: string;
    pm_name: string;
    pm_note: string;

    status: string;
    is_active: number;
    is_locked: number;
    is_deleted: number;
    created_at?: Date;
    updated_at?: Date;

    pay_date: Date;         // for InvPayment only
    pay_amount: number;     // for InvPayment only
    pay_reference: string;  // for InvPayment only
    pay_note: string;       // for InvPayment only
}

