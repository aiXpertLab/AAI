// AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors } from "@/src/constants";
import Drawer_Settings from "@/src/screens/settings/SettingScreen";

import Tab2_Client_Form from '@/src/screens/Tab2_Client_Form';
import Tab3_Item_Form from '@/src/screens/Tab3_Item_Form';
import Tab2_Client from '@/src/screens/Tab2_Client';
import Tab3_Item from '@/src/screens/Tab3_Item';

import { Inv_Form_New } from "@/src/screens/invoice/Inv_New";
import { Inv_Form } from "@/src/screens/invoice/Inv_Pay_Edit";
import SignScreen from "@/src/screens/user/SignScreen";
import { Inv_Pay, Inv4Total_TaxForm } from "@/src/screens/invoice";
import { BizInfo, Tax_List, Tax_Form,} from "@/src/screens/settings";
import {  Biz_Logo, PaymentMethod_Form, PaymentMethod_List } from "@/src/screens/biz";
import SeedBizScreen from '@/seed/SeedBizScreen';


import { SupportHub, RestoreScreen } from "@/src/screens/drawer";
import TestScreen from '@/src/screens/drawer/TestScreen';

const DetailStack = createNativeStackNavigator();
// const navigationRef = useNavigationContainerRef();

function StackNavigator() {
    return (
        <DetailStack.Navigator
            screenOptions={{
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
                headerStyle: { backgroundColor: colors.main },
            }}>
            <DetailStack.Screen name="Sign" component={SignScreen} options={{ title: 'Sign In / Sign Up' }} />
            <DetailStack.Screen name="Inv4Total_TaxForm" component={Inv4Total_TaxForm} options={{ title: 'New Tax' }} />
            <DetailStack.Screen name="Drawer_Settings" component={Drawer_Settings} options={{ title: 'Settings' }} />
            <DetailStack.Screen name="Inv_Pay" component={Inv_Pay} options={{ title: 'Invoice Payment', }} />
            <DetailStack.Screen name="Inv_Form" component={Inv_Form} options={{ title: 'Invoice' }} />
            <DetailStack.Screen name="Inv_Form_New" component={Inv_Form_New} options={{ title: 'New Invoice' }} />
            <DetailStack.Screen name="BizInfo" component={BizInfo} options={{ title: 'My Business' }} />
            <DetailStack.Screen name="Tab2_Client" component={Tab2_Client} options={{ title: 'My Client' }} />
            <DetailStack.Screen name="Tab2_Client_Form" component={Tab2_Client_Form} options={{ title: 'My Client' }} />
            <DetailStack.Screen name="Tab3_Item" component={Tab3_Item} options={{ title: 'Item or Service' }} />
            <DetailStack.Screen name="Tab3_Item_Form" component={Tab3_Item_Form} options={{ title: 'Edit Item or Service' }} />
            <DetailStack.Screen name="Tax_List" component={Tax_List} options={{ title: 'Tax' }} />
            <DetailStack.Screen name="Tax_Form" component={Tax_Form} options={{ title: 'Tax' }} />
            <DetailStack.Screen name="PaymentMethod_List" component={PaymentMethod_List} options={{ title: 'Payment Method' }} />
            <DetailStack.Screen name="PaymentMethod_Form" component={PaymentMethod_Form} options={{ title: 'Payment Method' }} />
            <DetailStack.Screen name="RestoreScreen" component={RestoreScreen} options={{ title: 'Restore' }} />
            <DetailStack.Screen name="SupportHub" component={SupportHub} options={{ title: 'Support Hub' }} />
            <DetailStack.Screen name="TestScreen" component={TestScreen} options={{ title: 'Test Screen' }} />
            <DetailStack.Screen name="Biz_Logo" component={Biz_Logo} options={{ title: 'Logo' }} />
            <DetailStack.Screen name="SeedBizScreen" component={SeedBizScreen} options={{ title: 'Seed Business Data' }} /> 
        </DetailStack.Navigator>
    );
}

export default StackNavigator;