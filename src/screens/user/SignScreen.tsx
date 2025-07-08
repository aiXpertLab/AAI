import React, { useState, useEffect } from 'react';
import {    View, TextInput, Text, TouchableOpacity, ScrollView,    StyleSheet, Alert, KeyboardAvoidingView, Platform} from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/src/config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/src/types/RootStackParamList';
import { useGoogleAuth } from '@/src/utils/googleAuth';

type RootNav = NativeStackNavigationProp<RootStackParamList>;

export default function SmartAuthScreen() {
    const navigation = useNavigation<RootNav>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { promptAsync } = useGoogleAuth(navigation);

    const handleForgotPassword = async () => {
        if (!email) return Alert.alert('Please enter your email to reset password.');
        try {
            await sendPasswordResetEmail(auth, email.trim().toLowerCase());
            Alert.alert('Password reset email sent!', 'Check your inbox or spam folder.');
        } catch (error: any) {
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
                Alert.alert(
                    'No account found',
                    'Would you like to create a new account with this email?',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Create Account',
                            onPress: async () => {
                                try {
                                    await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
                                    setMessage('✅ New account created and signed in!');
                                    navigation.navigate('MainDrawer');
                                } catch (signUpError: any) {
                                    setMessage(`❌ Sign-up failed: ${signUpError.message}`);
                                }
                            },
                        },
                    ]
                );
            } else if (signInError.code === 'auth/wrong-password') {
                setMessage('❌ Incorrect password.');
            } else {
                setMessage(`❌ Sign-in failed: ${signInError.message}`);
            }
        }
    };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.wrapper}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.container}>
                    <Text style={styles.title}>AI Auto Invoicing</Text>
                    <Text style={styles.subtitle}>
                        Sign in for a smarter invoicing experience.
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Text style={styles.showText}>{showPassword ? 'Hide' : 'Show'}</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.loginButton} onPress={handleAuth}>
                        <Text style={styles.loginButtonText}>Sign In / Register</Text>
                    </TouchableOpacity>

                    {message ? <Text style={styles.message}>{message}</Text> : null}

                    <TouchableOpacity onPress={handleForgotPassword}>
                        <Text style={styles.forgotPassword}>Forgot password?</Text>
                    </TouchableOpacity>

                    {/* <Text style={styles.orText}>────────  or  ────────</Text>

        <TouchableOpacity onPress={() => promptAsync()}>
          <View style={styles.socialCircle}>
            <Text>G</Text>
          </View>
        </TouchableOpacity> */}

                    <TouchableOpacity style={styles.signUpButton}>
                        <Text style={styles.signUpText}>Have a reference number? Register here</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        paddingTop: 60, // reduced top padding
        paddingHorizontal: 24,
        paddingBottom: 60,
    },
    container: {
        flexGrow: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#F28500',
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 24,
        fontSize: 14,
        color: '#555',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 6,
        marginBottom: 22,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        marginBottom: 16,
        paddingRight: 12,
    },
    passwordInput: {
        flex: 1,
        padding: 12,
    },
    showText: {
        color: '#aaa',
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: '#F28500',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 22,
        marginTop: 22,
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    message: {
        textAlign: 'center',
        color: 'red',
        marginBottom: 8,
    },
    forgotPassword: {
        textAlign: 'center',
        color: '#aaa',
        marginBottom: 30,
    },
    signUpButton: {
        paddingVertical: 12,
    },
    signUpText: {
        textAlign: 'center',
        color: '#aaa',
        fontWeight: 'bold',
    },

});
