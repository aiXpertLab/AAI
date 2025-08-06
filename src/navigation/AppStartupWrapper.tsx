// src/components/StartupWrapper.tsx
import React from "react";
import { View, ActivityIndicator } from "react-native";

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/src/config/firebaseConfig';

import { useFirebaseUserStore } from "@/src/stores/FirebaseUserStore";
import { useAppStartup } from "@/src/hooks/useAppStartup";

const AppStartupWrapper = () => {
    const [loading, setLoading] = React.useState(true);
    const setFirebaseUser = useFirebaseUserStore((s) => s.setFirebaseUser);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log("Auth state changed:", user?.email);
            setFirebaseUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);


    useAppStartup(); 
    
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#F28500" />
            </View>
        );
    }

    return null;
};
export default AppStartupWrapper;
