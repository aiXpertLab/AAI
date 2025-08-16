import React, { useState, useCallback, useLayoutEffect, useRef } from "react";

import { Alert, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Crypto from 'expo-crypto';

import { Ionicons } from '@expo/vector-icons';
import { s_global, colors } from "@/src/constants";
import { usePMStore } from '@/src/stores/InvStore';

import { DetailStack, PMDB, RouteType } from '@/src/types';
import { usePMCrud } from '@/src/firestore/fs_crud_pm';

export const PaymentMethod_Form: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<DetailStack>>();
    const saveRef = useRef(() => { });
    const { oPM, updateOPM, setOPM, createEmptyPM4New, clearOPM } = usePMStore();  // 🧠 Zustand action
    const { insertPM, updatePM } = usePMCrud();

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
                <TouchableOpacity onPress={() => {
                    console.log("Save button pressed");
                    saveRef.current()
                }}>
                    <Ionicons name="checkmark-sharp" size={32} color="#fff" style={{ marginRight: 15 }} />
                </TouchableOpacity>),
            title: mode === 'create_new' ? 'New Payment Method' : 'Edit Payment Method',
        });
    }, [navigation]);

    const handleChange = (field: keyof PMDB, value: string | number) => {
        console.log(`handleChange: ${field} = ${value}`);
        if (!oPM) return; // guard clause
        updateOPM({ [field]: value });
    };

    const mode = useRoute<RouteType<'CreateModify'>>().params?.mode ?? 'create_new';
    const handleSave = async () => {
        if (!oPM) return;

        const trimmedName = oPM.pm_name?.trim();
        if (!trimmedName) {
            Alert.alert("Missing Item Name", "Item name cannot be empty or just spaces.");
            return;
        }

        if (mode === 'create_new') {
            console.log("Creating new PM:", oPM);
            const pm_id = Crypto.randomUUID();

            if (!oPM.pm_id) {
                console.log("-----------Creating new PM:", pm_id);
                updateOPM({ pm_id: pm_id });
                // updateOPM({ ...oPM, pm_id: pm_id });
                const newOPM = usePMStore.getState().oPM;
                console.log("Updated oPM:++++", newOPM);
                console.log("Creating new PM:------", oPM);
            }
            try {
                await insertPM(oPM);
            } catch (err) {
                console.error('Insert failed:', err);
            }
        } else {
            try {
                await updatePM(oPM);
            } catch (err) {
                console.error('Update failed:', err);
            }
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

                        {/* Card 1: Basic Info: pm_name,  */}
                        <View style={s_global.Card} >
                            <Text style={s_global.Label}>Payment Method <Text style={{ color: "red" }}>*</Text></Text>
                            <TextInput style={s_global.InputGreyBackground} placeholder="VISA" placeholderTextColor="#999" multiline
                                value={oPM?.pm_name} onChangeText={(text) => handleChange("pm_name", text)} />

                            <Text style={s_global.Label}>Internal Note</Text>
                            <TextInput style={[s_global.InputGreyBackground, { height: 100, textAlignVertical: 'top' }]} placeholder="Note" placeholderTextColor="#999" multiline numberOfLines={5}
                                value={oPM?.pm_note} onChangeText={(text) => handleChange("pm_note", text)} />
                        </View>

                        {/* Card 4: Delete? */}
                        {mode !== "create_new" && <View style={s_global.Card} >
                            <Text style={s_global.Label}>Delete? </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: "#f5f5f5", padding: 12, borderRadius: 8, }}>
                                <TouchableOpacity
                                    onPress={() => handleChange("is_deleted", oPM?.is_deleted === 1 ? 0 : 1)}
                                    style={[s_global.DeleteBox, { backgroundColor: oPM?.is_deleted === 1 ? "#ff5252" : "#fff", }]}
                                >
                                    {oPM?.is_deleted === 1 && (<Text style={{ color: "#fff", fontWeight: "bold" }}>✓</Text>
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

