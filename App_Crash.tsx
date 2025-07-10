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

analytics().setAnalyticsCollectionEnabled(true);
analytics().setSessionTimeoutDuration(1800000); // optional
analytics().setUserId('debug_user'); // optional
analytics().setUserProperty('debug', 'true'); // optional

const TestScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>🔥 Firebase Test Screen</Text>
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




// import { useEffect } from 'react';
// import { SQLiteProvider } from 'expo-sqlite';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { migrateDbIfNeeded } from '@/src/db/db_i';
// import StartupWrapper from "@/src/components/StartupWrapper"; // ✅ import it
// import AppNavigator from '@/src/navigation/AppNavigator';
// import Toast from 'react-native-toast-message';

// // import { analytics } from '@/src/config/firebaseConfig'; // ✅ import firebase analytics
// import { logEvent } from 'firebase/analytics';

// import TestScreen from './src/screens/TestScreen';

// // import analytics from '@react-native-firebase/analytics';
// import analytics from '@react-native-firebase/analytics';
// import crashlytics from '@react-native-firebase/crashlytics';

// function App() {

//     // useEffect(() => {
//     //     if (analytics) {
//     //         logEvent(analytics, 'app_open');
//     //     }
//     // }, []);

//     useEffect(() => {
//         analytics().logEvent('test_event', { debug: true });

//         crashlytics().log('App booted — testing crash logging');
//         crashlytics().crash(); // Uncomment only for crash test
//     }, []);


//     return (
//         <GestureHandlerRootView style={{ flex: 1 }}>
//             <SQLiteProvider databaseName="db.db" onInit={migrateDbIfNeeded}>
//                 {/* <SimpleErrorBoundary> */}
//                 <StartupWrapper />
//                 <AppNavigator />
//                 <Toast />
//                 {/* </SimpleErrorBoundary> */}
//             </SQLiteProvider>
//         </GestureHandlerRootView>
//     );
// }

// export default App;