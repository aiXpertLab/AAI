import React, { useEffect } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { migrateDbIfNeeded } from '@/src/db/db_i';
import StartupWrapper from '@/src/components/StartupWrapper';
import AppNavigator from '@/src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';

// ✅ Native Firebase SDKs
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

crashlytics().setCrashlyticsCollectionEnabled(true);
analytics().setAnalyticsCollectionEnabled(true);
analytics().setSessionTimeoutDuration(1800000); // optional
analytics().setUserId('debug_user'); // optional
analytics().setUserProperty('debug', 'true'); // optional

const TestScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>🔥 Firebase Test Screen</Text>
            <Button
                title="Crash 11 Test"
                onPress={() => crashlytics().crash()}
            />
            <Button
                title="Send Analytics Event"
                onPress={() => {
                    analytics().logEvent('dev_manual_event', { foo: 'bar' });
                }}
            />
            <Button
                title="Force Crash (for Crashlytics)"
                color="red"
                onPress={() => {
                    crashlytics().log('Force crash via dev button');
                    crashlytics().crash();
                }}
            />
        </View>
    );
};

function App() {
    useEffect(() => {
        // ✅ Log event to Firebase Analytics
        analytics().logEvent('test_event', { debug: true });

        // ✅ Log to Crashlytics (no crash by default)
        crashlytics().log('App booted — Crashlytics logging active');
    }, []);


    useEffect(() => {
        crashlytics().setCrashlyticsCollectionEnabled(true);
        crashlytics().log('App started – crashlytics enabled');
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SQLiteProvider databaseName="db.db" onInit={migrateDbIfNeeded}>
                <StartupWrapper />

                {/* ✅ In development mode, show the test screen directly */}
                {__DEV__ ? <TestScreen /> : <AppNavigator />}

                <Toast />
            </SQLiteProvider>
        </GestureHandlerRootView>
    );
}

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        gap: 20,
        padding: 32,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
    },
});

