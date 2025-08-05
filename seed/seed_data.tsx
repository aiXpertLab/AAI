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
        be_logo: "",

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

    tax_list: [
        // Canada
        {
            tax_id: "tax_hst",
            tax_name: "HST",
            tax_rate: 0.13,
            tax_number: "123456789RT0001",
            tax_type: "federal",
            tax_note: "Canada Harmonized Sales Tax",
            ...baseFlags,
        },
        {
            tax_id: "tax_gst",
            tax_name: "GST",
            tax_rate: 0.05,
            tax_number: "123456789RT0001",
            tax_type: "federal",
            tax_note: "Canada Goods & Services Tax",
            ...baseFlags,
        },
        {
            tax_id: "tax_pst",
            tax_name: "PST",
            tax_rate: 0.07,
            tax_number: "123456789RT0001",
            tax_type: "provincial",
            tax_note: "Provincial Sales Tax (e.g. BC)",
            ...baseFlags,
        },
        {
            tax_id: "tax_qst",
            tax_name: "QST",
            tax_rate: 0.09975,
            tax_number: "123456789RT0001",
            tax_type: "provincial",
            tax_note: "Quebec Sales Tax",
            ...baseFlags,
        },

        // United States
        {
            tax_id: "tax_sst",
            tax_name: "SST",
            tax_rate: 0.06,
            tax_number: "US-TAX-001",
            tax_type: "state",
            tax_note: "State Sales Tax (e.g. FL, KY, PA)",
            ...baseFlags,
        },
        {
            tax_id: "tax_ct",
            tax_name: "CT",
            tax_rate: 0.01,
            tax_number: "US-TAX-002",
            tax_type: "county",
            tax_note: "County Tax (e.g. LA County, CA)",
            ...baseFlags,
        },
        {
            tax_id: "tax_lst",
            tax_name: "LST",
            tax_rate: 0.02,
            tax_number: "US-TAX-003",
            tax_type: "local",
            tax_note: "Local/City Tax (e.g. NYC, Chicago)",
            ...baseFlags,
        },
        {
            tax_id: "tax_dst",
            tax_name: "DST",
            tax_rate: 0.005,
            tax_number: "US-TAX-004",
            tax_type: "district",
            tax_note: "District Tax (e.g. LA Transit)",
            ...baseFlags,
        },
    ],


    clients: [
        {
            client_id: "C001",
            client_company_name: "Demo Client 1",
            client_contact_name: "Alice Johnson",
            client_contact_title: "Manager",
            client_business_number: "123456RT001",
            client_tax_id: "123456RT001",
            client_address: "123 Maple Street, Springfield",
            client_email: "alice.johnson@example.com",
            client_mainphone: "555-123-4567",
            client_secondphone: "second phone",
            client_fax: "fax",
            client_website: "https://example.com",
            client_currency: "USD",
            client_template_id: "t1",

            client_status: "active",
            client_note: "Preferred contact time: Morning",

            client_payment_method: "Bank Transfer",
            client_payment_term: 15,
            client_terms_conditions: "Payment due in 7 days.",
            ...baseFlags,
        },
        {
            client_id: "C002",
            client_company_name: "Demo Client 2",
            client_contact_name: "Bob Smith",
            client_contact_title: "Manager",
            client_business_number: "123456RT001",
            client_tax_id: "123456RT001",
            client_address: "456 Oak Avenue, Riverdale",
            client_email: "bob.smith@example.com",
            client_mainphone: "555-234-5678",
            client_secondphone: "second phone",
            client_fax: "fax",
            client_website: "https://example.com",
            client_currency: "CAD",
            client_template_id: "t1",

            client_status: "active",
            client_note: "Send invoice by email only",

            client_payment_method: "Bank Transfer",
            client_payment_term: 30,
            client_terms_conditions: "Payment due in 7 days.",
            ...baseFlags
        },
        {
            client_id: "C003",
            client_company_name: "Demo Client 3",
            client_contact_name: "Carol Lee",
            client_contact_title: "Manager",
            client_business_number: "123456RT001",
            client_tax_id: "123456RT001",
            client_address: "789 Pine Road, Fairview",
            client_email: "carol.lee@example.com",
            client_mainphone: "555-345-6789",
            client_secondphone: "second phone",
            client_fax: "fax",
            client_website: "https://example.com",
            client_currency: "GBP",
            client_template_id: "t1",

            client_status: "active",
            client_note: "Call before 5 PM",

            client_payment_method: "Bank Transfer",
            client_payment_term: 7,
            client_terms_conditions: "Payment due in 7 days.",
            ...baseFlags,
        },
        {
            client_id: "C004",
            client_company_name: "Demo Client 4",
            client_contact_name: "David Kim",
            client_contact_title: "Manager",
            client_business_number: "123456RT001",
            client_tax_id: "123456RT001",
            client_address: "321 Birch Blvd, Centerville",
            client_email: "david.kim@example.com",
            client_mainphone: "555-456-7890",
            client_secondphone: "second phone",
            client_fax: "fax",
            client_website: "https://example.com",
            client_currency: "USD",
            client_template_id: "t1",

            client_status: "active",
            client_note: "Pays on the 15th of each month",

            client_payment_method: "Bank Transfer",
            client_payment_term: 30,
            client_terms_conditions: "Payment due in 7 days.",
            ...baseFlags,
        },
        {
            client_id: "C005",
            client_company_name: "Demo Client 5",
            client_contact_name: "Emma Brown",
            client_contact_title: "Manager",
            client_business_number: "123456RT001",
            client_tax_id: "123456RT001",
            client_address: "654 Cedar Lane, Lakeside",
            client_email: "emma.brown@example.com",
            client_mainphone: "555-567-8901",
            client_secondphone: "second phone",
            client_fax: "fax",
            client_website: "https://example.com",
            client_currency: "OTHER",
            client_template_id: "t1",

            client_status: "active",
            client_note: "Requires itemized invoices",

            client_payment_method: "Bank Transfer",
            client_payment_term: 15,
            client_terms_conditions: "Payment due in 7 days.",
            ...baseFlags,
        },
    ],


    // Payment methods seed data
    items: [
        {
            item_id: "ITEM",
            item_sku: "FBAPMK5M",
            item_name: "🚧 Example Item (Tap to Edit)",
            item_description: "This is a sample item to demonstrate how items work. You can edit or replace it.",
            item_rate: 1.00,
            item_unit: "unit",
            item_note: "This item is for demo purposes only.",

            ...baseFlags,
        },
        {
            item_id: "T000",
            item_sku: "SKU 4225-776-3234",
            item_name: "Adjustment",
            item_description: "additional charges or credits",
            item_rate: 1.00,
            item_unit: "item",
            item_note: "Notes.",
            ...baseFlags,
        },
        {
            item_id: "T120",
            item_sku: "6IN-RD-CM-CO",
            item_name: "Product ",
            item_description: "Tangible goods or materials delivered",
            item_rate: 1500.00,
            item_unit: "project",
            item_note: "Notes.",
            ...baseFlags,
        },
        {
            item_id: "T130",
            item_sku: "SH123-BLK-8",
            item_name: "Consulting Session",
            item_description: "Business strategy session (1hr)",
            item_rate: 120.00,
            item_unit: "hour",
            item_note: "notes",
            ...baseFlags,
        },
    ],


    invs: [
        {
            inv_id: "empty",
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
            inv_reference: "",
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

            inv_items: [
                {
                    item_id: "",
                    item_number: "",
                    item_name: "",
                    item_description: "",
                    item_sku: "",
                    item_rate: 0.00,
                    item_unit: "",
                    item_note: "",
                    item_quantity: 0,
                    item_amount: 0.00,
                    item_status: "",
                },
            ],

            inv_payments: [
                {
                    pay_date: "",
                    pay_amount: 0.00,
                    pay_method: "",
                    pay_reference: "",
                    pay_note: "",
                },
            ],
            ...baseFlags,
            status: "empty",
        },

        {
            inv_id: "inv_1001",
            user_id: 1,
            be_id: 1,
            client_id: "C003",
            client_company_name: "Demo Client 3",
            client_contact_name: "Carol Lee",
            client_contact_title: "Manager",
            client_business_number: "123456RT001",
            client_tax_id: "123456RT001",
            client_address: "789 Pine Road, Fairview",
            client_email: "carol.lee@example.com",
            client_mainphone: "555-345-6789",
            client_secondphone: "second phone",
            client_fax: "fax",
            client_website: "https://example.com",
            client_currency: "GBP",
            client_template_id: "t1",

            client_status: "active",
            client_note: "Call before 5 PM",

            client_payment_method: "Bank Transfer",
            client_payment_term: 7,
            client_terms_conditions: "Payment due in 7 days.",

            inv_number: "INV-1001",
            inv_title: "Invoice for Demo Client 1",
            inv_date: serverTimestamp(),
            inv_due_date: serverTimestamp(),
            inv_payment_requirement: "Net 7 days",
            inv_payment_term: 7,
            inv_reference: "PO#-001",
            inv_currency: "USD",

            inv_subtotal: 240.00,
            inv_discount: 0.0,
            inv_tax_label: "Tax",
            inv_tax_rate: 0.0,
            inv_tax_amount: 0.0,
            inv_shipping: 0.0,
            inv_handling: 0.0,
            inv_deposit: 0.0,
            inv_adjustment: 0.0,
            inv_total: 240.00,

            inv_paid_total: 0.0,
            inv_balance_due: 240.00,
            inv_payment_status: "Unpaid",

            inv_flag_word: "Unpaid",
            inv_flag_emoji: "🟡",

            inv_pdf_template: "default",
            inv_notes: "Thank you for your business!",
            inv_terms_conditions: "Thank you for your business!",

            inv_items: [
                {
                    item_id: "T130",
                    item_number: "T130",
                    item_name: "Consulting Session",
                    item_description: "Business strategy session (1hr)",
                    item_sku: "SH123-BLK-8",
                    item_rate: 120.00,
                    item_unit: "hour",
                    item_note: "notes",
                    item_quantity: 2,
                    item_amount: 240.00,
                    item_status: "active",
                },
            ],
            inv_payments: [],
            ...baseFlags,
        },
        {
            inv_id: "inv_1002",
            user_id: 1,
            be_id: 1,
            client_id: "C002",
            client_company_name: "Demo Client 2",
            client_contact_name: "Bob Smith",
            client_contact_title: "Manager",
            client_business_number: "123456RT001",
            client_tax_id: "123456RT001",
            client_address: "456 Oak Avenue, Riverdale",
            client_email: "bob.smith@example.com",
            client_mainphone: "555-234-5678",
            client_secondphone: "second phone",
            client_fax: "fax",
            client_website: "https://example.com",
            client_currency: "CAD",
            client_template_id: "t1",

            client_status: "active",
            client_note: "Send invoice by email only",

            client_payment_method: "Bank Transfer",
            client_payment_term: 30,
            client_terms_conditions: "Payment due in 7 days.",


            inv_number: "INV-1002",
            inv_title: "Invoice for Demo Client 2",
            inv_date: serverTimestamp(),
            inv_due_date: serverTimestamp(),
            inv_payment_requirement: "Net 10 days",
            inv_payment_term: 10,
            inv_reference: "PO#-002",
            inv_currency: "CAD",

            inv_subtotal: 1500.00,
            inv_discount: 0.0,
            inv_tax_label: "Tax",
            inv_tax_rate: 0.13,
            inv_tax_amount: 195.00,
            inv_shipping: 0.0,
            inv_handling: 0.0,
            inv_deposit: 0.0,
            inv_adjustment: 0.0,
            inv_total: 1695.00,

            inv_paid_total: 1695.00,
            inv_balance_due: 0.00,
            inv_payment_status: "Paid",

            inv_flag_word: "Paid",
            inv_flag_emoji: "🟢",

            inv_pdf_template: "default",
            inv_notes: "Thank you for your business!",
            inv_terms_conditions: "Thank you for your business!",

            inv_items: [
                {
                    item_id: "T120",
                    item_number: "T120",
                    item_name: "Product ",
                    item_description: "Tangible goods or materials delivered",
                    item_sku: "6IN-RD-CM-CO",
                    item_rate: 1500.00,
                    item_unit: "project",
                    item_note: "Notes.",
                    item_quantity: 1,
                    item_amount: 1500.00,
                    item_status: "active",
                },
            ],
            inv_payments: [
                {
                    pay_date: "",

                    pay_amount: 1695.00,
                    pay_method: "bank transfer",
                    pay_reference: "TRX001",
                    pay_note: "Paid in full",
                },
            ],
            ...baseFlags,
        },
        {
            inv_id: "inv_1003",
            user_id: 1,
            be_id: 1,
            client_id: "C001",

            client_company_name: "Demo Client 3",
            client_contact_name: "Alice Johnson",
            client_contact_title: "Manager",
            client_business_number: "123456RT001",
            client_tax_id: "123456RT001",
            client_address: "123 Maple Street, Springfield",
            client_email: "alice.johnson@example.com",
            client_mainphone: "555-123-4567",
            client_secondphone: "second phone",
            client_fax: "fax",
            client_website: "https://example.com",
            client_currency: "USD",
            client_template_id: "t1",

            client_status: "active",
            client_note: "Preferred contact time: Morning",

            client_payment_method: "Bank Transfer",
            client_payment_term: 15,
            client_terms_conditions: "Payment due in 7 days.",


            inv_number: "INV-1003",
            inv_title: "Invoice for Client 3",
            inv_date: serverTimestamp(),
            inv_due_date: serverTimestamp(),
            inv_payment_requirement: "Net 7 days",
            inv_payment_term: 7,
            inv_reference: "PO#-003",
            inv_currency: "GBP",

            inv_subtotal: 2.00,
            inv_discount: 0.0,
            inv_tax_label: "Tax",
            inv_tax_rate: 0.0,
            inv_tax_amount: 0.0,
            inv_shipping: 0.0,
            inv_handling: 0.0,
            inv_deposit: 0.0,
            inv_adjustment: 0.0,
            inv_total: 2.00,

            inv_paid_total: 1.00,
            inv_balance_due: 1.00,
            inv_payment_status: "Partially Paid",

            inv_flag_word: "Partially Paid",
            inv_flag_emoji: "🟠",

            inv_pdf_template: "default",
            inv_notes: "Thank you for your business!",
            inv_terms_conditions: "Thank you for your business!",

            inv_items: [
                {
                    item_id: "ITEM",
                    item_number: "ITEM",
                    item_name: "🚧 Example Item (Tap to Edit)",
                    item_description: "This is a sample item to demonstrate how items work. You can edit or replace it.",
                    item_sku: "FBAPMK5M",
                    item_rate: 1.00,
                    item_unit: "unit",
                    item_note: "This item is for demo purposes only.",
                    item_quantity: 2,
                    item_amount: 2.00,
                    item_status: "active",
                },
            ],

            inv_payments: [
                {
                    pay_date: "",

                    pay_amount: 1.00,
                    pay_method: "credit card",
                    pay_reference: "TRX002",
                    pay_note: "First half",
                },
            ],
            ...baseFlags,
        },

    ],


    
};




export const seed_empty = {
    inv_empty: [
        {
            inv_id: "inv_id_empty",
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
            inv_reference: "",
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

            inv_items: [
                {
                    item_id: "",
                    item_number: "",
                    item_name: "",
                    item_description: "",
                    item_sku: "",
                    item_rate: 0.00,
                    item_unit: "",
                    item_note: "",
                    item_quantity: 0,
                    item_amount: 0.00,
                    item_status: "",
                },
            ],

            inv_payments: [
                {
                    pay_date: "",
                    pay_amount: 0.00,
                    pay_method: "",
                    pay_reference: "",
                    pay_note: "",
                },
            ],
            ...baseFlags,
            status: "empty",
        },
    ],
   
};