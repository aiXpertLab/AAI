import { InvDB, ClientDB, ItemDB, BE_DB } from '@/src/types';
import { NavigatorScreenParams } from '@react-navigation/native';
import type { DetailStackParamList } from './DetailStackParamList';  // we'll define this next


export type RootStackParamList = {
    Home: undefined;
    MainDrawer: undefined;
    Inv_New: undefined;
    Inv_Pay: undefined;
    Inv1Me_BizForm: undefined;
    Inv4Total_TaxForm: undefined;
    Drawer_Settings: undefined;

    Client_Form: undefined;
    Item_Form: undefined;
    SeedBizScreen: undefined;

    DetailStack: NavigatorScreenParams<DetailStackParamList>;

    AddItem: undefined;
    ItemForm: { item?: ItemDB; selectedItem?: ItemDB } | undefined;
    BizForm: {
        onSave?: (biz: BE_DB) => void;
    };
    TaxForm: undefined;
    InvoiceForm: { invoice?: InvDB; selectedClient?: ClientDB } | undefined;
    ClientPicker: undefined;
    AddClient: undefined;
};
