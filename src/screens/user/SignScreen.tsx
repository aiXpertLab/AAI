import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import {signInWithEmailAndPassword,createUserWithEmailAndPassword,} from 'firebase/auth';
import { auth } from '@/src/config/firebaseConfig'; // Adjust the import path as necessary
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/src/types/RootStackParamList';
type RootNav = NativeStackNavigationProp<RootStackParamList>;

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



// import React, { useState } from 'react';
// import { View, TextInput, Button, Text } from 'react-native';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '@/src/config/firebaseConfig'; // update path if different

// export default function SignUpTest() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [message, setMessage] = useState('');

//     const handleSignUp = async () => {
//         try {
//             await createUserWithEmailAndPassword(auth, email, password);
//             setMessage('✅ Sign-up successful!');
//         } catch (error: any) {
//             setMessage(`❌ ${error.message}`);
//         }
//     };

//     return (
//         <View style={{ padding: 20 }}>
//             <TextInput
//                 placeholder="Email"
//                 value={email}
//                 onChangeText={setEmail}
//                 style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
//             />
//             <TextInput
//                 placeholder="Password"
//                 value={password}
//                 secureTextEntry
//                 onChangeText={setPassword}
//                 style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
//             />
//             <Button title="Sign Up" onPress={handleSignUp} />
//             <Text style={{ marginTop: 20 }}>{message}</Text>
//         </View>
//     );
// }


// // import React, { useState } from "react";
// // import { View, TextInput, Button, Alert } from "react-native";
// // import { useNavigation } from "@react-navigation/native";
// // import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// // import { useSQLiteContext } from "expo-sqlite";

// // import { RootStackPara, UserDB } from "@/src/types";
// // import { useUserStore } from "@/src/stores/useUserStore";
// // import { s_global } from "@/src/constants";

// // const SignScreen: React.FC = () => {
// //     const db = useSQLiteContext();
// //     const navigation = useNavigation<NativeStackNavigationProp<RootStackPara>>();
// //     const { setCurrentUser } = useUserStore();

// //     const [email, setEmail] = useState("user@aiautoinvoicing.com");
// //     const [password, setPassword] = useState("12345678");

// //     const manualSignIn = async () => {
// //         try {
// //             const user = await db.getFirstAsync<UserDB>(
// //                 "SELECT * FROM users WHERE user_email = ? AND user_password = ? AND NOT is_deleted",
// //                 [email, password]
// //             );

// //             if (!user) {
// //                 Alert.alert("Sign In Failed", "Invalid email or password.");
// //                 return;
// //             }

// //             setCurrentUser(user);
// //             navigation.navigate("MainDrawer");
// //         } catch (err) {
// //             console.error("Manual login error:", err);
// //         }
// //     };

// //     return (
// //         <View style={s_global.Container}>
// //             <TextInput
// //                 placeholder="Email"
// //                 value={email}
// //                 onChangeText={setEmail}
// //                 style={s_global.Input}
// //                 autoCapitalize="none"
// //             />
// //             <TextInput
// //                 placeholder="Password"
// //                 value={password}
// //                 onChangeText={setPassword}
// //                 style={s_global.Input}
// //                 secureTextEntry
// //             />

// //             <Button title="Sign In" onPress={manualSignIn} />
// //         </View>
// //     );
// // };

// // export default SignScreen;
