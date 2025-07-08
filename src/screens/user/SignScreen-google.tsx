import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/src/config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/src/types/RootStackParamList';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useGoogleAuth } from '@/src/utils/googleAuth';

type RootNav = NativeStackNavigationProp<RootStackParamList>;

export default function SmartAuthScreen() {
    const navigation = useNavigation<RootNav>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false); // add this near your other states
    const { promptAsync } = useGoogleAuth(navigation);


    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert('Please enter your email to reset password.');
            return;
        }

        const trimmedEmail = email.trim().toLowerCase();

        try {
            await sendPasswordResetEmail(auth, trimmedEmail);
            Alert.alert('Password reset email sent!', 'Check your inbox or spam folder.');
        } catch (error: any) {
            console.error('Password reset error:', error);
            Alert.alert('Error', error.message);
        }
    };


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
            if (
                signInError.code === 'auth/user-not-found' ||
                signInError.code === 'auth/invalid-credential'
            ) {
                try {
                    await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
                    setMessage('✅ New account created and signed in!');
                    navigation.navigate('MainDrawer');
                } catch (signUpError: any) {
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
        <View style={styles.container}>
            <Text style={styles.title}>AI Invoicing</Text>
            <Text style={styles.subtitle}>Access a more personalized AI Invoicing experience by signing in.</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Text style={styles.showText}>{showPassword ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
            </View>


            <TouchableOpacity style={styles.loginButton} onPress={handleAuth}>
                <Text style={styles.loginButtonText}>Log in</Text>
            </TouchableOpacity>

            <Text style={styles.message}>{message}</Text>

            <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity>


            {/* <Text style={styles.orText}>────────  or  ────────</Text>

            <TouchableOpacity onPress={() => promptAsync()}>
                <View style={styles.socialCircle}>
                    <Text>G</Text>
                </View>
            </TouchableOpacity>
            */}

            <TouchableOpacity style={styles.signUpButton}>
                <Text style={styles.signUpText}>Sign up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flex: 1, justifyContent: 'center' },
    title: { fontSize: 32, fontWeight: 'bold', color: '#d43f7a', textAlign: 'center' },
    subtitle: { textAlign: 'center', marginVertical: 10, fontSize: 14, color: '#333' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 6,
        marginBottom: 12,
    },
    loginButton: {
        backgroundColor: '#357a7a',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
    },
    loginButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    message: { marginTop: 12, color: 'red', textAlign: 'center' },
    forgotPassword: { marginTop: 10, color: '#357a7a', textAlign: 'center' },
    orText: { textAlign: 'center', marginVertical: 16, color: '#555' },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    socialCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    signUpButton: {
        borderWidth: 1,
        borderColor: '#357a7a',
        borderRadius: 30,
        paddingVertical: 12,
        marginTop: 30,
    },
    signUpText: { textAlign: 'center', color: '#357a7a', fontWeight: 'bold' },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        marginBottom: 12,
        paddingRight: 12,
    },
    passwordInput: {
        flex: 1,
        padding: 12,
    },
    showText: {
        color: '#357a7a',
        fontWeight: '600',
    },

});
