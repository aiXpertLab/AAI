import { create } from 'zustand';
import { ClientDB } from '@/src/types';
import { emptyClient } from './seeds4store';

type ClientStore = {
    oClient: ClientDB | null;
    setOClient: (client: ClientDB | null) => void;
    updateOClient: (client: Partial<ClientDB>) => void;
    clearOClient: () => void;
    createEmptyClient4New: () => void;
};



export const useClientStore = create<ClientStore>((set) => ({
    oClient: null,
    setOClient: (client) => set({ oClient: client }),
    updateOClient: (client) => set((state) => ({ oClient: { ...state.oClient!, ...client } })),
    clearOClient: () => set({ oClient: null }),
    createEmptyClient4New: () => set({ oClient: emptyClient() })
}));


