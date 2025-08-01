import { create } from 'zustand';
import { InvDB, InvItemDB, BE_DB ,PMDB, TaxDB} from '@/src/types';
import {createEmptyPM4New, createEmptyTax4New } from './seeds4store';

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


