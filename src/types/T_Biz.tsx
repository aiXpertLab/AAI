export interface BE_DB {
    user_id: string;

    be_id: string;
    be_logo: string;
    be_name: string;
    be_address: string;
    be_email: string;
    be_phone: string;
    be_website: string;
    be_type: string;

    be_biz_number: string;
    be_tax_id: string;
    be_bank_info: string;
    be_payment_term: number;

    be_currency: string;
    be_inv_template_id: string;
    be_description: string;
    be_note: string;

    be_timezone: string;
    be_date_format: string;
    be_inv_prefix: string;
    be_inv_integer: number,  // current inv_number, when fetch, add 1 to be new
    be_inv_integer_max: number,  // current inv_number, when fetch, add 1 to be new

    status: string;
    is_active: number;
    is_locked: number;
    is_deleted: number;
    created_at?: Date;
    updated_at?: Date;

}


export interface TaxDB {
    tax_id: string;
    tax_name: string;
    tax_rate: number;
    tax_type?: string;
    tax_note?: string;

    is_deleted?: number;
}

export interface BizWithTaxes extends BE_DB {
    taxes: TaxDB[];
}


export interface TaxPickerModalProps {
    visible: boolean;
    taxRows: TaxDB[];                       // rows already fetched
    onClose: () => void;
    onSelectTax: (taxes: TaxDB[]) => void;
}

