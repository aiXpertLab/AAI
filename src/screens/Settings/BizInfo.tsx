import React from "react";
import { Image, ActivityIndicator, Modal, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, Alert, } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { Picker } from "@react-native-picker/picker";
import { Ionicons } from '@expo/vector-icons';

import Toast from 'react-native-toast-message';

import { s_global, s_inv } from "@/src/constants";
import { BE_DB } from '@/src/types';
import { useBizCrud } from "@/src/firestore/fs_crud_biz";
import { useInvStore, useBizStore } from '@/src/stores/InvStore';

import { pickAndSaveLogo } from '@/src/utils/logoUtils';
import { uploadB64, cameraB64, processB64Me } from "@/src/utils/u_img64";

const currencies = ["USD", "CAD", "EUR", "GBP", "OTHER"];

export const BizInfo: React.FC = () => {
    const navigation = useNavigation();
    const { updateBiz } = useBizCrud();

    const { oBiz, updateOBiz, } = useBizStore();  // 🧠 Zustand action
    const { setIsDirty, updateOInv } = useInvStore();
    const [isProcessing, setIsProcessing] = React.useState(false);
    console.log("BizInfo: oBiz:", oBiz?.be_website);

    const saveRef = React.useRef(() => { });
    const [isFocused, setIsFocused] = React.useState(false);

    useFocusEffect(
        React.useCallback(() => {
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

    const handleChange = <K extends keyof BE_DB>(key: K, value: BE_DB[K]) => {
        updateOBiz({ [key]: value });
        updateOInv({ [key]: value });
    };

    const handleSave = async () => {
        if (!oBiz?.be_name) {
            Alert.alert("Business name is required.");
            return;
        }

        setIsDirty(true);

        const success = updateBiz(
            oBiz,
            () => {
                Toast.show({
                    type: 'success',
                    text1: 'Saved!',
                    text2: 'Business info updated.',
                    position: 'bottom',
                });

                navigation.goBack();
            },
            (err) => {
                alert("Failed to save business info.");
            }
        );
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
                            <TouchableOpacity style={[s_inv.LogoBoxBig,]} onPress={() => pickAndSaveLogo(updateBiz, updateOBiz)}>
                                {oBiz?.be_logo ? (
                                    <Image source={{ uri: oBiz.be_logo }} style={s_inv.LogoBoxBig} resizeMode="cover" />
                                ) : (
                                    <View style={s_inv.LogoBoxBig}>
                                        <Text style={{ color: "#999" }}>+ Logo here.</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Card 1: Basic Info: be_name,  */}
                        <View style={s_global.Card} >
                            <Text style={s_global.Label}>Business Name <Text style={{ color: "red" }}>*</Text></Text>
                            <TextInput style={s_global.InputGreyBackground} placeholder="Biz Name" placeholderTextColor="#999" multiline
                                value={oBiz?.be_name || ''}
                                onChangeText={(text) => handleChange("be_name", text)} />

                            <View style={{ height: 12 }} />
                            <Text style={s_global.Label}>Business Address</Text>
                            <TextInput style={[s_global.InputGreyBackground]} placeholder="Address" placeholderTextColor="#999" multiline
                                value={oBiz?.be_address} onChangeText={(text) => handleChange("be_address", text)} />

                            <View style={{ height: 12 }} />
                            <Text style={s_global.Label}>Email</Text>
                            <TextInput style={[s_global.InputGreyBackground]} placeholder="Email" placeholderTextColor="#999"
                                value={oBiz?.be_email} onChangeText={(text) => handleChange("be_email", text)} />

                            <View style={{ height: 12 }} />
                            <Text style={s_global.Label}>Phone</Text>
                            <TextInput style={[s_global.InputGreyBackground]} placeholder="Phone" placeholderTextColor="#999"
                                value={oBiz?.be_phone} onChangeText={(text) => handleChange("be_phone", text)} />

                            <View style={{ height: 12 }} />
                            <Text style={s_global.Label}>Business Number</Text>
                            <TextInput style={[s_global.InputGreyBackground]} placeholder="Business Number" placeholderTextColor="#999"
                                value={oBiz?.be_biz_number} onChangeText={(text) => handleChange("be_biz_number", text)} />

                        </View>

                        {/* Card 2: Fin Info: be_name,  */}
                        <View style={s_global.Card} >
                            <Text style={s_global.Label}>Base Currency</Text>
                            <View style={s_global.Picker}>
                                <Picker
                                    selectedValue={oBiz?.be_currency}
                                    onValueChange={(itemValue) => handleChange("be_currency", itemValue)}
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
                                value={oBiz?.be_bank_info} onChangeText={(text) => handleChange("be_bank_info", text)} />

                            <View style={{ height: 12 }} />
                            <Text style={s_global.Label}>Description</Text>
                            <TextInput style={[s_global.InputGreyBackground, { height: 100, textAlignVertical: 'top' }]} placeholder="Description" placeholderTextColor="#999" multiline numberOfLines={5}
                                value={oBiz?.be_description} onChangeText={(text) => handleChange("be_description", text)} />
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
