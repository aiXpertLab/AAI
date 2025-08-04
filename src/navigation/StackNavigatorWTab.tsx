import React from "react";
import { StatusBar } from 'expo-status-bar';

import { createStackNavigator } from "@react-navigation/stack";

import BottomTabNavigator from '@/src/navigation/TabNavigator';

import { RootStackParamList } from "@/src/types";
import { colors } from "@/src/constants/colors";

import Drawer_Settings from "@/src/screens/drawer/DrawerSettings";

import Tab2_Client_Form from '@/src/screens/settings/Client_Form';
import Tab3_Item_Form from '@/src/screens/settings/Item_Form';

import Inv_Pay from "@/src/screens/invoice/Inv_Pay";
import Inv_New from "@/src/screens/inv/Inv_New";

import Inv1Me_BizForm from "@/src/screens/settings/BizInfo";
import Inv4Total_TaxForm from '@/src/screens/invoice/Inv4Total_TaxForm';

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator = () => (
    <>
        <StatusBar style="light" backgroundColor="#FAAB1A" />
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#FAAB1A', // header background
                },
                headerTintColor: '#fff', // text color
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false, }} />
            <Stack.Screen name="Inv_Pay" component={Inv_Pay} options={{ title: 'Invoice1' }} />

            <Stack.Screen name="Inv_New" component={Inv_New} options={{ title: 'New Invoice' }} />
            <Stack.Screen name="Inv1Me_BizForm" component={Inv1Me_BizForm} options={{
                title: '🧑‍💼 My Business',
            }} />
            <Stack.Screen name="Tab2_Client_Form" component={Tab2_Client_Form} options={{
                title: '🏢 Client Info',
                headerStyle: { backgroundColor: colors.client },
            }} />
            <Stack.Screen name="Tab3_Item_Form" component={Tab3_Item_Form} options={{
                title: '🛒 Item & Service Info',
                headerStyle: { backgroundColor: colors.item },
            }} />
            <Stack.Screen name="Inv4Total_TaxForm" component={Inv4Total_TaxForm} options={{
                title: '📝 Tax Info',
                headerStyle: { backgroundColor: colors.main },
            }} />
            <Stack.Screen name="Drawer_Settings" component={Drawer_Settings} options={{
                title: 'Invoice1',
                headerShown: true,
            }} />
            {/* <Stack.Screen name="ClientPicker" component={ClientPicker} options={{ title: '🤝 Add Client' }} /> */}
        </Stack.Navigator>
    </>
);

export default StackNavigator;
