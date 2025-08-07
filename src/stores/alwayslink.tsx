import { create } from 'zustand';
import { InvDB, InvItemDB, ClientDB, BE_DB, PMDB, TaxDB, ItemDB } from '@/src/types';

interface InvoiceStore {
    // --- Source data ---
    oBiz: Partial<BE_DB> | null;
    oClient: Partial<ClientDB> | null;
    oItemCatalog: Partial<ItemDB>[];
    oPaymentMethods: Partial<PMDB>[];
    oTax: Partial<TaxDB> | null;

    // --- Current invoice (linked in memory) ---
    oInv: Partial<InvDB> & {
        oInv!.inv_items: Partial<InvItemDB>[];
        payments: Partial<PMDB>[];
        oTax: Partial<TaxDB> | null;
        oBiz: Partial<BE_DB> | null;
        oClient: Partial<ClientDB> | null;
    };

    // --- Actions ---
    updateBiz: (updates: Partial<BE_DB>) => void;
    updateClient: (updates: Partial<ClientDB>) => void;
    updateItemCatalog: (items: Partial<ItemDB>[]) => void;
    updatePaymentMethods: (methods: Partial<PMDB>[]) => void;
    updateTax: (updates: Partial<TaxDB>) => void;

    updateInv: (inv: Partial<InvDB>) => void;

    updateInvItem: (id: number, updates: Partial<InvItemDB>) => void;
    addInvItem: (item: Partial<InvItemDB>) => void;
    removeInvItem: (id: number) => void;

    updatePayment: (id: string, updates: Partial<PMDB>) => void;
    addPayment: (payment: Partial<PMDB>) => void;
    removePayment: (id: string) => void;

    resetInvoice: () => void;
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
    // --- Initial state ---
    oBiz: null,
    oClient: null,
    oItemCatalog: [],
    oPaymentMethods: [],
    oTax: null,

    oInv: {
        oInv!.inv_items: [],
        payments: [],
        oTax: null,
        oBiz: null,
        oClient: null,
    },

    // --- Actions ---
    updateBiz: (updates) =>
        set((state) => {
            const newBiz = { ...state.oBiz, ...updates };
            return {
                oBiz: newBiz,
                oInv: { ...state.oInv, oBiz: newBiz }
            };
        }),

    updateClient: (updates) =>
        set((state) => {
            const newClient = { ...state.oClient, ...updates };
            return {
                oClient: newClient,
                oInv: {
                    ...state.oInv,
                    oClient: newClient,
                    client_id: newClient.client_id || state.oInv.client_id || null,
                    client_name: newClient.client_name || state.oInv.client_name || null
                }
            };
        }),

    updateItemCatalog: (items) => {
        const updatedItems = get().oInv.oInv!.inv_items.map(invItem => {
            const src = items.find(i => i.item_id === invItem.item_id);
            return src ? { ...invItem, ...src } : invItem;
        });
        set({
            oItemCatalog: items,
            oInv: { ...get().oInv, oInv!.inv_items: updatedItems }
        });
    },

    updatePaymentMethods: (methods) => {
        const updatedPayments = get().oInv.payments.map(pay => {
            const src = methods.find(m => m.method_id === pay.method_id);
            return src ? { ...pay, ...src } : pay;
        });
        set({
            oPaymentMethods: methods,
            oInv: { ...get().oInv, payments: updatedPayments }
        });
    },

    updateTax: (updates) =>
        set((state) => {
            const newTax = { ...state.oTax, ...updates };
            return {
                oTax: newTax,
                oInv: { ...state.oInv, oTax: newTax }
            };
        }),

    updateInv: (inv) =>
        set((state) => ({ oInv: { ...state.oInv, ...inv } })),

    updateInvItem: (id, updates) =>
        set((state) => ({
            oInv: {
                ...state.oInv,
                oInv!.inv_items: state.oInv.oInv!.inv_items.map(item =>
                    item.id === id ? { ...item, ...updates } : item
                )
            }
        })),

    addInvItem: (item) =>
        set((state) => ({
            oInv: { ...state.oInv, oInv!.inv_items: [...state.oInv.oInv!.inv_items, item] }
        })),

    removeInvItem: (id) =>
        set((state) => ({
            oInv: {
                ...state.oInv,
                oInv!.inv_items: state.oInv.oInv!.inv_items.filter(item => item.id !== id)
            }
        })),

    updatePayment: (id, updates) =>
        set((state) => ({
            oInv: {
                ...state.oInv,
                payments: state.oInv.payments.map(p =>
                    p.method_id === id ? { ...p, ...updates } : p
                )
            }
        })),

    addPayment: (payment) =>
        set((state) => ({
            oInv: { ...state.oInv, payments: [...state.oInv.payments, payment] }
        })),

    removePayment: (id) =>
        set((state) => ({
            oInv: {
                ...state.oInv,
                payments: state.oInv.payments.filter(p => p.method_id !== id)
            }
        })),

    resetInvoice: () =>
        set({
            oBiz: null,
            oClient: null,
            oItemCatalog: [],
            oPaymentMethods: [],
            oTax: null,
            oInv: {
                oInv!.inv_items: [],
                payments: [],
                oTax: null,
                oBiz: null,
                oClient: null,
            }
        }),
}));
