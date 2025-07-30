import { serverTimestamp } from "firebase/firestore";

// Master seed data for new business entities
export const seedData = {
    // Business entity template
    businessEntity: {
        business_name: "My Business",
        business_type: "sole_proprietorship",
        currency: "USD",
        timezone: "America/New_York",
        date_format: "MM/DD/YYYY",
        invoice_prefix: "INV",
        next_invoice_number: 1001,
        status: "active",
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
    },

    // Payment methods seed data
    paymentMethods: [
        {
            pm_name: "Credit Card",
            pm_note: "Processed via Stripe, Square, or other payment processors.",
            is_default: true,
            is_locked: 0,
            is_deleted: 0,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        },
        {
            pm_name: "Check",
            pm_note: "Make payable to My Business Name.",
            is_default: false,
            is_locked: 0,
            is_deleted: 0,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        },
        {
            pm_name: "Cash",
            pm_note: "Accepted for local transactions only.",
            is_default: false,
            is_locked: 0,
            is_deleted: 0,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        },
        {
            pm_name: "Bank Transfer (ACH)",
            pm_note: "Routing and account number required.",
            is_default: false,
            is_locked: 0,
            is_deleted: 0,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        },
        {
            pm_name: "PayPal",
            pm_note: "Send payments to your PayPal account.",
            is_default: false,
            is_locked: 0,
            is_deleted: 0,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        },
    ],

    // Demo clients
    clients: [
        {
            client_name: "Acme Corporation",
            client_email: "contact@acme.com",
            client_phone: "+1-555-0123",
            client_address: "123 Business Ave, New York, NY 10001",
            client_notes: "Regular client - pays on time",
            is_deleted: 0,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        },
        {
            client_name: "XYZ Industries",
            client_email: "billing@xyz.com",
            client_phone: "+1-555-0456",
            client_address: "456 Corporate Blvd, Los Angeles, CA 90210",
            client_notes: "New client - requires detailed invoices",
            is_deleted: 0,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        },
    ],

    // Demo items/services
    items: [
        {
            item_name: "Web Design Services",
            item_description: "Professional website design and development",
            item_rate: 1500.00,
            item_category: "Services",
            is_deleted: 0,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        },
        {
            item_name: "Consulting Hour",
            item_description: "Professional consulting services",
            item_rate: 150.00,
            item_category: "Services",
            is_deleted: 0,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        },
        {
            item_name: "Software License",
            item_description: "Annual software license fee",
            item_rate: 299.00,
            item_category: "Products",
            is_deleted: 0,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        },
    ],

    // Demo invoices
    invoices: [
        {
            inv_number: "INV-1001",
            inv_date: new Date("2024-01-15"),
            inv_due_date: new Date("2024-02-15"),
            client_id: "client1", // Will be replaced with actual client ID
            inv_subtotal: 1500.00,
            inv_tax_rate: 0.08,
            inv_tax_amount: 120.00,
            inv_total: 1620.00,
            inv_status: "paid",
            inv_notes: "Thank you for your business!",
            is_deleted: 0,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        },
    ],

    // Demo invoice items
    invoiceItems: [
        {
            inv_id: "inv1", // Will be replaced with actual invoice ID
            item_id: "item1", // Will be replaced with actual item ID
            item_quantity: 1,
            item_rate: 1500.00,
            item_amount: 1500.00,
            item_description: "Web Design Services",
            created_at: serverTimestamp(),
        },
    ],

    // Tax rates
    taxRates: [
        {
            tax_name: "Standard Tax",
            tax_rate: 0.08,
            tax_description: "Standard sales tax rate",
            is_default: true,
            is_deleted: 0,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        },
        {
            tax_name: "No Tax",
            tax_rate: 0.00,
            tax_description: "Tax exempt transactions",
            is_default: false,
            is_deleted: 0,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        },
    ],
};