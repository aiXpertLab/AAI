import { useEffect } from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { migrateDbIfNeeded } from '@/src/db/db_i';
import StartupWrapper from "@/src/components/StartupWrapper"; // ✅ import it
import AppNavigator from '@/src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';

import { analytics } from '@/src/config/firebaseConfig'; // ✅ import firebase analytics
import { logEvent } from 'firebase/analytics';

// import analytics from '@react-native-firebase/analytics';

function App() {

    useEffect(() => {
        if (analytics) {
            logEvent(analytics, 'app_open');
        }
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