import { create } from 'zustand';
import { InvDB, InvItemDB, ClientDB, BE_DB, PMDB, TaxDB } from '@/src/types';
import { createEmptyClient4New, createEmptyPM4New, createEmptyTax4New } from './seeds4store';

// Store for the list of invoice items
type oInv!.inv_itemsStore = {
    oInv!.inv_items: Partial<InvItemDB>[]; // List of items in the invoice
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
        oInv!.inv_items: state.oInv!.inv_items.filter(item => item.id !== id),
    })),
    setoInv!.inv_items: (items) => set({ oInv!.inv_items: items }),
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
    clearOBiz: () => set({ oBiz: null }),

    updateOBiz: (biz) => {
        set((state) => {
            const newBiz = { ...state.oBiz!, ...biz };

            // Always link to oInv in memory
            useInvStore.setState((invState) => ({
                oInv: invState.oInv
                    ? { ...invState.oInv, oBiz: newBiz }
                    : { oInv!.inv_items: [], oTax: null, oBiz: newBiz, oClient: null }
            }));
            return { oBiz: newBiz };
        });
    },
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


// Store for invoice (oInv) that includes oInv!.inv_items, oTax, oBiz
type OInvStore = {
    oInv: Partial<InvDB> & {
        oInv!.inv_items: Partial<InvItemDB>[];
        oTax: Partial<TaxDB> | null;
        oBiz: Partial<BE_DB> | null;
        oClient: Partial<ClientDB> | null;
    } | null;
    setOInv: (inv: Partial<InvDB>) => void;
    updateOInv: (inv: Partial<InvDB>) => void;
    clearOInv: () => void;
    isDirty: boolean; // 🧠 Zustand action
    setIsDirty: (flag: boolean) => void; // 🧠 Zustand action
};

export const useInvStore = create<OInvStore>((set) => ({
    oInv: null,
    setOInv: (inv) => set({ oInv: { ...inv, oInv!.inv_items: [], oTax: null, oBiz: null, oClient: null } }), // Initialize with empty sub-states
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


