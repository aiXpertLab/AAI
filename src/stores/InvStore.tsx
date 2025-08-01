import { create } from 'zustand';
import { InvDB, InvItemDB, BE_DB, PMDB, TaxDB } from '@/src/types';
import {createEmptyPM4New, createEmptyTax4New } from './seeds4store';

// Store for the list of invoice items
type OInvItemListStore = {
    oInvItemList: Partial<InvItemDB>[]; // List of items in the invoice
    updateOInvItemList: (id: number, updates: Partial<InvItemDB>) => void;
    removeOInvItemList: (id: number) => void;
    clearOInvItemList: () => void;
    setOInvItemList: (items: Partial<InvItemDB>[]) => void;
};

export const useInvItemListStore = create<OInvItemListStore>((set) => ({
    oInvItemList: [],
    updateOInvItemList: (id, updates) =>
        set((state) => ({
            oInvItemList: state.oInvItemList.map(item =>
                item.id === id ? { ...item, ...updates } : item
            ),
        })),
    clearOInvItemList: () => set({ oInvItemList: [] }),
    removeOInvItemList: (id: number) => set(state => ({
        oInvItemList: state.oInvItemList.filter(item => item.id !== id),
    })),
    setOInvItemList: (items) => set({ oInvItemList: items }),
}));



// Store for business info (oBiz)
type OBizStore = {
    oBiz: BE_DB | null;
    setOBiz: (biz: BE_DB | null) => void;
    updateOBiz: (biz: Partial<BE_DB>) => void;
    clearOBiz: () => void;
};

export const useBizStore = create<OBizStore>((set) => ({
    oBiz: null,
    setOBiz: (Biz) => set({ oBiz: Biz }),
    updateOBiz: (Biz) => set((state) => ({ oBiz: { ...state.oBiz!, ...Biz } })),
    clearOBiz: () => set({ oBiz: null }),
}));


// Store for tax info (oTax)
type OTaxStore = {
    oTax: Partial<TaxDB> | null;
    setOTax: (Tax: TaxDB) => void;
    updateOTax: (Tax: Partial<TaxDB>) => void;
    clearOTax: () => void;
    createEmptyTax4New: () => void;
};

export const useTaxStore = create<OTaxStore>((set) => ({
    oTax: null,
    setOTax: (Tax) => set({ oTax: Tax }),
    updateOTax: (Tax) => set((state) => ({ oTax: { ...state.oTax!, ...Tax } })),
    clearOTax: () => set({ oTax: null }),
    createEmptyTax4New: () => set({ oTax: createEmptyTax4New() }),
}));


// Store for invoice (oInv) that includes oInvItemList, oTax, oBiz
type OInvStore = {
    oInv: Partial<InvDB> & {
        oInvItemList: Partial<InvItemDB>[];
        oTax: Partial<TaxDB> | null;
        oBiz: Partial<BE_DB> | null;
    } | null;
    setOInv: (inv: Partial<InvDB>) => void;
    updateOInv: (inv: Partial<InvDB>) => void;
    clearOInv: () => void;
    isDirty: boolean; // 🧠 Zustand action
    setIsDirty: (flag: boolean) => void; // 🧠 Zustand action
};

export const useInvStore = create<OInvStore>((set) => ({
    oInv: null,
    setOInv: (inv) => set({ oInv: { ...inv, oInvItemList: [], oTax: null, oBiz: null } }), // Initialize with empty sub-states
    updateOInv: (inv) => set((state) => ({ oInv: { ...state.oInv!, ...inv } })),
    clearOInv: () => set({ oInv: null }),
    isDirty: false,
    setIsDirty: (flag) => set({ isDirty: flag }),
}));


type OPMStore = {
    oPM: Partial<PMDB> | null;
    setOPM: (PM: PMDB) => void;
    updateOPM: (PM: Partial<PMDB>) => void;
    clearOPM: () => void;
    createEmptyPM4New: () => void;
};

export const usePMStore = create<OPMStore>((set) => ({
    oPM: null,
    setOPM: (PM) => set({ oPM: PM }),
    updateOPM: (PM) => set((state) => ({ oPM: { ...state.oPM!, ...PM } })),
    clearOPM: () => set({ oPM: null }),
    createEmptyPM4New: () => set({ oPM: createEmptyPM4New() })
}));
