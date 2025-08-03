import React from "react";
import { Alert, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, Modal, ActivityIndicator, } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useItemStore } from '@/src/stores/useItemStore';
import { useItemCrud } from '@/src/db/crud_item';

import styles from "@/src/constants/styles";
import { s_global, } from "@/src/constants";
import { ItemDB, DetailStackPara, RouteType } from "@/src/types";
import { Ionicons } from '@expo/vector-icons';

import { cameraB64, processB64Item } from "@/src/utils/u_img64";

import { formatDecimalInput, formatDecimalOnBlur } from '@/src/utils/Number.99';
import { M_Confirmation, } from "@/src/modals";

const ItemForm: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<DetailStackPara>>();
    const saveRef = React.useRef(() => { });
    const isSavingRef = React.useRef(false);
    const [showConfirm, setShowConfirm] = React.useState(false);
    const [pendingAction, setPendingAction] = React.useState<any>(null);
    const [isProcessing, setIsProcessing] = React.useState(false);

    const { insertItem, updateItem } = useItemCrud();

    const { oItem, setOItem, updateOItem } = useItemStore();  // 🧠 Zustand action

    const [rateText, setRateText] = React.useState(
        oItem?.item_rate !== undefined ? String(oItem.item_rate) : ''
    );

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row', marginRight: 10, alignItems: 'flex-end' }}>

                    <TouchableOpacity onPressOut={() => saveRef.current()}>
                        <Ionicons name="checkmark-sharp" size={32} color="#fff" />
                    </TouchableOpacity>
                </View>

            )
        });
    }, [navigation]);

    const handleChange = (field: keyof ItemDB, value: string | number) => {
        if (!oItem) return; // guard clause
        updateOItem({ [field]: value });
    };

    const mode = useRoute<RouteType<'Tab2_Client_Form'>>().params?.mode ?? 'create_new';
    const handleSave = async () => {
        if (!oItem) return;

        const trimmedName = oItem.item_name?.trim();
        if (!trimmedName) {
            Alert.alert("Missing Item Name", "Item name cannot be empty or just spaces.");
            return;
        }

        isSavingRef.current = true;

        if (mode === 'create_new') {
            insertItem(oItem, () => { navigation.goBack(); }, (err) => {
                console.error('Insert failed:', err);
                isSavingRef.current = false; // reset if failed
            }
            );
        } else {
            updateItem(oItem, () => { navigation.goBack(); }, (err) => {
                console.error('Insert failed:', err);
                isSavingRef.current = false; // reset if failed
            }
            );
        }
    };

    saveRef.current = handleSave;

    const [initItem, setInitItem] = React.useState<ItemDB | null>(null);
    const resetToInitialState = () => { if (initItem) { setOItem(initItem); } };

    React.useEffect(() => {
        // Snapshot the list when the screen is mounted
        setInitItem(JSON.parse(JSON.stringify(oItem)));
    }, []);

    const hasUnsavedChanges = JSON.stringify(oItem) !== JSON.stringify(initItem);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener("beforeRemove", (e) => {
            if (isSavingRef.current || !hasUnsavedChanges) return;

            e.preventDefault();
            setPendingAction(() => () => navigation.dispatch(e.data.action)); // Save action for later
            setShowConfirm(true);
        });

        return unsubscribe;
    }, [navigation, hasUnsavedChanges]);

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

                        {/* Card 1: Basic Info */}
                        <View style={s_global.Card} >
                            <Text style={s_global.Label}>
                                Item Name <Text style={{ color: "red" }}>*</Text>
                            </Text>
                            <TextInput
                                style={s_global.Input}
                                placeholder="Item Name"
                                placeholderTextColor="#999"
                                multiline
                                value={oItem?.item_name}
                                onChangeText={(text) => handleChange("item_name", text)}
                            />

                            {/* Spacer -  Rate.*/}
                            <View style={{ height: 12 }} />
                            <Text style={styles.label}>Rate</Text>
                            <TextInput
                                style={s_global.Input}
                                placeholder={
                                    typeof oItem?.item_rate === 'number'
                                        ? "$" + oItem.item_rate.toFixed(2)
                                        : "$0.00"
                                }
                                placeholderTextColor="#999"
                                keyboardType="decimal-pad"
                                value={
                                    typeof oItem?.item_rate === 'number'
                                        ? "$" + oItem.item_rate.toFixed(2)
                                        : "$" + String(oItem?.item_rate)
                                }
                                onChangeText={(text) => {
                                    handleChange("item_rate", formatDecimalInput(text)); // Format as they type
                                }}
                                onBlur={() => {
                                    if (oItem && oItem.item_rate !== undefined) {
                                        handleChange("item_rate", formatDecimalOnBlur(String(oItem.item_rate))); // Round on blur
                                    }
                                }}
                            />


                            <View style={{ height: 12 }} />

                            <Text style={s_global.Label}>Unit of Measure</Text>
                            <TextInput
                                style={s_global.Input}
                                placeholder="piece, kg, m, etc."
                                placeholderTextColor="#999"
                                value={oItem?.item_unit}
                                onChangeText={(text) => handleChange("item_unit", text)}
                            />

                            <View style={{ height: 12 }} />

                            <Text style={s_global.Label}>SKU</Text>
                            <TextInput
                                style={s_global.Input}
                                placeholder="MH792AM/A"
                                placeholderTextColor="#999"
                                value={oItem?.item_sku}
                                onChangeText={(text) => handleChange("item_sku", text)}
                            />
                        </View>


                        {/* Card 2: Contact */}
                        <View style={s_global.Card} >
                            <Text style={s_global.Label}>Item Description</Text>
                            <TextInput
                                style={[s_global.Input, { minHeight: 80, textAlignVertical: 'top' }]}
                                placeholder="Description"
                                placeholderTextColor="#999"
                                multiline
                                value={oItem?.item_description}
                                onChangeText={(text) => handleChange("item_description", text)}
                            />


                        </View>
                        {/* Card 4: Delete? */}
                        {mode !== "create_new" && <View style={s_global.Card} >
                            <Text style={s_global.Label}>Delete? </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: "#f5f5f5", padding: 12, borderRadius: 8, }}>
                                <TouchableOpacity
                                    onPress={() => handleChange("is_deleted", oItem?.is_deleted === 1 ? 0 : 1)}
                                    style={[s_global.DeleteBox, { backgroundColor: oItem?.is_deleted === 1 ? "#ff5252" : "#fff", }]}
                                >
                                    {oItem?.is_deleted === 1 && (<Text style={{ color: "#fff", fontWeight: "bold" }}>✓</Text>
                                    )}
                                </TouchableOpacity>
                                <Text style={{ fontSize: 16 }}>Yes, delete this item</Text>
                            </View>
                        </View>
                        }

                    </ScrollView>
                    <M_Confirmation
                        visible={showConfirm}
                        title="Discard changes?"
                        message="You have unsaved changes. Are you sure you want to discard them and leave?"
                        confirmText="Discard"
                        cancelText="Keep Editing"
                        onConfirm={() => {
                            setShowConfirm(false);
                            if (pendingAction) pendingAction(); // Dispatch saved action
                        }}
                        onCancel={() => setShowConfirm(false)}
                        confirmColor="#d9534f"
                    // onConfirm={handleConfirmRestore}
                    // confirmColor="#4CAF50"
                    />

                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView >
    );
};

export default ItemForm;