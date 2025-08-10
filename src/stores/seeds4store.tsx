import * as Crypto from 'expo-crypto';

import { PMDB, InvDB, ClientDB, ItemDB, TaxDB } from "@/src/types"

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


export const createEmptyItem4New = (): ItemDB => ({
    item_id: 'item_' + Crypto.randomUUID().replace(/-/g, ''),
    item_number: '',
    item_name: '',
    item_rate: 0,
    item_unit: '',
    item_sku: '',
    item_description: '',

    status: "5 stars",
    is_active: 1,
    is_locked: 0,
    is_deleted: 0,
    created_at: new Date(),
    updated_at: new Date(),

    item_quantity: 0,  // for InvItem only
    item_note: "For InvItem Only",      // for InvItem only
    item_amount: 0,    // for InvItem only

});


export const createEmptyTax4New = (): Partial<TaxDB> => ({
    tax_name: '',
    tax_rate: 0,
    tax_note: '',
})

export const createEmptyPM4New = (): Partial<PMDB> => ({
    pm_name: '',
    pm_note: '',
})


export const createEmptyInv4New = (): Partial<InvDB> => {
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 7);

    const formatDate = (date: Date): string => {
        return date.toISOString()
    };

    return {
        inv_reference: 'e.g. PO#1234',

        inv_subtotal: 0,
        inv_discount: 0,
        inv_total: 0,
        inv_balance_due: 0,

        inv_notes: '',
        inv_terms_conditions: '',
    };
};