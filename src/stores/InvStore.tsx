import { create } from 'zustand';
import { InvDB, ItemDB, ClientDB, BE_DB, PMDB, TaxDB } from '@/src/types';
import { createEmptyClient4New, createEmptyPM4New, createEmptyTax4New, emptyInv } from './seeds4store';

type OInvStore = {
    invs: InvDB[];
    oInv: InvDB | null;
    setOInv: (inv: InvDB) => void;
    updateOInv: (inv: Partial<InvDB>) => void;
    clearOInv: () => void;

    isDirty: boolean;
    setIsDirty: (flag: boolean) => void;

    createEmptyInv: () => void;

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

    createEmptyInv: () => set({ oInv: emptyInv(), isDirty: true }),

    updateOInvPayments: (payments) =>
        set((state) => ({
            oInv: state.oInv ? { ...state.oInv, inv_payments: payments, updated_at: new Date() } : null,
        })),
    addPaymentToOInv: (payment) =>
        set((state) => {
            if (!state.oInv) return {};
            return {
                oInv: {
                    ...state.oInv,
                    inv_payments: [...state.oInv.inv_payments, payment],
                    updated_at: new Date(),
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



type ClientStore = {
    oClient: Partial<ClientDB> | null;
    setOClient: (client: Partial<ClientDB> | null) => void;
    updateOClient: (client: Partial<ClientDB>) => void;
    createEmptyClient4New: () => void;
    clearOClient: () => void;
};



export const useClientStore = create<ClientStore>((set) => ({
    oClient: null,
    // setOClient: (client: ClientDB | null) => set({ oClient: client }),
    setOClient: (client) => set({ oClient: client }),
    updateOClient: (client) => set((state) => ({ oClient: { ...state.oClient!, ...client } })),
    clearOClient: () => set({ oClient: null }),

    createEmptyClient4New: () => set({ oClient: createEmptyClient4New() })

}));


