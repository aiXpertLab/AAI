import { InvDB, ClientDB, ItemDB, BizDB } from '@/src/types';
import { NavigatorScreenParams } from '@react-navigation/native';
import type { DetailStackParamList } from './DetailStackParamList';  // we'll define this next


export type RootStackParamList = {
    Home: undefined;
    Inv_New: undefined;
    Inv_Pay: undefined;
    Inv1Me_BizForm: undefined;
    Inv4Total_TaxForm: undefined;
    Tab2_Client_Form: undefined;
    Tab3_Item_Form: undefined;
    Drawer_Settings: undefined;
    DetailStack: NavigatorScreenParams<DetailStackParamList>;  

    AddItem: undefined;
    ItemForm: { item?: ItemDB; selectedItem?: ItemDB } | undefined;
    BizForm: {
        onSave?: (biz: BizDB) => void;
    };
    TaxForm: undefined;
    InvoiceForm: { invoice?: InvDB; selectedClient?: ClientDB } | undefined;
    ClientPicker: undefined;
    AddClient: undefined;
};
