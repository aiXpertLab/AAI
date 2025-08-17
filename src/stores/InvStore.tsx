import { create } from 'zustand';
import { InvDB, PMDB, TaxDB } from '@/src/types';
import { emptyPM, createEmptyTax4New, emptyInv } from './seeds4store';

type OInvStore = {
    invs: InvDB[];
    oInv: InvDB | null;
    setOInv: (inv: InvDB) => void;
    updateOInv: (inv: Partial<InvDB>) => void;
    clearOInv: () => void;

    isDirty: boolean;
    setIsDirty: (flag: boolean) => void;

    createEmptyInv: (invPrefix:string, invInteger:number)  => void;

    updateOInvPayments: (payments: PMDB[]) => void;
    addPaymentToOInv: (payment: PMDB) => void;
};

export const useInvStore = create<OInvStore>((set) => ({
    invs: [],
    oInv: null,
    setOInv: (inv) => set({ oInv: { ...inv } }),
    updateOInv: (inv) => set((state) => state.oInv ? { oInv: { ...state.oInv, ...inv } } : {}),

    clearOInv: () => set({ oInv: null }),
    isDirty: false,
    setIsDirty: (flag) => set({ isDirty: flag }),

    createEmptyInv: (invPrefix:string, invInteger:number) => set({ oInv: emptyInv(invPrefix, invInteger), isDirty: true }),

    updateOInvPayments: (payments) =>
        set((state) => ({
            oInv: state.oInv ? {
                ...state.oInv,
                inv_payments: payments, 
            } : null,
        })),
    addPaymentToOInv: (payment) =>
        set((state) => {
            if (!state.oInv) return {};
            return {
                oInv: {
                    ...state.oInv,
                    inv_payments: [...state.oInv.inv_payments, payment],
                },
            };
        }),
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



type OPMStore = {
    oPM: PMDB | null;
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
    createEmptyPM4New: () => set({ oPM: emptyPM() })
}));


