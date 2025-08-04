// AppNavigatorWithBusiness.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { AuthBusinessProvider, useAuthBusiness } from '@/src/components/AuthBusinessProvider';
import StackNavigator from './StackNavigator';
import DrawerNavigator from './DrawerNavigator';
import SignScreen from '@/src/screens/user/SignScreen';
import { useFirebaseUserStore } from '@/src/stores/FirebaseUserStore';

const RootStack = createNativeStackNavigator();

// Inner component that uses the auth business context
function AppNavigatorInner() {
    const { businessId, isLoading } = useAuthBusiness();
    const user = useFirebaseUserStore((state) => state.FirebaseUser);

    console.log('AppNavigatorWithBusiness render:', { 
        user: user?.email, 
        businessId, 
        isLoading
    });

    // Show loading while business entity is being created/loaded
    if (user && isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#F28500" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    // User is authenticated - show main app
                    // Business entity is automatically created if needed
                    <RootStack.Screen name="MainDrawer" component={DrawerNavigator} />
                ) : (
                    // User is not authenticated - show sign screen
                    <RootStack.Screen name="Sign" component={SignScreen} />
                )}
                
                {/* Keep DetailStack for navigation from DrawerNavigator if needed */}
                <RootStack.Screen name="DetailStack" component={StackNavigator} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
}

// Main component that provides the auth business context
const AppNavigatorWithBusiness = () => {
    return (
        <AuthBusinessProvider>
            <AppNavigatorInner />
        </AuthBusinessProvider>
    );
};

export default AppNavigatorWithBusiness;