export interface ClientDB {
    client_id: string;
    user_id: string;
    be_id: string;

    client_number: string;
    client_company_name: string;
    client_contact_name: string;
    client_contact_title: string;
    client_address: string;
    client_email: string;
    client_secondphone: string;
    client_mainphone: string;
    client_fax: string;
    client_website: string; // Optional website URL

    client_business_number: string;

    client_currency: string;
    client_tax_id: string;
    client_payment_term: number;
    client_payment_method: string;

    client_terms_conditions: string;
    client_note: string;


    status: string;
    is_active: number;
    is_locked: number;
    is_deleted: number;
    created_at: Date;
    updated_at: Date;
}
