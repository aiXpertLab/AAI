import { InvDB, ClientDB, ItemDB, BE_DB } from './index';
import { NavigatorScreenParams } from '@react-navigation/native';

export type DetailStack = {
    Inv_New: undefined;
    Inv_Pay: undefined;
    Inv_Pay_Edit: { mode: 'modify_existed' | 'create_new' };
    Inv1Me_BizForm: undefined;
    Inv4Total_TaxForm: undefined;
    BizInfo: undefined;
    Tax_List: undefined;
    Client_List: undefined;
    Item_List: undefined;
    PaymentMethod_List: undefined;
    SeedBizScreen: undefined;
    TestScreen: undefined;

};

export type RootStack = {
    Home: undefined;
    MainDrawer: undefined;
    Drawer_Settings: undefined;

    Client_Form: undefined;
    Item_Form: undefined;
    SeedBizScreen: undefined;

    DetailStack: NavigatorScreenParams<DetailStack>;

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
