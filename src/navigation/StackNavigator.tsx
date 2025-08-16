// AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors } from "@/src/constants";
import Drawer_Settings from "@/src/screens/settings/SettingScreen";

import Client_Form from '@/src/screens/settings/Client_Form';
import Client_List from '@/src/screens/settings/Client_List';
import Item_Form from '@/src/screens/settings/Item_Form';
import Item_List from '@/src/screens/settings/Item_List';

import { InvNew } from "@/src/screens/inv_new/InvNew";
import { InvPay } from "@/src/screens/inv_pay/InvPay";
import { InvPay_Edit } from "@/src/screens/inv_pay/InvPay_Edit";
import SignScreen from "@/src/screens/user/SignScreen";
import { InvPay_Edit_Client, Inv4Total_TaxForm } from "@/src/screens/invoice";
import { BizInfo, Tax_List, Tax_Form,} from "@/src/screens/settings";
import {  Biz_Logo, PaymentMethod_Form, PaymentMethod_List } from "@/src/screens/biz";
import SeedScreen from '@/seed/SeedScreen';

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
            <DetailStack.Screen name="InvPay" component={InvPay} options={{ title: 'Invoice Payment', }} />
            <DetailStack.Screen name="InvPay_Edit" component={InvPay_Edit} options={{ title: 'Invoice' }} />
            <DetailStack.Screen name="InvPay_Edit_Client" component={InvPay_Edit_Client} options={{ title: 'Invoice' }} />
            <DetailStack.Screen name="Inv_New" component={InvNew} options={{ title: 'New Invoice' }} />
            <DetailStack.Screen name="BizInfo" component={BizInfo} options={{ title: 'My Business' }} />
            <DetailStack.Screen name="Client_List" component={Client_List} options={{ title: 'My Client' }} />
            <DetailStack.Screen name="Client_Form" component={Client_Form} options={{ title: 'My Client' }} />
            <DetailStack.Screen name="Item_List" component={Item_List} options={{ title: 'Item or Service' }} />
            <DetailStack.Screen name="Item_Form" component={Item_Form} options={{ title: 'Edit Item or Service' }} />
            <DetailStack.Screen name="Tax_List" component={Tax_List} options={{ title: 'Tax' }} />
            <DetailStack.Screen name="Tax_Form" component={Tax_Form} options={{ title: 'Tax' }} />
            <DetailStack.Screen name="PaymentMethod_List" component={PaymentMethod_List} options={{ title: 'Payment Method' }} />
            <DetailStack.Screen name="PaymentMethod_Form" component={PaymentMethod_Form} options={{ title: 'Payment Method' }} />
            <DetailStack.Screen name="RestoreScreen" component={RestoreScreen} options={{ title: 'Restore' }} />
            <DetailStack.Screen name="SupportHub" component={SupportHub} options={{ title: 'Support Hub' }} />
            <DetailStack.Screen name="TestScreen" component={TestScreen} options={{ title: 'Test Screen' }} />
            <DetailStack.Screen name="Biz_Logo" component={Biz_Logo} options={{ title: 'Logo' }} />
            <DetailStack.Screen name="SeedBizScreen" component={SeedScreen} options={{ title: 'Seed Business Data' }} /> 
        </DetailStack.Navigator>
    );
}

export default StackNavigator;