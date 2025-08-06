// AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StackNavigator from './StackNavigator';
import DrawerNavigator from './DrawerNavigator';
import SignScreen from '@/src/screens/user/SignScreen';

import { useFirebaseUserStore } from '@/src/stores/FirebaseUserStore';

const RootStack = createNativeStackNavigator();

const AppNavigator = () => {
    console.log('AppNavigator.tsx function called'); // Log when component function runs

    const firebaseUser = useFirebaseUserStore((state) => state.FirebaseUser);

    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
                {firebaseUser ? (
                    <RootStack.Screen name="MainDrawer" component={DrawerNavigator} />
                ) : (
                    <RootStack.Screen name="Sign" component={SignScreen} />
                )}
                {/* Keep DetailStack for navigation from DrawerNavigator if needed */}
                <RootStack.Screen name="DetailStack" component={StackNavigator} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
