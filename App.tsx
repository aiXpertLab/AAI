import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from '@/src/navigation/AppNavigator';
import "@/src/css/firebase.css"

function App() {

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AppNavigator />
        </GestureHandlerRootView>
    );
}

export default App;