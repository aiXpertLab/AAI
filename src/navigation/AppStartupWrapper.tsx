// src/components/StartupWrapper.tsx
import React from "react";
import { View, ActivityIndicator } from "react-native";

import { useFirebaseUserStore } from "@/src/stores/FirebaseUserStore";
import { useAppStartup } from "@/src/hooks/useAppStartup";

const AppStartupWrapper = () => {
    const [loading, setLoading] = React.useState(true);
    const firebaseUser = useFirebaseUserStore((s) => s.FirebaseUser);

    React.useEffect(() => {
        // Set loading to false after initial mount
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000); // Give a small delay for initial setup

        return () => clearTimeout(timer);
    }, []);

    // Only run useAppStartup if we have a user
    if (firebaseUser) {
        useAppStartup(); 
    }
    
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
