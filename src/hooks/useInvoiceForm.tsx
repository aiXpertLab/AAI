import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Toast from 'react-native-toast-message';

import { insertInvoice } from '@/src/db/crud_invoices';
import { ClientDB, ItemDB, InvDB, BizDB, TaxDB, defaultInvoiceUI } from "@/src/types";
import { SQLiteDatabase } from "expo-sqlite";

import { useInvStore } from '@/src/stores/useInvStore';

export function useInvoiceForm(db: SQLiteDatabase, navigation: any) {
    const saveRef = useRef(() => { });

    const [items, setItems] = useState<ItemDB[]>([]);
    const [selectedItems, setSelectedItems] = useState<ItemDB[]>([]);
    const [clients, setClients] = useState<ClientDB[]>([]);
    const [selectedClient, setSelectedClient] = useState<ClientDB | null>(null);

    const [modalType, setModalType] = useState<'item' | 'client' | 'discount' | 'tax' | 'home_filter' | null>(null);
    const [discount, setDiscount] = useState<{ value: number; type: 'percent' | 'flat' } | null>(null);

    const [biz, setBiz] = useState<BizDB | null>(null);
    const [logoUri, setLogoUri] = useState<string | null>(null);
    // const [oInv, setOInv] = useState<InvoiceUI>({ ...defaultInvoiceUI });
    const { oInv, setOInv, updateOInv } = useInvStore();

    const [taxRows, setTaxRows] = useState<TaxDB[]>([]);
    const [taxRate, setTaxRate] = useState<number>(0);
    const [taxName, setTaxName] = useState<string | null>(null);
    const [oTax, setOTax] = useState<TaxDB | null>(null);

    const handleSelectTax = (row: TaxDB) => {
        console.log("Selected Tax:", row);
        setTaxRate(Number(row.tax_rate));
        // setTaxName(row.tax_name);
        setOTax({
            tax_name: row.tax_name,
            tax_rate: row.tax_rate, // Convert string to number
        });
        setModalType(null);
    };


    const discountAmount = useMemo(() => {
        if (!discount) return 0;
        return discount.type === 'percent'
            ? (subtotal * discount.value) / 100
            : discount.value;
    }, [discount, subtotal]);

    // const tax = 0; // Replace if you have logic
    const total = subtotal - discountAmount + taxRate;



    const fetchTaxes = async () => {
        try {
            const resultTax = await db.getAllAsync<TaxDB>("SELECT * FROM Tax where tax_status != 'deleted' ORDER BY id DESC");
            console.log("Fetched Taxes:", resultTax);
            setTaxRows(resultTax);
        } catch (err) {
            console.error("Failed to load Taxes:", err);
        }
    };



    const handleSave = async () => {
        try {
            const updatedInv = {
                ...oInv,
                inv_total: total, inv_subtotal: subtotal,
            };

            const invId = await insertInvoice(db, updatedInv); // 🆕 Get inserted invoice ID

            for (const item of selectedItems) {
                const quantity = item.quantity ?? 1;
                const rate = Number(item.item_rate ?? 0);
                const amount = quantity * rate;

                await db.runAsync(
                    `INSERT INTO inv_items (
                inv_id, 
                item_id, item_name, 
                item_quantity, item_rate, item_amount
              ) VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        invId,
                        item.id, item.item_name,
                        quantity, rate, amount
                    ]
                );
            }

            navigation.goBack();
            Toast.show({ type: 'success', text1: 'Invoice Saved!' });
        } catch (err) {
            console.error("Error saving invoice:", err);
            alert("Failed to save invoice.");
        }
    };

    const handleSelectClient = (client: ClientDB) => {
        setSelectedClient(client);
        setModalType(null);
        updateOInv({
            client_company_name: client.client_company_name,
            client_contact_name: client.client_contact_name,
            client_address: client.client_address,
            client_currency: client.client_currency,
            client_email: client.contact_email,
            client_cellphone: client.contact_cellphone,
        });
    };
    

    const handleSelectItem = (item: ItemDB) => {
        const existingIndex = selectedItems.findIndex(i => i.id === item.id);
        if (existingIndex !== -1) {
            const updatedItems = [...selectedItems];
            updatedItems[existingIndex].quantity = (updatedItems[existingIndex].quantity ?? 1) + 1;
            setSelectedItems(updatedItems);
        } else {
            setSelectedItems(prev => [...prev, { ...item, quantity: 1 }]);
        }
        setModalType(null);
    };

    saveRef.current = handleSave;

    return {
        biz,
        setBiz,
        logoUri,
        clients,
        selectedClient,
        handleSelectClient,
        items,
        fetchItems,
        selectedItems,
        handleSelectItem,
        modalType,
        setModalType,
        discount,
        setDiscount,
        taxRows,
        fetchTaxes,
        handleSelectTax,
        subtotal,
        discountAmount,
        oTax,
        total,
        setLogoUri,
        saveRef,
    };
}
