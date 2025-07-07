// src/screens/Drawer_Settings_Screen.tsx
import React, { useLayoutEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DetailStackPara } from "@/src/types";
import SettingItem from "@/src/screens/drawer/SettingItem";
import { s_global, colors } from "@/src/constants";

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
        <ScrollView style={styles.container}>
            {/* Business Section */}
            <Section title="Business">
                <SettingItem title="Business Info" onPress={() => navigation.navigate("Inv1Me_BizForm")} />
                <SettingItem title="Tax"  onPress={() => navigation.navigate("Tax_List")} />
                <SettingItem title="Payment Method" />
                <SettingItem title="Terms & Conditions" />
                <SettingItem title="Signature" />
            </Section>

            {/* Invoice Section */}
            <Section title="Invoice">
                <SettingItem title="Due Terms" subtitle="7 days" />
                <SettingItem
                    title="Paid show on Invoice"
                    toggle
                    toggleValue={showPaidOnInvoice}
                    onToggle={setShowPaidOnInvoice}
                />
            </Section>

            {/* General Section */}
            <Section title="General">
                <SettingItem title="Default Currency" subtitle="CAD $" />
                <SettingItem title="Number Format" subtitle="1,000,000.00" />
                <SettingItem title="Date Format" subtitle="31/12/2025" />
            </Section>

            {/* About Section */}
            <Section title="About">
                <SettingItem title="Help Us Translate" />
                <SettingItem title="Feedback" />
                <SettingItem title="Privacy Policy" />
                <SettingItem title="Rate Us" />
                <SettingItem title="Share App" />
            </Section>

            <Text style={styles.versionText}>Version: 1.02.26.0503</Text>
        </ScrollView>
    );
};

export default Drawer_Settings_Screen;

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
        <Text style={s_global.Label}>{title}</Text>
        {children}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F9FB',
        padding: 16,
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#3B82F6',
        marginBottom: 8,
    },
    versionText: {
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 13,
        marginBottom: 20,
    },
});
