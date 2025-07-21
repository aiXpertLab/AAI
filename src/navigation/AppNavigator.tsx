// AppNavigator.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/src/config/firebaseConfig';

import StackNavigator from './StackNavigator';
import DrawerNavigator from './DrawerNavigator';
import SignScreen from '@/src/screens/user/SignScreen';

import { useFirebaseUserStore } from '@/src/stores/useUserStore';

const RootStack = createNativeStackNavigator();

const AppNavigator = () => {
    console.log('AppNavigator function called'); // Log when component function runs
    const [initializing, setInitializing] = useState(true);
    // const [user, setUser] = useState<any>(null);
    const user = useFirebaseUserStore((state) => state.FirebaseUser);
    const setUser = useFirebaseUserStore((state) => state.setFirebaseUser);

    useEffect(() => {
        console.log('AppNavigator useEffect for auth state runs'); // Log when useEffect runs
        const unsubscribe = onAuthStateChanged(auth, (usr) => {
            console.log('Auth state changed:', usr);
            setUser(usr);
            setInitializing(false);
        });
        return unsubscribe;
    }, [setUser]);
    

    console.log('AppNavigator render, user:', user);
    console.log('AppNavigator render after restart, auth.currentUser:', auth.currentUser); // Debug log for persistence

    if (initializing) {
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
