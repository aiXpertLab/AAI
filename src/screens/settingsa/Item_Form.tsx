import React from "react";
import { Alert, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, Modal, ActivityIndicator, } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useItemStore } from '@/src/stores/ItemStore';
import { useItemCrud } from '@/src/firestore/fs_crud_item';

import { s_global, } from "@/src/constants";
import { ItemDB_ExcludeID, ItemDB, DetailStackPara, RouteType } from "@/src/types";
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
    const mode = useRoute<RouteType<'CreateModify'>>().params?.mode ?? 'create_new';

    const { insertItem, updateItem } = useItemCrud();

    const { oItem, setOItem, updateOItem } = useItemStore();  // 🧠 Zustand action

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


    const handleSave = async () => {
        if (!oItem) return;

        const trimmedName = oItem.item_name?.trim();
        if (!trimmedName) {
            Alert.alert("Missing Item Name", "Item name cannot be empty or just spaces.");
            return;
        }

        isSavingRef.current = true;

        const preparedItem: ItemDB_ExcludeID = {
            ...oItem,
            
            item_rate: oItem.item_rate ? Number(oItem.item_rate) : 1, // convert here
            item_name: oItem.item_name ?? "",
        };


        if (mode === 'create_new') {
            console.log('333', oItem)
            insertItem(preparedItem, () => { navigation.goBack(); }, (err) => {
                console.error('Insert failed:', err);
                isSavingRef.current = false; // reset if failed
            }
            );
        } else {
            updateItem(preparedItem, () => { navigation.goBack(); }, (err) => {
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
                                Name <Text style={{ color: "red" }}>*</Text>
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
                            <Text style={s_global.Label}>Rate <Text style={{ color: "red" }}>*</Text>                           </Text>
                            <TextInput
                                style={s_global.Input}
                                placeholder="$9.99"
                                placeholderTextColor="#999"
                                keyboardType="decimal-pad"
                                value={
                                    oItem?.item_rate !== undefined
                                        ? String(oItem.item_rate)
                                        : ""
                                }
                                onFocus={() => handleChange("item_rate", "")} // Clear on focus
                                onChangeText={(text) => handleChange("item_rate", text)}
                                onBlur={() => {
                                    const num = parseFloat(String(oItem?.item_rate));
                                    if (!isNaN(num)) {
                                        handleChange("item_rate", num.toFixed(2));
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