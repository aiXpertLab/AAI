// src/screens/SupportHub.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DetailStack } from "@/src/types";
import { s_global } from "@/src/constants";

const supportLinks = [
    {
        label: "Email: AIAutoInvoicing@gmail.com",
        icon: <Ionicons name="mail-outline" size={22} color="#555" />,
        action: () => Linking.openURL("mailto:aiautoinvoicing@gmail.com"),
    },
    {
        label: "Message on X",
        icon: <FontAwesome name="twitter" size={22} color="#1DA1F2" />,
        action: () => Linking.openURL("https://x.com/aiautoinvoicing"),
    },
    {
        label: "Message on Facebook",
        icon: <FontAwesome name="facebook" size={22} color="#3b5998" />,
        action: () => Linking.openURL("https://facebook.com/aiautoinvoicing"),
    },
    {
        label: "Visit our Reddit",
        icon: <FontAwesome name="reddit" size={22} color="#FF4500" />,
        action: () => Linking.openURL("https://reddit.com/r/AIAutoInvoicing"),
    },
];

export const SupportHub: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<DetailStack>>();

    return (
        <ScrollView contentContainerStyle={s_global.Container}>
            <Text style={s_global.Subtitle}>Choose a channel to reach us:</Text>

            {supportLinks.map((link, index) => (
                <TouchableOpacity key={index} style={s_global.Item} onPress={link.action}>
                    <View style={s_global.Icon}>{link.icon}</View>
                    <Text style={s_global.Support_Label}>{link.label}</Text>
                </TouchableOpacity>
            ))}

            <Text style={s_global.Note}>We usually respond within 24 hours.</Text>
        </ScrollView>
    );
};


