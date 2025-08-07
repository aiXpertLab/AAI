import { create } from 'zustand';
import { InvDB, InvItemDB, BE_DB ,PMDB, TaxDB} from '@/src/types';
import {createEmptyPM4New, createEmptyTax4New } from './seeds4store';

type oInv!.inv_itemsStore = {
    oInv!.inv_items: Partial<InvItemDB>[];
    updateoInv!.inv_items: (id: number, updates: Partial<InvItemDB>) => void;
    removeoInv!.inv_items: (id: number) => void;
    clearoInv!.inv_items: () => void;
    setoInv!.inv_items: (items: Partial<InvItemDB>[]) => void;
};

export const useInvItemListStore = create<oInv!.inv_itemsStore>((set) => ({
    oInv!.inv_items: [],
        
    updateoInv!.inv_items: (id, updates) =>
        set((state) => ({
            oInv!.inv_items: state.oInv!.inv_items.map(item =>
                item.id === id ? { ...item, ...updates } : item
            ),
        })),
        
    clearoInv!.inv_items: () => set({ oInv!.inv_items: [] }),

    removeoInv!.inv_items: (id: number) => set(state => ({
        oInv!.inv_items: state.oInv!.inv_items.filter(item => item.id !== id)
      })),

    setoInv!.inv_items: (items) => set({ oInv!.inv_items: items }),  // ✅ NEW
}));


type OInvStore = {
    oInv: Partial<InvDB> | null;
    setOInv: (inv: Partial<InvDB>) => void;
    updateOInv: (inv: Partial<InvDB>) => void;
    clearOInv: () => void;
    isDirty: boolean; // 🧠 Zustand action
    setIsDirty: (flag: boolean) => void; // 🧠 Zustand action
};

export const useInvStore = create<OInvStore>((set) => ({
    oInv: null,
    setOInv: (inv) => set({ oInv: inv }),
    updateOInv: (inv) => set((state) => ({ oInv: { ...state.oInv!, ...inv } })),
    clearOInv: () => set({ oInv: null }),
    isDirty: false, // 🧠 Zustand async function 
    setIsDirty: (flag) => set({ isDirty: flag }), // 🧠 Zustand async function
}));


type OBizStore = {
    oBiz: BE_DB | null;
    setOBiz: (biz: BE_DB) => void;
    updateOBiz: (biz: Partial<BE_DB>) => void;
    clearOBiz: () => void;
};

export const useBizStore = create<OBizStore>((set) => ({
    oBiz: null,
    setOBiz: (Biz) => set({ oBiz: Biz }),
    updateOBiz: (Biz) => set((state) => ({ oBiz: { ...state.oBiz!, ...Biz } })),
    clearOBiz: () => set({ oBiz: null }),
}));


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
    createEmptyTax4New: () => set({ oTax: createEmptyTax4New() })
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
