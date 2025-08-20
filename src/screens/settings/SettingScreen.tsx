// src/screens/Drawer_Settings_Screen.tsx
import Constants from 'expo-constants';
const version = Constants.expoConfig?.version ?? '18.8.30';

import React from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useFirebaseUserStore } from '@/src/stores/FirebaseUserStore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/src/config/firebaseConfig';
import { updatePassword } from "firebase/auth";
import { deleteUser } from "firebase/auth";
import { useInvCrud, useBizCrud } from "@/src/firestore";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { s_global } from "@/src/constants";

import { DetailStack } from "@/src/types";
import SettingItem from "./SettingItem";
import { useBizStore } from '@/src/stores';

const Drawer_Settings_Screen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<DetailStack>>();
    const { oBiz, updateOBiz, setOBiz } = useBizStore();  // 🧠 Zustand action
    const firebaseUser = useFirebaseUserStore.getState().FirebaseUser;
    const email = firebaseUser?.email;
    const { updateBiz } = useBizCrud();

    const handleResetPassword = async () => {
        if (!email) return Alert.alert('Please enter your email to reset password.');
        try {
            await sendPasswordResetEmail(auth, email.trim().toLowerCase());
            Alert.alert('Password reset email sent!', 'Check your inbox or spam folder.');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };


    const handleDeleteAccount = async () => {
        if (!auth.currentUser) {
            Alert.alert("No user is signed in.");
            return;
        }

        Alert.alert(
            "⚠️ Delete Account?",
            "This action is **undoable**. All your data will be lost and cannot be recovered.\n\n👉 Please backup/export your data before proceeding.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete Permanently",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteUser(auth.currentUser!);
                            Alert.alert("✅ Account deleted successfully!");
                        } catch (err: any) {
                            if (err.code === "auth/requires-recent-login") {
                                Alert.alert("Please sign in again to delete your account.");
                            } else {
                                Alert.alert("❌ Error", err.message);
                            }
                        }
                        navigation.goBack();
                    },
                },
            ]
        );
    };


    React.useLayoutEffect(() => {
        const parent = navigation.getParent();
        if (parent) {
            parent.setOptions({ headerShown: false });
            return () => parent.setOptions({ headerShown: true });
        }
    }, [navigation]);

    const [showPaidOnInvoice, setShowPaidOnInvoice] = React.useState(false);

    return (
        <ScrollView style={s_global.SettingsContainer}>
            {/* Business Section */}
            <Section title="My Business">
                <SettingItem title="Business Info" onPress={async () => { navigation.navigate("BizInfo"); }} />
                <SettingItem title="Tax" onPress={() => navigation.navigate("Tax_List")} />
                <SettingItem title="Clients" onPress={() => navigation.navigate("Client_List")} />
                <SettingItem title="Items & Services" onPress={() => navigation.navigate("Item_List")} />
            </Section>

            {/* Invoice Section */}
            <Section title="Invoice">

                <SettingItem title="Invoice Number" onPress={() => navigation.navigate("InvNumber_Form")} />
                <SettingItem title="Payment Method" onPress={() => navigation.navigate("PaymentMethod_List")} />
                {/* <SettingItem title="Signature" />  */}
                <SettingItem
                    title="Paid show on Invoice"
                    toggle
                    toggleValue={oBiz?.be_show_paid_stamp ?? true}
                    onToggle={async (val) => {
                        await updateOBiz({ be_show_paid_stamp: val });  // Zustand or Firestore update
                        await updateBiz({ be_show_paid_stamp: val });  // Zustand or Firestore update
                    }}
                />
            </Section>

            {/* General Section */}
            {/* <Section title="General">
                <SettingItem title="Default Currency" subtitle="CAD $" />
                <SettingItem title="Number Format" subtitle="1,000,000.00" />
                <SettingItem title="Date Format" subtitle="31/12/2025" />
            </Section> */}

            <Section title="User">
                <SettingItem title="Reset Password" onPress={handleResetPassword} />
                <SettingItem title="Delete Account" onPress={handleDeleteAccount} />
            </Section>

            {/* {__DEV__ && (
                <Section title="Dev">
                    <SettingItem title="Seed" onPress={() => navigation.navigate("SeedBizScreen")} />
                </Section>
            )} */}

            <Pressable
                onLongPress={() => {
                    navigation.navigate('TestScreen'); // or your route name
                }}
                delayLongPress={1500} // optional: require holding for 1.5s
            >
                <Text style={s_global.Setting_VersionText}>
                    Version: {version}
                </Text>
            </Pressable>
        </ScrollView>
    );
};

export default Drawer_Settings_Screen;

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={s_global.Setting_Section}>
        <Text style={s_global.Label}>{title}</Text>
        {children}
    </View>
);

