// AppNavigator.tsx
import React from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import analytics from '@react-native-firebase/analytics';

import StackNavigator from './StackNavigator';
import DrawerNavigator from './DrawerNavigator';

const RootStack = createNativeStackNavigator();
// const navigationRef = useNavigationContainerRef();

const AppNavigator = () => (
    <NavigationContainer
    //     ref={navigationRef}
    //     onStateChange={async () => {
    //         const currentRoute = navigationRef.getCurrentRoute();
    //         if (currentRoute) {
    //             await analytics().logScreenView({
    //                 screen_name: currentRoute.name,
    //                 screen_class: currentRoute.name,
    //             });
    //         }
    //     }}
    >

        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="MainDrawer" component={DrawerNavigator} />
            <RootStack.Screen name="DetailStack" component={StackNavigator} />
        </RootStack.Navigator>
    </NavigationContainer>
);

export default AppNavigator;
