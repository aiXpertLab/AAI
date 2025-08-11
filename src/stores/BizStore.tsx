import { create } from 'zustand';
import { InvDB, ItemDB, ClientDB, BE_DB, PMDB, TaxDB } from '@/src/types';

// Store for business info (oBiz)
type OBizStore = {
    oBiz: BE_DB | null;
    setOBiz: (biz: BE_DB | null) => void;
    updateOBiz: (biz: Partial<BE_DB>) => void;
    clearOBiz: () => void;
};

export const useBizStore = create<OBizStore>((set) => ({
    oBiz: null,
    setOBiz: (Biz) => {
        set({ oBiz: Biz });
    },
    updateOBiz: (Biz) => {
        set((state) => ({ oBiz: { ...state.oBiz!, ...Biz } }));
    },
    clearOBiz: () => { set({ oBiz: null }); },

}));


