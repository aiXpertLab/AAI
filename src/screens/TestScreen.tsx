import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

const TestScreen = () => {
    const sendTestAnalytics = () => {
        analytics().logEvent('test_event', { debug: true });
    };

    const forceCrash = () => {
        crashlytics().log('Forcing crash via test button');
        crashlytics().crash(); // 💥
    };

    return (
        <View style={styles.container}>
            <Button title="Send Test Analytics Event" onPress={sendTestAnalytics} />
            <Button title="Force Crash (for Crashlytics)" onPress={forceCrash} color="red" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        gap: 20,
        padding: 40,
    },
});

export default TestScreen;
