import { useRoute, RouteProp } from '@react-navigation/native';

export type RootStackPara = {
    MainDrawer: undefined;
    DetailStack: {
        screen: keyof DetailStackPara;
        params?: DetailStackPara[keyof DetailStackPara];
    };
};

export type DetailStackPara = {
    Inv_Pay: undefined;
    Inv_New: undefined;
    Inv_Form_New: undefined;
    Inv_Form: { mode?: 'create_new' | 'modify_existed' };
    Inv_Modify_Items: undefined;
    Inv1Me_BizForm: undefined;
    Inv4Total_TaxForm: undefined;
    Tab2_Client: undefined;
    SeedBizScreen: undefined;
    Tab3_Item: undefined;
    TestScreen: undefined;
    BizInfo: undefined;

    Restore: { mode?: 'restore_deleted' | 'restore_archived' };
    CreateModify: { mode?: 'create_new' | 'modify_existed' };

    Tab2_Client_Form: { mode?: 'create_new' | 'modify_existed' };
    Tab3_Item_Form: undefined;

    Tax_List: undefined;
    Tax_Form: undefined;

    PaymentMethod_List: undefined;
    PaymentMethod_Form: undefined;


    SupportHub: undefined;
    Biz_Logo: undefined;
};

export type RouteType<Screen extends keyof DetailStackPara> = RouteProp<DetailStackPara, Screen>;
