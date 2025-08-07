// src/screens/Drawer_Settings_Screen.tsx
import Constants from 'expo-constants';
const version = Constants.expoConfig?.version ?? '18.8.30';

import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { s_global } from "@/src/constants";

import { DetailStackPara } from "@/src/types";
import SettingItem from "./SettingItem";
import { useBizCrud } from '@/src/firestore/fs_crud_biz';
import { useBizStore } from '@/src/stores/InvStore';

const Drawer_Settings_Screen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<DetailStackPara>>();
    const { fetchBiz } = useBizCrud();
    const { setOBiz, oBiz } = useBizStore();

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
                <SettingItem title="Business Info" onPress={async () => {
                    if (!oBiz) {
                        const data = await fetchBiz();
                        console.log('Fetched bizData:', data?.be_address);
                        setOBiz(data || null);
                        console.log('Current oBiz:', useBizStore.getState().oBiz?.be_address);
                    }
                    navigation.navigate("BizInfo");
                }} />
                <SettingItem title="Tax" onPress={() => navigation.navigate("Tax_List")} />
                <SettingItem title="Payment Method" onPress={() => navigation.navigate("PaymentMethod_List")} />
                {/* <SettingItem title="Payment Method" />
                <SettingItem title="Terms & Conditions" />
                <SettingItem title="Signature" /> */}
            </Section>

            {/* Invoice Section */}
            <Section title="Invoice">
                <SettingItem title="Clients" onPress={() => navigation.navigate("Client_List")} />
                <SettingItem title="Items & Services" onPress={() => navigation.navigate("Item_List")} />

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

            {__DEV__ && (
                <Section title="Dev">
                    <SettingItem title="Seed" onPress={() => navigation.navigate("SeedBizScreen")} />
                </Section>
            )}

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

