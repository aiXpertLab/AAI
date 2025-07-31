import React, { useState, useCallback, useRef } from "react";
import { Image, ActivityIndicator, Modal, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, Alert, } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { Picker } from "@react-native-picker/picker";
import { Ionicons } from '@expo/vector-icons';

import Toast from 'react-native-toast-message';
import { useSQLiteContext } from "expo-sqlite";

import { s_global, s_inv } from "@/src/constants";
import { BizDB } from '@/src/types';
import { updateBiz } from "@/src/db/crud_me";
import { useBizStore, useInvStore } from '@/src/stores/useInvStore';

import { pickAndSaveLogo } from '@/src/utils/logoUtils';
import { uploadB64, cameraB64, processB64Me } from "@/src/utils/u_img64";

const currencies = ["USD", "CAD", "EUR", "GBP", "OTHER"];

export const Inv1Me_BizForm: React.FC = () => {
    const db = useSQLiteContext();
    const navigation = useNavigation();

    const { oBiz, } = useBizStore();  // 🧠 Zustand action
    const { setIsDirty, updateOInv } = useInvStore();
    const [isProcessing, setIsProcessing] = React.useState(false);

    const logo = useBizStore((s) => s.oBiz?.biz_logo);
    const updateOBiz = useBizStore((s) => s.updateOBiz);

    if (!oBiz) return <Text>Loading...</Text>;

    const saveRef = useRef(() => { });
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
                <View style={{ flexDirection: 'row', marginRight: 0, alignItems: 'flex-end' }}>

                    <TouchableOpacity onPressIn={handleUploadImage} style={{ marginRight: 20 }}>
                        <Ionicons name="arrow-up" size={28} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPressIn={handleCamera} style={{ marginRight: 20 }}>
                        <Ionicons name="camera-outline" size={28} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPressOut={() => saveRef.current()}>
                        <Ionicons name="checkmark-sharp" size={32} color="#fff" />
                    </TouchableOpacity>
                </View>
            )
        });
    }, [navigation]);

    const handleUploadImage = async () => {
        const base64Image = await uploadB64();
        if (!base64Image) {
            // Optionally show an error message
            Alert.alert("Image upload failed or no image returned.");
            return;
        }
        await processB64Me(base64Image, updateOBiz, updateOInv, setIsProcessing);
    }

    const handleCamera = async () => {
        const base64Image = await cameraB64();
        if (!base64Image) {
            // Optionally show an error message
            Alert.alert("Image capture failed or no image returned.");
            return;
        }
        await processB64Me(base64Image, updateOBiz, updateOInv, setIsProcessing);
    };

    const handleChange = <K extends keyof BizDB>(key: K, value: BizDB[K]) => {
        updateOBiz({ [key]: value });
        updateOInv({ [key]: value });
    };

    const handleSave = async () => {
        if (!oBiz?.biz_name) {
            Alert.alert("Business name is required.");
            return;
        }

        setIsDirty(true);

        const success = await updateBiz(db, oBiz);
        if (success) {
            updateOInv({
                biz_bk: "biz_bk",
                biz_id: oBiz.id ?? 1,
                biz_logo: oBiz.biz_logo,
                biz_name: oBiz.biz_name,
                biz_address: oBiz.biz_address,
                biz_email: oBiz.biz_email,
                biz_phone: oBiz.biz_phone,
                biz_biz_number: oBiz.biz_biz_number,
                biz_tax_id: oBiz.biz_tax_id,
                biz_bank_info: oBiz.biz_bank_info,
            });

            Toast.show({ type: 'success', text1: 'Saved!', text2: 'Business info updated.', position: 'bottom', });
            navigation.goBack();
        } else {
            alert("Failed to save business info.");
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
                        keyboardShouldPersistTaps="handled"                    >

                        <View style={[s_global.Container, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
                            <TouchableOpacity style={[s_inv.LogoBoxBig,]} onPress={() => pickAndSaveLogo(db)}>
                                {oBiz?.biz_logo ? (
                                    <Image source={{ uri: logo }} style={s_inv.LogoBoxBig} resizeMode="cover" />
                                ) : (
                                    <View style={s_inv.LogoBoxBig}>
                                        <Text style={{ color: "#999" }}>+ Logo here.</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Card 1: Basic Info: biz_name,  */}
                        <View style={s_global.Card} >
                            <Text style={s_global.Label}>Business Name <Text style={{ color: "red" }}>*</Text></Text>
                            <TextInput style={s_global.InputGreyBackground} placeholder="Biz Name" placeholderTextColor="#999" multiline
                                value={oBiz?.biz_name || ''}
                                onChangeText={(text) => handleChange("biz_name", text)} />

                            <View style={{ height: 12 }} />
                            <Text style={s_global.Label}>Business Address</Text>
                            <TextInput style={[s_global.InputGreyBackground]} placeholder="Address" placeholderTextColor="#999" multiline
                                value={oBiz?.biz_address} onChangeText={(text) => handleChange("biz_address", text)} />

                            <View style={{ height: 12 }} />
                            <Text style={s_global.Label}>Email</Text>
                            <TextInput style={[s_global.InputGreyBackground]} placeholder="Email" placeholderTextColor="#999"
                                value={oBiz?.biz_email} onChangeText={(text) => handleChange("biz_email", text)} />

                            <View style={{ height: 12 }} />
                            <Text style={s_global.Label}>Phone</Text>
                            <TextInput style={[s_global.InputGreyBackground]} placeholder="Phone" placeholderTextColor="#999"
                                value={oBiz?.biz_phone} onChangeText={(text) => handleChange("biz_phone", text)} />

                            <View style={{ height: 12 }} />
                            <Text style={s_global.Label}>Business Number</Text>
                            <TextInput style={[s_global.InputGreyBackground]} placeholder="Business Number" placeholderTextColor="#999"
                                value={oBiz?.biz_biz_number} onChangeText={(text) => handleChange("biz_biz_number", text)} />

                        </View>

                        {/* Card 2: Fin Info: biz_name,  */}
                        <View style={s_global.Card} >
                            <Text style={s_global.Label}>Base Currency</Text>
                            <View style={s_global.Picker}>
                                <Picker
                                    selectedValue={oBiz?.biz_currency}
                                    onValueChange={(itemValue) => handleChange("biz_currency", itemValue)}
                                    mode="dropdown" // Android only
                                >
                                    {currencies.map((currency) => (
                                        <Picker.Item
                                            key={currency}
                                            label={currency}
                                            value={currency}
                                            style={{ fontSize: 14 }} // Android only
                                        />
                                    ))}
                                </Picker>
                            </View>

                            <View style={{ height: 12 }} />
                            <Text style={s_global.Label}>Bank Info</Text>
                            <TextInput style={[s_global.InputGreyBackground, { height: 100, textAlignVertical: 'top' }]} placeholder="Bank Info" placeholderTextColor="#999" multiline numberOfLines={5}
                                value={oBiz?.biz_bank_info} onChangeText={(text) => handleChange("biz_bank_info", text)} />

                            <View style={{ height: 12 }} />
                            <Text style={s_global.Label}>Description</Text>
                            <TextInput style={[s_global.InputGreyBackground, { height: 100, textAlignVertical: 'top' }]} placeholder="Description" placeholderTextColor="#999" multiline numberOfLines={5}
                                value={oBiz?.biz_description} onChangeText={(text) => handleChange("biz_description", text)} />
                        </View>
                        {isProcessing && (
                            <Modal
                                transparent={true}
                                animationType="fade"
                                visible={isProcessing}
                                onRequestClose={() => { }}
                            >
                                <View style={{
                                    flex: 1,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <View style={{
                                        backgroundColor: '#fff',
                                        padding: 20,
                                        borderRadius: 10,
                                        alignItems: 'center',
                                    }}>
                                        <ActivityIndicator size="large" color="#0000ff" />
                                        <Text style={{ marginTop: 10 }}>Processing...</Text>
                                    </View>
                                </View>
                            </Modal>
                        )}
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView >
    );
};
