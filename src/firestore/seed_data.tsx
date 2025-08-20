const baseFlags = {
    status: "5 stars",
    is_active: 1,
    is_locked: 0,
    is_deleted: 0,  // 1-deleted. 0-default. 2.TBD/hidden, always show 0. never show 2.
    created_at: new Date(),
    updated_at: new Date(),
};



// Master seed data for new business entities
export const seed_data = {
    business_entity: {
        user_id: "user_id_aiautoinvoicing",

        be_id: "be_id_aiautoinvoicing",
        be_logo: "",
        be_name: "My Corporation",
        be_address: "1600 Pennsylvania Ave.,\nWashington DC",
        be_contact: "John Doe",
        be_email: "change@me.com",
        be_phone: "1-888-168-5868",
        be_website: "https://aiautoinvoicing.github.io",
        be_type: "sole_proprietorship",

        be_biz_number: "821235679RC0001",
        be_tax_id: "1685868RT001",
        be_bank_info: "TD Bank",
        be_payment_term: 7,

        be_currency: "USD",
        be_inv_template_id: "t1",
        be_description: "This is a note for the bissiness.",
        be_note: "This is a note for the bissiness.",

        be_timezone: "America/New_York",
        be_date_format: "MM/DD/YYYY",

        be_inv_prefix: "INV-",
        be_inv_integer: 2501,
        be_inv_integer_max: 2501,
        be_show_paid_stamp: true, // Show "Paid" stamp on invoices by default
        
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
            tax_type: "federal",
            tax_note: "Canada Harmonized Sales Tax",

            ...baseFlags,
        },
        {
            tax_id: "tax_gst",
            tax_name: "GST",
            tax_rate: 0.05,
            tax_type: "federal",
            tax_note: "Canada Goods & Services Tax",
            ...baseFlags,
        },
        {
            tax_id: "tax_pst",
            tax_name: "PST",
            tax_rate: 0.07,
            tax_type: "provincial",
            tax_note: "Provincial Sales Tax (e.g. BC)",
            ...baseFlags,
        },
        {
            tax_id: "tax_qst",
            tax_name: "QST",
            tax_rate: 0.09975,
            tax_type: "provincial",
            tax_note: "Quebec Sales Tax",
            ...baseFlags,
        },

        // United States
        {
            tax_id: "tax_sst",
            tax_name: "SST",
            tax_rate: 0.06,
            tax_type: "state",
            tax_note: "State Sales Tax (e.g. FL, KY, PA)",
            ...baseFlags,
        },
        {
            tax_id: "tax_ct",
            tax_name: "CT",
            tax_rate: 0.01,
            tax_type: "county",
            tax_note: "County Tax (e.g. LA County, CA)",
            ...baseFlags,
        },
        {
            tax_id: "tax_lst",
            tax_name: "LST",
            tax_rate: 0.02,
            tax_type: "local",
            tax_note: "Local/City Tax (e.g. NYC, Chicago)",
            ...baseFlags,
        },
        {
            tax_id: "tax_dst",
            tax_name: "DST",
            tax_rate: 0.005,
            tax_type: "district",
            tax_note: "District Tax (e.g. LA Transit)",
            ...baseFlags,
        },
    ],


    clients: [
        {
            client_id: "Client_TBD",
            client_company_name: "Client_TBD",
            client_contact_name: "Client_TBD",
            client_contact_title: "Client_TBD",
            client_business_number: "Client_TBD",
            client_tax_id: "Client_TBD",
            client_address: "Client_TBD",
            client_email: "TBD@example.com",
            client_mainphone: "555-567-8901",
            client_secondphone: "Client_TBD",
            client_fax: "Client_TBD",
            client_website: "Client_TBD",
            client_currency: "OTHER",
            client_template_id: "t1",

            client_status: "active",
            client_note: "Requires itemized invoices",

            client_payment_method: "Bank Transfer",
            client_payment_term: 15,
            client_terms_conditions: "Payment due in 7 days.",
            ...baseFlags,
            is_deleted: 2, //hidden
        },

        {
            client_id: "Demo Client 1",
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
            client_id: "Demo Client 2",
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
            client_id: "Demo Client 3",
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
    ],


    // Payment methods seed data
    items: [
        {
            item_id: "Item_TBD",
            item_number: 'Item_TBD',
            item_name: "🚧Item_TBD",
            item_rate: 1.00,
            item_unit: 'Item_TBD',
            item_sku: "Item_TBD",
            item_description: "Item_TBD",

            item_quantity: 1,  // for InvItem only
            item_note: "For InvItem Only",      // for InvItem only
            item_amount: 1,    // for InvItem only

            ...baseFlags,
            is_deleted: 2, //TBD Item
        },
        {
            item_id: "T000",
            item_number: 'P002',
            item_name: "Adjustment",
            item_rate: 1.00,
            item_unit: "item",
            item_sku: "SKU 4225-776-3234",
            item_description: "additional charges or credits",

            item_quantity: 1,  // for InvItem only
            item_note: "For InvItem Only",      // for InvItem only
            item_amount: 2,    // for InvItem only
            ...baseFlags,
        },
        {
            item_id: "T120",
            item_number: 'P003',
            item_name: "Product ",
            item_rate: 1500.00,
            item_unit: "project",
            item_sku: "6IN-RD-CM-CO",
            item_description: "Tangible goods or materials delivered",

            item_quantity: 1,  // for InvItem only
            item_note: "For InvItem Only",      // for InvItem only
            item_amount: 1500,    // for InvItem only
            ...baseFlags,
        },
        {
            item_id: "T130",
            item_number: 'P0031',
            item_name: "Consulting Session",
            item_rate: 100.00,
            item_unit: "hour",
            item_sku: "SH123-BLK-8",
            item_description: "Business strategy session (1hr)",

            item_quantity: 1,  // for InvItem only
            item_note: "For InvItem Only",      // for InvItem only
            item_amount: 120,    // for InvItem only
            ...baseFlags,
        },
    ],


    invs: [
        {
            inv_id: "i_1001",
            user_id: 1,
            be_id: 1,
            client_id: "Demo Client 3",

            inv_number: "INV-1001",
            inv_date: new Date(),
            inv_due_date: new Date(),

            inv_title: "Invoice for Demo Client 1",
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
                },
                {
                    item_id: "T131",
                    item_number: "T131",
                    item_name: "AI Service",
                    item_description: "AI-driven business strategy session (1hr)",
                    item_sku: "SH123-BLK-9",
                    item_rate: 1110.00,
                    item_unit: "hour",
                    item_note: "notes",
                    item_quantity: 2,
                    item_amount: 2220.00,
                },
            ],
            inv_payments: [],
            ...baseFlags,
        },
        {
            inv_id: "i_1002",
            user_id: 1,
            be_id: 1,
            client_id: "Demo Client 2",

            inv_number: "INV-1002",
            inv_title: "Invoice for Demo Client 2",
            inv_date: new Date(),
            inv_due_date: new Date(),
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
                },
            ],
            inv_payments: [
                {
                    pm_id: "pm_1001",
                    pm_name: "Bank Transfer",
                    pm_note: "Payment for invoice INV-1002",

                    pay_date: new Date(),
                    pay_amount: 1695.00,
                    pay_reference: "TRX001",
                    pay_note: "Paid in full",
                },
            ],
            ...baseFlags,
        },
        {
            inv_id: "i_1003",
            user_id: 1,
            be_id: 1,
            client_id: "Demo Client 1",


            inv_number: "INV-1003",
            inv_title: "Invoice for Client 3",
            inv_date: new Date(),
            inv_due_date: new Date(),
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
                },
            ],

            inv_payments: [
                {

                    pm_id: "pm_1002",
                    pm_name: "Bank Transfer",
                    pm_note: "Payment for invoice INV-1002",

                    pay_date: new Date(),
                    pay_amount: 1.00,
                    pay_reference: "TRX002",
                    pay_note: "First half",
                },
            ],
            ...baseFlags,
        },

    ],

};