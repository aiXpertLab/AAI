import { create } from 'zustand';
import { InvDB, InvItemDB, ClientDB, BE_DB, PMDB, TaxDB, ItemDB } from '@/src/types';
import { 
  createEmptyClient4New, 
  createEmptyPM4New, 
  createEmptyTax4New, 
  createEmptyItem4New 
} from './seeds4store';

interface InvoiceStore {
  // --- Link flags ---
  linkBizToInv: boolean;
  linkClientToInv: boolean;
  linkItemsToCatalog: boolean;
  linkPaymentsToMethods: boolean;

  // --- Source data ---
  oBiz: Partial<BE_DB> | null;
  oClient: Partial<ClientDB> | null;
  oItemCatalog: Partial<ItemDB>[];
  oPaymentMethods: Partial<PMDB>[];
  oTax: Partial<TaxDB> | null;

  // --- Current invoice ---
  oInv: Partial<InvDB> & {
    oInv!.inv_items: Partial<InvItemDB>[];
    payments: Partial<PMDB>[];
    oTax: Partial<TaxDB> | null;
    oBiz: Partial<BE_DB> | null;
    oClient: Partial<ClientDB> | null;
  };

  // --- Actions ---
  setBiz: (biz: Partial<BE_DB>) => void;
  setClient: (client: Partial<ClientDB>) => void;
  setItemCatalog: (items: Partial<ItemDB>[]) => void;
  setPaymentMethods: (methods: Partial<PMDB>[]) => void;
  setTax: (tax: Partial<TaxDB>) => void;

  setInv: (inv: Partial<InvDB>) => void;
  updateInv: (inv: Partial<InvDB>) => void;

  addInvItem: (item: Partial<InvItemDB>) => void;
  updateInvItem: (id: number, updates: Partial<InvItemDB>) => void;
  removeInvItem: (id: number) => void;

  addPayment: (payment: Partial<PMDB>) => void;
  updatePayment: (id: string, updates: Partial<PMDB>) => void;
  removePayment: (id: string) => void;

  resetInvoice: () => void;
  freezeInvoiceLinks: () => void;
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  // --- Initial state ---
  linkBizToInv: true,
  linkClientToInv: true,
  linkItemsToCatalog: true,
  linkPaymentsToMethods: true,

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
  setBiz: (biz) => {
    const { linkBizToInv, oInv } = get();
    set((state) => ({
      oBiz: biz,
      oInv: linkBizToInv
        ? { ...oInv, oBiz: biz }
        : oInv
    }));
  },

  setClient: (client) => {
    const { linkClientToInv, oInv } = get();
    set((state) => ({
      oClient: client,
      oInv: linkClientToInv
        ? { ...oInv, oClient: client, client_id: client.client_id || null, client_name: client.client_name || null }
        : oInv
    }));
  },

  setItemCatalog: (items) => {
    const { linkItemsToCatalog, oInv } = get();
    let updatedItems = oInv.oInv!.inv_items;
    if (linkItemsToCatalog) {
      updatedItems = updatedItems.map(invItem => {
        const src = items.find(i => i.item_id === invItem.item_id);
        return src ? { ...invItem, ...src } : invItem;
      });
    }
    set({
      oItemCatalog: items,
      oInv: { ...oInv, oInv!.inv_items: updatedItems }
    });
  },

  setPaymentMethods: (methods) => {
    const { linkPaymentsToMethods, oInv } = get();
    let updatedPayments = oInv.payments;
    if (linkPaymentsToMethods) {
      updatedPayments = updatedPayments.map(pay => {
        const src = methods.find(m => m.method_id === pay.method_id);
        return src ? { ...pay, ...src } : pay;
      });
    }
    set({
      oPaymentMethods: methods,
      oInv: { ...oInv, payments: updatedPayments }
    });
  },

  setTax: (tax) => {
    set((state) => ({
      oTax: tax,
      oInv: { ...state.oInv, oTax: tax }
    }));
  },

  setInv: (inv) => set((state) => ({ oInv: { ...state.oInv, ...inv } })),
  updateInv: (inv) => set((state) => ({ oInv: { ...state.oInv, ...inv } })),

  addInvItem: (item) => set((state) => ({
    oInv: { ...state.oInv, oInv!.inv_items: [...state.oInv.oInv!.inv_items, item] }
  })),
  updateInvItem: (id, updates) => set((state) => ({
    oInv: {
      ...state.oInv,
      oInv!.inv_items: state.oInv.oInv!.inv_items.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    }
  })),
  removeInvItem: (id) => set((state) => ({
    oInv: {
      ...state.oInv,
      oInv!.inv_items: state.oInv.oInv!.inv_items.filter(item => item.id !== id)
    }
  })),

  addPayment: (payment) => set((state) => ({
    oInv: { ...state.oInv, payments: [...state.oInv.payments, payment] }
  })),
  updatePayment: (id, updates) => set((state) => ({
    oInv: {
      ...state.oInv,
      payments: state.oInv.payments.map(p =>
        p.method_id === id ? { ...p, ...updates } : p
      )
    }
  })),
  removePayment: (id) => set((state) => ({
    oInv: {
      ...state.oInv,
      payments: state.oInv.payments.filter(p => p.method_id !== id)
    }
  })),

  resetInvoice: () => set({
    linkBizToInv: true,
    linkClientToInv: true,
    linkItemsToCatalog: true,
    linkPaymentsToMethods: true,
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

  freezeInvoiceLinks: () => set({
    linkBizToInv: false,
    linkClientToInv: false,
    linkItemsToCatalog: false,
    linkPaymentsToMethods: false
  }),
}));
