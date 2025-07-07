import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useSQLiteContext } from "expo-sqlite";

import { RootStackPara, UserDB } from "@/src/types";
import { useUserStore } from "@/src/stores/useUserStore";
import { s_global } from "@/src/constants";

const SignScreen: React.FC = () => {
    const db = useSQLiteContext();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackPara>>();
    const { setCurrentUser } = useUserStore();

    const [email, setEmail] = useState("user@aiautoinvoicing.com");
    const [password, setPassword] = useState("12345678");

    const manualSignIn = async () => {
        try {
            const user = await db.getFirstAsync<UserDB>(
                "SELECT * FROM users WHERE user_email = ? AND user_password = ? AND NOT is_deleted",
                [email, password]
            );

            if (!user) {
                Alert.alert("Sign In Failed", "Invalid email or password.");
                return;
            }

            setCurrentUser(user);
            navigation.navigate("MainDrawer");
        } catch (err) {
            console.error("Manual login error:", err);
        }
    };

    return (
        <View style={s_global.Container}>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={s_global.Input}
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={s_global.Input}
                secureTextEntry
            />

            <Button title="Sign In" onPress={manualSignIn} />
        </View>
    );
};

export default SignScreen;
