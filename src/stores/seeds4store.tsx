import { serverTimestamp } from "firebase/firestore";
import * as Crypto from 'expo-crypto';

import { getInvoiceNumber } from "@/src/utils/genInvNumber";
import { PMDB, InvDB, ClientDB, ItemDB, TaxDB } from "@/src/types"

const baseFlags = {
    status: "5 stars",
    is_active: 1,
    is_locked: 0,
    is_deleted: 0,
    created_at: new Date(),
    updated_at: new Date(),
};



export const createEmptyClient4New = (): Partial<ClientDB> => ({
    client_company_name: '',
    client_address: '',
    client_business_number: '',

    client_contact_name: '',
    client_email: '',
    client_mainphone: '',
    client_secondphone: '',
    client_fax: '',

    client_currency: '',
    client_payment_term: 7,
    client_terms_conditions: '',
    client_note: '',
})




export const createEmptyTax4New = (): Partial<TaxDB> => ({
    tax_name: '',
    tax_rate: 0,
    tax_note: '',
})

export const createEmptyPM4New = (): Partial<PMDB> => ({
    pm_name: '',
    pm_note: '',
})



export const emptyItem = (): ItemDB => ({
    item_id: 'item_' + Crypto.randomUUID().replace(/-/g, ''),
    item_number: 'P001',
    item_name: 'Sample',
    item_rate: 1,
    item_unit: 'item',
    item_sku: 'FBAPMK6M',
    item_description: 'Change me.',

    item_quantity: 5,  // for InvItem only
    item_note: "For InvItem Only",      // for InvItem only
    item_amount: 5,    // for InvItem only

    ...baseFlags,

});


export const emptyInv = (): InvDB => ({
    inv_id: 'inv_' + Crypto.randomUUID().replace(/-/g, ''),
    user_id: "reserved",
    be_id: "reserved",
    client_id: "link to client",

    inv_number: "pending for oBiz",
    inv_date: new Date(),
    inv_due_date: new Date(),

    inv_title: "INVOICE",
    inv_template_id: "t1",

    inv_payment_term: 7,
    inv_payment_requirement: "Next 7",
    inv_reference: "PO#168",
    inv_currency: "USD",

    inv_subtotal: 0.00,
    inv_discount: 0,
    inv_tax_label: "Tax",
    inv_tax_rate: 0.0,   // 1%
    inv_tax_amount: 0,

    inv_shipping: 11.11,
    inv_handling: 11.11,
    inv_deposit: 11.11,
    inv_adjustment: 11.11,

    inv_total: 0,

    inv_paid_total: 11.11,
    inv_balance_due: 11.11,
    inv_payment_status: "Unpaid",

    inv_tnc: "Thank you for your business!",
    inv_notes: "Payment Method:\nBank Name: JPM \nAccount Number: 123456 \nBank Address: New York",

    inv_items: [],
    inv_payments: [],
    ...baseFlags,
});