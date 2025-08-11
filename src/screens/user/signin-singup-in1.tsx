import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, } from 'firebase/auth';
import { auth } from '@/src/config/firebaseConfig'; // Adjust the import path as necessary
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStack } from '@/src/types/T_Navigation';
type RootNav = NativeStackNavigationProp<RootStack>;

export default function SmartAuthScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigation = useNavigation<RootNav>();

    const handleAuth = async () => {
        setMessage('');

        if (!email || !password) {
            setMessage('❌ Email and password are required.');
            return;
        }

        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();

        try {
            await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
            setMessage('✅ Signed in successfully!');
            navigation.navigate('MainDrawer');
        } catch (signInError: any) {
            console.log('Sign-in error:', signInError.code, signInError.message);

            // Treat both errors as "user not found"
            const treatAsUserNotFound =
                signInError.code === 'auth/user-not-found' ||
                signInError.code === 'auth/invalid-credential';

            if (treatAsUserNotFound) {
                try {
                    await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
                    setMessage('✅ New account created and signed in!');
                    navigation.navigate('MainDrawer');
                } catch (signUpError: any) {
                    console.log('Sign-up error:', signUpError.code, signUpError.message);
                    setMessage(`❌ Sign-up failed: ${signUpError.message}`);
                }
            } else if (signInError.code === 'auth/wrong-password') {
                setMessage('❌ Incorrect password.');
            } else {
                setMessage(`❌ Sign-in failed: ${signInError.message}`);
            }
        }
    };




    return (
        <View style={{ padding: 20 }}>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />
            <TextInput
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />
            <Button title="Sign In / Sign Up" onPress={handleAuth} />
            <Text style={{ marginTop: 20 }}>{message}</Text>
        </View>
    );
}

