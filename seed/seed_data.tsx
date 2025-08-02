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

};