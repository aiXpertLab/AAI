// src/navigation/DrawerNavigator.tsx
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from '@expo/vector-icons';
import { useModalStore } from '@/src/stores/useModalStore';
import { useTabStore } from '@/src/stores/useTabStore';

import CustomDrawerContent from "@/src/navigation/DrawerContent";
import Tab1_HomeScreen from '@/src/screens/Tab1_Home';
import { colors } from "@/src/constants";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    const { filterIcon, showFilterIcon, hideFilterIcon, filterModalVisible, showFilterModal, hideFilterModal } = useModalStore();
    const currentTab = useTabStore((state) => state.currentTab);

    const getHeaderRightIcon = () => {
        switch (currentTab) {
            case 'Invoices':
                return (<Ionicons name="filter-outline" size={24} style={{ marginRight: 16 }} color="white"
                    onPress={() => { showFilterModal() }} />);
            case 'Clients':
                return null; // Hide icon
            case 'Items':
                return (<Ionicons name="add-outline" size={24} style={{ marginRight: 16 }}
                    onPressIn={() => { showFilterModal() }} />);
            default:
                return null;
        }
    };

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={({ route }) => {
                return { drawerStyle: { width: 250 }, };
            }}
        >
            <Drawer.Screen
                name="MainTabs"
                component={Tab1_HomeScreen}
                options={({ navigation }) => {
                    // Get the current tab route name
                    const state = navigation.getState();
                    const tabState = state.routes[0].state;
                    const currentTab = tabState?.routeNames?.[tabState?.index ?? 0];

                    let title = 'Invoices';
                    let headerColor = colors.main; // Default orange

                    if (currentTab === 'Invoices') {
                        title = 'Invoices';
                    } else if (currentTab === 'Clients') {
                        title = 'Clients';
                    } else if (currentTab === 'Items') {
                        title = 'Items';
                    }

                    return {
                        title,
                        headerStyle: {
                            backgroundColor: headerColor
                        },
                        headerTintColor: '#fff' // White text for all headers
                    };
                }}
            />
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;