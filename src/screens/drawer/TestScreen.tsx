import React from 'react';
import { View, Button, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import Toast from 'react-native-toast-message';

import Constants from 'expo-constants';
import * as Crypto from 'expo-crypto';

const version = Constants.expoConfig?.version ?? '1.0.0';

const TestScreen = () => {
    const handleCrash = () => {
        Alert.alert(
            'Crash App',
            'Are you sure you want to crash the app?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Crash',
                    style: 'destructive',
                    onPress: () => crashlytics().crash(),
                },
            ]
        );
    };

    const sendTestEvent = async () => {
        const uuid = Crypto.randomUUID();
        console.log(uuid);
        console.log(`Sending test analytics event with ID: ${uuid}`);
        await analytics().logEvent('dev_manual_event', { foo: 'bar' });
        Toast.show({
            type: 'success',
            text1: 'Analytics event sent',
            text2: 'Event: dev_manual_event',
        });
    };

    const sendLogOnly = () => {
        crashlytics().log('Test: manual log without crash');
        Toast.show({
            type: 'info',
            text1: 'Crashlytics log sent',
        });
    };

    const createUUID = async () => {
        const uuid = Crypto.randomUUID();
        console.log(`Generated UUID: ${uuid}`);
        Toast.show({
            type: 'info',
            text1: 'UUID Created',
            text2: `UUID: ${uuid}`,
        });
    };
    
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>🔥 Developer Test Screen</Text>
            <Text style={styles.version}>App Version: {version}</Text>

            <View style={styles.buttonGroup}>
                <Text style={styles.sectionTitle}>🔥 Crashlytics</Text>
                <Button title="Force Crash" color="red" onPress={handleCrash} />
                <Button title="Send Log Only" onPress={sendLogOnly} />
            </View>

            <View style={styles.buttonGroup}>
                <Text style={styles.sectionTitle}>📊 Analytics</Text>
                <Button title="Send Manual Analytics Event" onPress={sendTestEvent} />
            </View>

            <View style={styles.buttonGroup}>
                <Text style={styles.sectionTitle}>📊 Analytics</Text>
                <Button title="UUID" onPress={createUUID} />
            </View>

            <View style={styles.footerNote}>
                <Text style={styles.footerText}>
                    Use this screen only as a developer. In production, access is hidden.
                </Text>
            </View>
        </ScrollView>
    );
};

export default TestScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
    },
    version: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginBottom: 24,
    },
    buttonGroup: {
        marginBottom: 32,
        gap: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    footerNote: {
        marginTop: 40,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
    },
});
