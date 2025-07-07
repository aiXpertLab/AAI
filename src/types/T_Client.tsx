export interface ClientDB {
    id: number;
    user_id: number;
    biz_id: number;

    client_number:string;
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

    client_tax_id: string;
    client_currency: string;
    client_terms_conditions: string;
    client_status: string;
    client_note: string;

    client_payment_term: number;
    client_payment_method: string;
    
    is_deleted: number;
    is_locked: number;
}
