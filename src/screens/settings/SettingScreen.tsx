// src/screens/Drawer_Settings_Screen.tsx
import Constants from 'expo-constants';
const version = Constants.expoConfig?.version ?? '18.8.30';

import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { s_global } from "@/src/constants";

import { DetailStack } from "@/src/types";
import SettingItem from "./SettingItem";

const Drawer_Settings_Screen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<DetailStack>>();

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
                    toggleValue={showPaidOnInvoice}
                    onToggle={setShowPaidOnInvoice}
                />
            </Section>

            {/* General Section */}
            {/* <Section title="General">
                <SettingItem title="Default Currency" subtitle="CAD $" />
                <SettingItem title="Number Format" subtitle="1,000,000.00" />
                <SettingItem title="Date Format" subtitle="31/12/2025" />
            </Section> */}

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

