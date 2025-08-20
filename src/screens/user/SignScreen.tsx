import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signInAnonymously } from 'firebase/auth';
import { auth } from '@/src/config/firebaseConfig';
import { useFirebaseUserStore } from '@/src/stores/FirebaseUserStore';

import analytics from '@react-native-firebase/analytics';
import { colors } from '@/src/constants/colors';
import { useBizCrud } from '@/src/firestore/fs_crud_biz';
import { useBizStore } from '@/src/stores/BizStore';
import { M_Spinning } from '@/src/modals/M_Spinning';

export default function SmartAuthScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { setOBiz, } = useBizStore();  // 🧠 Zustand action
    const {createBizFromLocalSeed, fetchBiz} = useBizCrud();
    const setFirebaseUser = useFirebaseUserStore((s) => s.setFirebaseUser);
    const setIsNewUser = useFirebaseUserStore((s) => s.setIsNewUser);

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
            const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
            const user = userCredential.user;
            setFirebaseUser(user);
            console.log('✅ Signed in successfully!');
        } catch (signInError: any) {
            if (
                signInError.code === 'auth/user-not-found' 
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
                                    setIsLoading(true);
                                    // Create the user account
                                    const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
                                    const user = userCredential.user;
                                    await createBizFromLocalSeed(user.uid);
                                    console.log('created')
                                    // const bizData = await fetchBiz();
                                    // setOBiz(bizData ?? null);
                                    setFirebaseUser(user);
                                    setIsNewUser(true);
                                } catch (signUpError: any) {
                                    setMessage(`❌ Sign-up failed: ${signUpError.message}`);
                                } finally {
                                    setIsLoading(false);
                                }
                            },
                        },
                    ]
                );
            } else if (signInError.code === 'auth/wrong-password' || signInError.code === 'auth/invalid-credential') {
                setMessage('❌ Incorrect password.');
            } else {
                setMessage(`❌ Sign-in failed: ${signInError.message}`);
            }
        }
    };

    const handleAnonymous = async () => {
        try {
            if (!auth.currentUser) {
                setIsLoading(true);
                const userCredential = await signInAnonymously(auth);
                const user = userCredential.user;

                // Create business entity for anonymous user
                try {
                    // await getBizCrud().createBiz(user.uid);
                    // const bizData = await getBizCrud().fetchBiz(user.uid);
                    // setOBiz(bizData ?? null);
                    setMessage('✅ Continuing as guest with business setup!');
                } catch (businessError) {
                    console.error('Business creation failed for anonymous user:', businessError);
                    setMessage('✅ Continuing as guest! Business setup will be completed shortly.');
                } finally {
                    setIsLoading(false);
                }
            } else {
                setMessage('✅ Already signed in as guest!');
            }
        } catch (error: any) {
            setIsLoading(false);
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
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1">
                    <ScrollView
                        contentContainerStyle={{
                            paddingTop: 80, // or whatever you want
                            paddingHorizontal: 16,
                            paddingBottom: 24,
                        }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="flex-1 justify-center px-6 mt-0">
                            {/* Logo */}
                            <View className="items-center mt-0 mb-6">
                                <Image source={require('@/assets/logo_transparent.png')} className="w-[280px] mb-2" resizeMode="contain" />
                            </View>
                            {/* Welcome text */}
                            <Text className="text-center text-xl font-bold text-black mb-10">Welcome to AI Auto Invoicing!</Text>
                            <Text className="text-center text-gray-400 mb-10">Sign in for a smarter invoicing experience...</Text>
                            {/* Email input */}
                            <View className="mb-4">
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
                                disabled={isLoading}
                            >
                                <Text className="text-white font-bold text-base tracking-wide">LOGIN / REGISTER</Text>
                            </TouchableOpacity>
                            {/* Forgot password */}

                            {message ? <Text className="text-center text-red-500 mb-2">{message}</Text> : null}
                        </View>
                    </ScrollView>
                    <View className="absolute bottom-8 flex-row justify-between items-center w-full mb-8 px-6">
                        <TouchableOpacity onPress={handleAnonymous} disabled={isLoading}>
                            <Text className="text-gray-400  text-sm">Continue as Guest</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
                            <Text className="text-right text-sm" style={{ color: colors.main }}>Forgot password?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <M_Spinning visible={isLoading} />
        </KeyboardAvoidingView>
    );
}
