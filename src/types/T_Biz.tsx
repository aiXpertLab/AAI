export interface BE_DB {
    be_id?: string;
    be_name: string;
    be_address: string;
    be_tax_id: string;
    be_biz_number: string;
    be_bank_info: string;
    be_email: string;
    be_phone: string;
    be_website: string;
    be_currency: string;
    be_description: string;
    be_note: string;
    be_logo: string;
    be_inv_template_id: string;
}


export interface BizDB {
    id?: number;
    me: string;
    biz_name: string;
    biz_address: string;
    biz_tax_id: string;
    biz_biz_number: string;
    biz_bank_info: string;
    biz_email: string;
    biz_phone: string;
    biz_website: string;
    biz_currency: string;
    biz_description: string;
    biz_note: string;
    biz_logo: string;
    biz_logo64: string;
    biz_64_square: string;
    biz_inv_template_id: string;
}

export interface TaxDB {
    id: number;
    user_id: number;
    biz_id: number;

    tax_name: string;
    tax_rate: number;
    tax_number: string;
    tax_type: string;
    tax_note: string;
    tax_status: string;
    is_deleted: number;
    is_locked: number;

}

export interface BizWithTaxes extends BizDB {
    taxes: TaxDB[];
}


export interface TaxPickerModalProps {
    visible: boolean;
    taxRows: TaxDB[];                       // rows already fetched
    onClose: () => void;
    onSelectTax: (row: TaxDB) => void;    // returns whole row
}


export interface PMDB {
    pm_id: string;

    pm_name: string;
    pm_note: string;
    is_deleted: number;
    is_locked: number;

    created_at: any; // serverTimestamp()
    updated_at: any; // serverTimestamp()
}

