import { useEffect } from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { migrateDbIfNeeded } from '@/src/db/db_i';
import AppNavigator from '@/src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';

import "@/src/css/firebase.css"
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';

import StartupWrapper from "@/src/components/StartupWrapper"; // ✅ import it

function App() {

    useEffect(() => {
        crashlytics().setCrashlyticsCollectionEnabled(true);
        analytics().logAppOpen();

        // Catch global errors
        const errorHandler = (error: Error) => {
            crashlytics().recordError(error);
        };

        // Attach global error handler (example)
        const subscription = ErrorUtils.getGlobalHandler();
        ErrorUtils.setGlobalHandler((error, isFatal) => {
            errorHandler(error);
            subscription(error, isFatal);
        });

        return () => {
            // Cleanup if necessary
        };
    }, []);


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SQLiteProvider databaseName="db.db" onInit={migrateDbIfNeeded}>
                {/* <SimpleErrorBoundary> */}
                <StartupWrapper />
                <AppNavigator />
                <Toast />
                {/* </SimpleErrorBoundary> */}
            </SQLiteProvider>
        </GestureHandlerRootView>
    );
}

export default App;