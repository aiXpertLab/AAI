import React from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Purchases from 'react-native-purchases';

import AppNavigator from '@/src/navigation/AppNavigator';

const App = () => {

    React.useEffect(() => {
        // Configure IAP
        Purchases.configure({
            apiKey: Platform.select({ android: 'goog_gGLCFVPFhfagEKmYklWjTaZeeoZ', }) || '',
        });
    }, []);
    
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AppNavigator />
        </GestureHandlerRootView>
    );
};

export default App;
