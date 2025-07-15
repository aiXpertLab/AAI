import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signInAnonymously } from 'firebase/auth';
import { auth } from '@/src/config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/src/types/RootStackParamList';
import { useGoogleAuth } from '@/src/utils/googleAuth';
import analytics from '@react-native-firebase/analytics';
import { colors } from '@/src/constants/colors';

type RootNav = NativeStackNavigationProp<RootStackParamList>;

export default function SmartAuthScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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

    const handleAnonymous = async () => {
        try {
            if (!auth.currentUser) {
                await signInAnonymously(auth);
                setMessage('✅ Continuing as guest!');
            } else {
                setMessage('✅ Already signed in as guest!');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to sign in as guest.');
        }
    };

    useEffect(() => {
        analytics().logEvent('sign_in_page_open');
    }, []);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-white"
        >
            <View className="flex-1 justify-center px-6 mt-0">
                {/* Logo */}
                <View className="items-center mt-0 mb-10">
                    <Image source={require('@/assets/logo_transparent.png')} className="w-[280px] mb-2" resizeMode="contain" />
                </View>
                {/* Welcome text */}
                <Text className="text-center text-xl font-bold text-black mb-10">Welcome to AI Auto Invoicing!</Text>
                <Text className="text-center text-gray-400 mb-10">Sign in for a smarter invoicing experience.</Text>
                {/* Email input */}
                <View className="mb-8">
                    <TextInput
                        className="bg-gray-100 rounded-full px-5 py-3 text-base"
                        placeholder="Email"
                        placeholderTextColor="#B0B0B0"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>
                {/* Password input with eye toggle */}
                <View className="mb-4 flex-row items-center bg-gray-100 rounded-full px-5">
                    <TextInput
                        className="flex-1 py-3 text-base"
                        placeholder="Password"
                        placeholderTextColor="#B0B0B0"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Text className="text-gray-400 font-bold ml-2">{showPassword ? '🙈' : '👁️'}</Text>
                    </TouchableOpacity>
                </View>
                {/* Login button */}
                <TouchableOpacity
                    className="mt-6 mb-8 rounded-full py-4 items-center"
                    style={{ backgroundColor: colors.main }}
                    onPress={handleAuth}
                >
                    <Text className="text-white font-bold text-base tracking-wide">LOGIN</Text>
                </TouchableOpacity>
                {/* Forgot password */}
                <View className="flex-row justify-between items-center w-full mb-8">
                    <TouchableOpacity onPress={handleAnonymous}>
                        <Text className="text-gray-400  text-sm">Continue as Guest</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleForgotPassword}>
                        <Text className="text-right text-sm" style={{ color: colors.main }}>Forgot password?</Text>
                    </TouchableOpacity>
                </View>
                {/* <TouchableOpacity onPress={handleForgotPassword} className="mb-8">
                    <Text className="text-center" style={{ color: colors.main }}>Forgot password?</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAnonymous}>
                    <Text className="text-center text-gray-400 text-sm underline">Continue as Guest</Text>
                </TouchableOpacity> */}

                {message ? <Text className="text-center text-red-500 mb-2">{message}</Text> : null}
            </View>
            {/* Register link at the bottom */}
            <View className="absolute bottom-8 w-full flex-row justify-center">
                <Text className="text-gray-400">Don't have an account? </Text>
                <Text className="font-bold" style={{ color: colors.main }}>Register!</Text>
            </View>
        </KeyboardAvoidingView>
    );
}
