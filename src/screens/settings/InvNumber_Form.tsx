import React from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, ToastAndroid, } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { Ionicons } from '@expo/vector-icons';

import { s_global, s_inv } from "@/src/constants";
import { BE_DB } from '@/src/types';
import { useBizCrud } from "@/src/firestore/fs_crud_biz";
import { useBizStore } from '@/src/stores/BizStore';

import { uploadB64, cameraB64, processB64Me } from "@/src/utils/u_img64";
import { useInvStore } from "@/src/stores/InvStore";

export const InvNumber_Form: React.FC = () => {
    const navigation = useNavigation();
    const { fetchBiz, updateBiz } = useBizCrud();

    const { oBiz, updateOBiz, setOBiz } = useBizStore();  // 🧠 Zustand action
    const { setIsDirty, updateOInv } = useInvStore();
    const [isProcessing, setIsProcessing] = React.useState(false);

    const saveRef = React.useRef(() => { });
    const [isFocused, setIsFocused] = React.useState(false);

    // Add function to fetch and set business data
    const fetchAndSetBiz = async () => {
        try {
            const bizData = await fetchBiz();
            setOBiz(bizData || null);
        } catch (error) {
            console.error("Failed to fetch business data:", error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            setIsFocused(true);
            // Fetch business data when screen is focused
            fetchAndSetBiz();
            return () => setIsFocused(false);
        }, [])
    );

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row', marginRight: 0, alignItems: 'flex-end' }}>
                    <TouchableOpacity onPressIn={() => saveRef.current()}>
                        <Ionicons name="checkmark-sharp" size={32} color="#fff" />
                    </TouchableOpacity>
                </View>
            )
        });
    }, [navigation]);


    const handleChange = <K extends keyof BE_DB>(key: K, value: BE_DB[K]) => {
        updateOBiz({ [key]: value });
    };

    const handleSave = async () => {

        if (!oBiz?.be_name) { return; }
        try {
            console.log("BizInfo: oBiz:", oBiz);
            await updateBiz(oBiz);
            navigation.goBack();
            ToastAndroid.show('Succeed!', ToastAndroid.SHORT);
        } catch (err) {
            ToastAndroid.show('Failed!', ToastAndroid.SHORT);
        } finally {
            setIsDirty(false);

        }
    };

    saveRef.current = handleSave;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // tweak this
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Card 3: Inv Info: be_name,  */}
                    <View style={s_global.Card} >
                        <Text style={s_global.Label}>Invoice Prefix <Text style={{ color: "red" }}>*</Text></Text>
                        <TextInput style={s_global.InputGreyBackground} placeholder="INV-" placeholderTextColor="#999" multiline
                            value={oBiz?.be_inv_prefix || ''}
                            onChangeText={(text) => handleChange("be_inv_prefix", text)} />

                        <View style={{ height: 12 }} />
                        <Text style={s_global.Label}>Invoice Number</Text>
                        <TextInput style={[s_global.InputGreyBackground]} placeholder="2024" placeholderTextColor="#999" multiline
                            value={oBiz?.be_inv_number?.toString() || ''} onChangeText={(text) => handleChange("be_inv_number", Number(text))} />
                    </View>

                    {/* Card 4: place holder for input pad*/}
                    <View style={{ height: 220, opacity: 0 }} pointerEvents="none" />
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView >
    );
};
