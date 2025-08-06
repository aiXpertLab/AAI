import React from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from '@/src/navigation/AppNavigator';
import Purchases from 'react-native-purchases';

const App = () => {
    React.useEffect(() => {
        Purchases.configure({ apiKey: Platform.select({ android: 'goog_gGLCFVPFhfagEKmYklWjTaZeeoZ', }) || '', });
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AppNavigator />
        </GestureHandlerRootView>
    );
};

export default App;
