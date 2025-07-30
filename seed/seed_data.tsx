import { serverTimestamp } from "firebase/firestore";

const baseFlags = {
    status: "5 stars",

    is_active: 1,
    is_locked: 0,
    is_deleted: 0,

};

// Master seed data for new business entities
export const seed_data = {
    business_entity: {
        me: "meme",                              // optional: slug or handle
        user_id: "user_id_aiautoinvoicing",

        be_id: "be_id_aiautoinvoicing",
        be_bk: "BK.",
        be_64_square: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC",
        be_logo: "",
        be_logo_64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC",

        be_name: "My Corporation",
        be_type: "sole_proprietorship",
        be_address: "1600 Pennsylvania Ave.,\nWashington DC",
        be_email: "change@me.com",
        be_phone: "1-888-168-5868",

        be_be_number: "821235679RC0001",
        be_tax_id: "1685868RT001",
        be_bank_info: "TD Bank",
        be_payment_term: 7,

        be_currency: "USD",
        be_inv_template_id: "t1",
        be_website: "https://aiautoinvoicing.github.io",
        be_description: "This is a note for the bissiness.",
        be_note: "This is a note for the bissiness.",

        be_timezone: "America/New_York",
        be_date_format: "MM/DD/YYYY",
        be_invoice_prefix: "INV",
        be_next_invoice_number: 1001,
        ...baseFlags,
    },

    // Payment methods seed data
    payment_methods: [
        {
            pm_id: "pm_credit_card",
            pm_name: "Credit Card",
            pm_note: "Processed via Stripe, Square, Paypal, or similar payment processors.",
            ...baseFlags,
        },
        {
            pm_id: "pm_check",  
            pm_name: "Check",
            pm_note: "Make payable to your business name as shown on the invoice.",
            ...baseFlags,
        },
        {
            pm_id: "pm_cash",
            pm_name: "Cash",
            pm_note: "Accepted for in-person/local transactions only.",
            ...baseFlags,            
        },
        {
            pm_id: "pm_bank_transfer_ach",
            pm_name: "Bank Transfer (ACH)",
            pm_note: "U.S. bank transfer. Routing and account number required.",
            ...baseFlags,
        },
        {
            pm_id: "pm_wire_transfer",
            pm_name: "Wire Transfer",
            pm_note: "International or domestic wire transfer. Bank fees may apply.",
            ...baseFlags,
        },
        {
            pm_id: "pm_paypal",
            pm_name: "PayPal",
            pm_note: "Send payments to your PayPal email address (e.g., user@example.com).",
            ...baseFlags,
        },
        {
            pm_id: "pm_bank_transfer_eft",
            pm_name: "Bank Transfer (EFT)",
            pm_note: "Electronic Funds Transfer (EFT) for Canadian customers.",
            ...baseFlags,
        },
        {
            pm_id: "pm_interac_e_transfer",
            pm_name: "Interac e-Transfer",
            pm_note: "Available for Canadian bank customers only.",
            ...baseFlags,
        },
        {
            pm_id: "pm_z_other",
            pm_name: "Other",
            pm_note: "Refer to the invoice note for custom payment instructions.",
            ...baseFlags,
        },
    ],
}