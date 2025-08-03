// src/navigation/TabNavigator.tsx
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors } from "@/src/constants";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Tab1_HomeScreen from '@/src/screens/HomeScreen';
import Tab2_ClientScreen from '@/src/screens/settings/Client_List';
import Tab3_ItemScreen from '@/src/screens/settings/Item_List';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName: string = 'help-outline'; // Default icon

                    if (route.name === 'Invoices') {
                        iconName = 'document-text-outline';
                    } else if (route.name === 'Clients') {
                        iconName = 'people-outline';
                    } else if (route.name === 'Items') {
                        iconName = 'bar-chart-outline';
                    } return <Ionicons name={iconName as any} size={size} color={color} />;
                },
                tabBarStyle: { height: 55, },
                tabBarLabelStyle: { fontSize: 14, },
                tabBarInactiveTintColor: '#ccc', // iOS gray
            })}
        >
            <Tab.Screen name="Invoices" component={Tab1_HomeScreen} options={{ headerShown: false, tabBarActiveTintColor: colors.main, }} />
            <Tab.Screen name="Clients" component={Tab2_ClientScreen} options={{ headerShown: false, tabBarActiveTintColor: colors.main, }} />
            <Tab.Screen name="Items" component={Tab3_ItemScreen} options={{ headerShown: false, tabBarActiveTintColor: colors.main, }} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;