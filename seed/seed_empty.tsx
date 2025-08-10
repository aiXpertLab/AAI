import { serverTimestamp } from "firebase/firestore";
import * as Crypto from 'expo-crypto';

const baseFlags = {
    status: "5 stars",
    is_active: 1,
    is_locked: 0,
    is_deleted: 0,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
};



// Master seed data for new business entities
export const seed_empty = {

    inv_empty: [
        {
            inv_id: 'inv_' + Crypto.randomUUID().replace(/-/g, ''),
            user_id: 1,
            be_id: 1,
            client_id: "",

            client_company_name: "",
            client_contact_name: "",
            client_contact_title: "",
            client_business_number: "",
            client_tax_id: "",
            client_address: "",
            client_email: "",
            client_mainphone: "",
            client_secondphone: "",
            client_fax: "",
            client_website: "",
            client_currency: "",
            client_template_id: "",

            client_status: "",
            client_note: "",

            client_payment_method: "",
            client_payment_term: 7,
            client_terms_conditions: "",


            inv_number: "empty",
            inv_title: "",
            inv_date: serverTimestamp(),
            inv_due_date: serverTimestamp(),
            inv_payment_requirement: "",
            inv_payment_term: 7,
            inv_reference: "po#",
            inv_currency: "",

            inv_subtotal: 0.00,
            inv_discount: 0.0,
            inv_tax_label: "Tax",
            inv_tax_rate: 0.0,
            inv_tax_amount: 0.0,
            inv_shipping: 0.0,
            inv_handling: 0.0,
            inv_deposit: 0.0,
            inv_adjustment: 0.0,
            inv_total: 0.00,

            inv_paid_total: 0.00,
            inv_balance_due: 0.00,
            inv_payment_status: "",

            inv_flag_word: "",
            inv_flag_emoji: "🟠",

            inv_pdf_template: "default",
            inv_notes: "Thank you for your business!",
            inv_terms_conditions: "Thank you for your business!",

            inv_items: [],
            inv_payments: [],
            ...baseFlags,
            status: "empty",
        },
    ],


    item_empty: [
        {
            item_id: 'item_' + Crypto.randomUUID().replace(/-/g, ''),
            item_number: '',
            item_name: '',
            item_rate: 0,
            item_unit: '',
            item_sku: '',
            item_description: '',

            item_quantity: 0,  // for InvItem only
            item_note: "For InvItem Only",      // for InvItem only
            item_amount: 0,    // for InvItem only

            ...baseFlags,
        },
    ],



};