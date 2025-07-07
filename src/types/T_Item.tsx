export interface ItemDB {
    id: number;
    user_id: number;
    biz_id: number;
    client_id: number;

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

}

