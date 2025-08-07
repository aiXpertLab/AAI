import React, { useState, useCallback, useLayoutEffect, useRef } from "react";
import Toast from 'react-native-toast-message';

import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { useSQLiteContext } from "expo-sqlite";

import { Ionicons } from '@expo/vector-icons';
import { s_global, colors } from "@/src/constants";

import { TaxDB } from '@/src/types';
import { useTaxCrud } from "@/src/firestore/fs_crud_tax";

export const Inv4Total_TaxForm: React.FC = () => {
    const db = useSQLiteContext();
    const navigation = useNavigation();
    const saveRef = useRef(() => { });

    const [isFocused, setIsFocused] = useState(false);

    const [tax, setTax] = useState(
        {
            tax_name: "",
            tax_rate: "",
            tax_number: "",
            tax_note: "",
            tax_status: "active", // default active
        }
    );

    useFocusEffect(
        useCallback(() => {
            setIsFocused(true);
            return () => setIsFocused(false);
        }, [])
    );


    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPressIn={() => saveRef.current()}>
                    <Ionicons name="checkmark-sharp" size={32} color="#fff" style={{ marginRight: 15 }} />
                </TouchableOpacity>)
        });
    }, [navigation]);

    const handleChange = (key: keyof TaxDB, value: any) => {
        setTax(prev => prev ? { ...prev, [key]: value } : prev);
    };

    const handleSave = async () => {
        if (!tax?.tax_name) {
            alert("Tax name is required.");
            return;
        }

        const success = await insertTax(db, tax);

        if (success) {
            Toast.show({ type: 'success', text1: 'Saved!', text2: 'Tax updated.' });
            navigation.goBack();
        } else {
            alert("Failed .");
        }
    };

    saveRef.current = handleSave;

    return (

        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <ScrollView
                        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                        keyboardShouldPersistTaps="handled"
                    >

                        {/* Card 1: Basic Info: tax_name,  */}
                        <View style={s_global.Card} >
                            <Text style={s_global.Label}>Tax Name <Text style={{ color: "red" }}>*</Text></Text>
                            <TextInput style={s_global.InputGreyBackground} placeholder="e.g. HST" placeholderTextColor="#999" multiline
                                value={tax?.tax_name} onChangeText={(text) => handleChange("tax_name", text)} />

                            <View style={{ marginTop: 12 }}>
                                <Text style={s_global.Label}>Tax Rate</Text>
                                <View style={[s_global.InputGreyBackground, { flexDirection: 'row', alignItems: 'center', paddingRight: 10 }]}>
                                    <TextInput
                                        style={{ flex: 1, color: "#333", fontSize: 16 }}
                                        placeholder="e.g. 13"
                                        placeholderTextColor="#999"
                                        keyboardType="numeric"
                                        value={tax?.tax_rate?.toString() || ''}
                                        onChangeText={(text) => {
                                            const numeric = text.replace(/[^\d.]/g, ''); // Strip anything not number or dot
                                            handleChange("tax_rate", numeric);
                                        }}
                                    />
                                    <Text style={{ color: "#555", fontSize: 16 }}>%</Text>
                                </View>
                            </View>

                            <View style={{ height: 12 }} />
                            <Text style={s_global.Label}>Tax number (optional) </Text>
                            <TextInput style={[s_global.InputGreyBackground]} placeholder="e.g. 1234567RT001" placeholderTextColor="#999"
                                value={tax?.tax_number} onChangeText={(text) => handleChange("tax_number", text)} />

                        </View>

                        {/* Card 2: Fin Info: tax_name,  */}
                        <View style={s_global.Card} >

                            <View style={{ height: 12 }} />
                            <Text style={s_global.Label}>Internal Note</Text>
                            <TextInput style={[s_global.InputGreyBackground, { height: 100, textAlignVertical: 'top' }]} placeholder="Note" placeholderTextColor="#999" multiline numberOfLines={5}
                                value={tax?.tax_note} onChangeText={(text) => handleChange("tax_note", text)} />

                        </View>

                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView >
    );

};
