export interface ItemDB {
    item_id: string;
    user_id: string;
    biz_id: string;
    client_id: string;

    item_number: string;
    item_name: string;
    item_description: string;
    item_sku: string;
    item_rate: number;
    item_unit: string;
    item_quantity: number;
    item_note: string;

    item_status: string;
    is_deleted: number;

    created_at: any; // serverTimestamp()
    updated_at: any; // serverTimestamp()
}

