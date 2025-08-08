import React, { useState, useCallback, useLayoutEffect, useRef } from "react";
import * as Crypto from 'expo-crypto';

import { Alert, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Ionicons } from '@expo/vector-icons';
import { s_global, colors } from "@/src/constants";
import { useTaxStore } from '@/src/stores/InvStore';

import { DetailStackPara, TaxDB, RouteType } from '@/src/types';
import { useTaxCrud } from '@/src/firestore/fs_crud_tax';

export const Tax_Form: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<DetailStackPara>>();
    const saveRef = useRef(() => { });
    const { oTax, updateOTax, setOTax, createEmptyTax4New, clearOTax } = useTaxStore();  // 🧠 Zustand action
    const { insertTax, updateTax } = useTaxCrud();
    const mode = useRoute<RouteType<'CreateModify'>>().params?.mode ?? 'create_new';

    const [isFocused, setIsFocused] = useState(false);

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

    const handleChange = (field: keyof TaxDB, value: string | number) => {
        if (!oTax) return; // guard clause
        updateOTax({ [field]: value });
    };


    const handleSave = async () => {
        if (!oTax) return;

        const trimmedName = oTax.tax_name?.trim();
        if (!trimmedName) {
            Alert.alert("Missing Item Name", "Item name cannot be empty or just spaces.");
            return;
        }

        if (mode === 'create_new') {
            const tax_id = Crypto.randomUUID();
            updateOTax({ tax_id: tax_id });
            const newOTax = useTaxStore.getState().oTax;

            insertTax(oTax, () => { navigation.goBack(); }, (err) => {
                console.error('Insert failed:', err);
            }
            );
        } else {
            updateTax(oTax, () => { navigation.goBack(); }, (err) => {
                console.error('Insert failed:', err);
            }
            );
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
                            <TextInput style={s_global.InputGreyBackground} placeholder="e.g. HST" placeholderTextColor="#999"
                                value={oTax?.tax_name} onChangeText={(text) => handleChange("tax_name", text)} />

                            <View style={{ marginTop: 12 }}>
                                <Text style={s_global.Label}>Tax Rate <Text style={{ color: "red" }}>*</Text></Text>
                                <View style={[s_global.InputGreyBackground, { flexDirection: 'row', alignItems: 'center', paddingRight: 10 }]}>
                                    <TextInput
                                        style={{
                                            flex: 1,
                                            height: 24,               // <- pick a value that matches your InputGreyBackground
                                            fontSize: 16,
                                            color: "#999",
                                            paddingVertical: 0,       // remove extra vertical padding
                                            textAlignVertical: "center", // center text on Android
                                            includeFontPadding: false    // Android: removes extra font padding
                                        }}
                                        placeholder="e.g. 13"
                                        placeholderTextColor="#999"
                                        keyboardType="numeric"
                                        value={oTax?.tax_rate != null ? (oTax.tax_rate * 100).toString() : ''}
                                        onChangeText={(text) => {
                                            const numeric = text.replace(/[^\d.]/g, ''); // Strip anything not number or dot
                                            const floatVal = parseFloat(numeric);
                                            const finalVal = isNaN(floatVal) ? 0 : floatVal / 100; // convert to decimal
                                            handleChange("tax_rate", finalVal);
                                        }}
                                    />
                                    <Text style={{ color: "#555", fontSize: 16 }}>%</Text>
                                </View>
                            </View>

                            <View style={{ height: 12 }} />
                            <Text style={s_global.Label}>Tax type (optional) </Text>
                            <TextInput style={[s_global.InputGreyBackground]} placeholder="e.g. Federal" placeholderTextColor="#999"
                                value={oTax?.tax_type} onChangeText={(text) => handleChange("tax_type", text)} />

                        </View>

                        {/* Card 2: Fin Info: tax_name,  */}
                        <View style={s_global.Card} >

                            <View style={{ height: 12 }} />
                            <Text style={s_global.Label}>Internal Note</Text>
                            <TextInput style={[s_global.InputGreyBackground, { height: 100, textAlignVertical: 'top' }]} placeholder="Note" placeholderTextColor="#999" multiline numberOfLines={5}
                                value={oTax?.tax_note} onChangeText={(text) => handleChange("tax_note", text)} />
                        </View>

                        {/* Card 4: Delete? */}
                        {mode !== "create_new" && <View style={s_global.Card} >
                            <Text style={s_global.Label}>Delete? </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: "#f5f5f5", padding: 12, borderRadius: 8, }}>
                                <TouchableOpacity
                                    onPress={() => handleChange("is_deleted", oTax?.is_deleted === 1 ? 0 : 1)}
                                    style={[s_global.DeleteBox, { backgroundColor: oTax?.is_deleted === 1 ? "#ff5252" : "#fff", }]}
                                >
                                    {oTax?.is_deleted === 1 && (<Text style={{ color: "#fff", fontWeight: "bold" }}>✓</Text>
                                    )}
                                </TouchableOpacity>
                                <Text style={{ fontSize: 16 }}>Yes, delete this item</Text>
                            </View>
                        </View>
                        }
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView >
    );

};

