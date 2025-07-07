export interface Payment{
    id: number;
    inv_id: number;
    payment_date: string;
    amount: number;
    method: string;
    reference?: string;
    note?: string;
}
