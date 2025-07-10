// src/screens/Drawer_Settings_Screen.tsx
import React, { useLayoutEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DetailStackPara } from "@/src/types";
import SettingItem from "@/src/screens/drawer/SettingItem";
import { s_global } from "@/src/constants";
import Constants from 'expo-constants';
const version = Constants.expoConfig?.version ?? '1.0.0';

const Drawer_Settings_Screen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<DetailStackPara>>();


    useLayoutEffect(() => {
        const parent = navigation.getParent();
        if (parent) {
            parent.setOptions({ headerShown: false });
            return () => parent.setOptions({ headerShown: true });
        }
    }, [navigation]);

    const [showPaidOnInvoice, setShowPaidOnInvoice] = useState(false);

    return (
        <ScrollView style={s_global.SettingsContainer}>
            {/* Business Section */}
            <Section title="My Business">
                <SettingItem title="Business Info" onPress={() => navigation.navigate("Inv1Me_BizForm")} />
                <SettingItem title="Tax" onPress={() => navigation.navigate("Tax_List")} />
                <SettingItem title="Payment Method" onPress={() => navigation.navigate("PaymentMethod_List")} />
                {/* <SettingItem title="Payment Method" />
                <SettingItem title="Terms & Conditions" />
                <SettingItem title="Signature" /> */}
            </Section>

            {/* Invoice Section */}
            <Section title="Invoice">
                <SettingItem title="Clients" onPress={() => navigation.navigate("Tab2_Client")} />
                <SettingItem title="Items & Services" onPress={() => navigation.navigate("Tab3_Item")} />

                {/* <SettingItem title="Due Terms" subtitle="7 days" />
                <SettingItem
                    title="Paid show on Invoice"
                    toggle
                    toggleValue={showPaidOnInvoice}
                    onToggle={setShowPaidOnInvoice}
                /> */}
            </Section>

            {/* General Section */}
            {/* <Section title="General">
                <SettingItem title="Default Currency" subtitle="CAD $" />
                <SettingItem title="Number Format" subtitle="1,000,000.00" />
                <SettingItem title="Date Format" subtitle="31/12/2025" />
            </Section> */}

            {/* About Section */}
            {/* <Section title="About">
                <SettingItem title="Feedback" />
                <SettingItem title="Privacy Policy" />
                <SettingItem title="Rate Us" />
                <SettingItem title="Share App" />
            </Section> */}

            {/* <Text style={s_global.Setting_VersionText}>Version: {version}</Text> */}
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

