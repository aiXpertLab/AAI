import { InvDB, ClientDB, ItemDB, BE_DB } from './index';
import { NavigatorScreenParams } from '@react-navigation/native';
import { useRoute, RouteProp } from '@react-navigation/native';

type ModeType = 'create_new' | 'modify_existed' | 'restore_deleted' | 'restore_archived';

export type DetailStack = {
    Inv_New: undefined;
    Inv1Me_BizForm: undefined;
    Inv4Total_TaxForm: undefined;
    BizInfo: undefined;
    InvPay: undefined;
    InvPay_Edit: undefined;
    InvPay_Edit_Client: undefined;
    
    Tax_List: undefined;
    Tax_Form: { mode?: ModeType };

    Client_List: undefined;
    Client_Form: { mode?: ModeType };

    Item_List: undefined;
    Item_Form: { mode?: ModeType };

    PaymentMethod_List: undefined;
    PaymentMethod_Form: { mode?: ModeType };

    SeedBizScreen: undefined;
    TestScreen: undefined;

    Restore: { mode?: 'restore_deleted' | 'restore_archived' };
    CreateModify: { mode?: 'create_new' | 'modify_existed' };

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

export type RouteType<Screen extends keyof DetailStack> = RouteProp<DetailStack, Screen>;