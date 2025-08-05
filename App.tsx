import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from '@/src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';

import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';

import AppStartupWrapper from "@/src/navigation/AppStartupWrapper"; // ✅ 

import "@/src/css/firebase.css"

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
            <AppStartupWrapper />
            <AppNavigator />
            <Toast />
        </GestureHandlerRootView>
    );
}

export default App;