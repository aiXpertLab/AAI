import { create } from 'zustand';
import { InvDB, ItemDB, ClientDB, BE_DB, PMDB, TaxDB } from '@/src/types';
import { createEmptyClient4New, emptyPM, createEmptyTax4New, emptyInv } from './seeds4store';

type ClientStore = {
    oClient: ClientDB | null;
    setOClient: (client: ClientDB | null) => void;
    updateOClient: (client: Partial<ClientDB>) => void;
    createEmptyClient4New: () => void;
    clearOClient: () => void;
};



export const useClientStore = create<ClientStore>((set) => ({
    oClient: null,
    setOClient: (client) => set({ oClient: client }),
    updateOClient: (client) => set((state) => ({ oClient: { ...state.oClient!, ...client } })),
    clearOClient: () => set({ oClient: null }),
    createEmptyClient4New: () => set({ oClient: createEmptyClient4New() })
}));


