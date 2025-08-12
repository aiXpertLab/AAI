import React from "react";
import { ActivityIndicator, Modal, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, Alert, } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Ionicons } from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";

import { useClientStore } from '@/src/stores/';
import { useClientCrud } from '@/src/firestore/fs_crud_client';

import { s_global } from "@/src/constants";
import { DetailStack, ClientDB,  } from "@/src/types";
import { M_Confirmation, M_Payment_Add } from "@/src/modals";
import { uploadB64, cameraB64, processB64Client } from "@/src/utils/u_img64";
import { TooltipBubble } from "@/src/components/toolTips";
import { useTipVisibility } from '@/src/hooks/useTipVisibility';

const currencies = ["USD", "CAD", "EUR", "GBP", "OTHER"];

const ClientForm: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<DetailStack>>();
    const saveRef = React.useRef(() => { });
    const isSavingRef = React.useRef(false);
    const [isProcessing, setIsProcessing] = React.useState(false);

    const { oClient, updateOClient } = useClientStore();  // 🧠 Zustand action
    const [isDirty, setIsDirty] = React.useState(false);
    const [showConfirm, setShowConfirm] = React.useState(false);
    const [pendingAction, setPendingAction] = React.useState<any>(null);

    const { insertClient, updateClient } = useClientCrud();

    const [showTooltip, setShowTooltip] = React.useState(true);
    const tip1 = useTipVisibility('tip1_count', true, 2000);

    React.useEffect(() => {
        const timer = setTimeout(() => setShowTooltip(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleUploadImage = async () => {
        const base64Image = await uploadB64();
        await processB64Client(base64Image, updateOClient, setIsProcessing);
    }

    const handleCamera = async () => {
        const base64Image = await cameraB64();
        await processB64Client(base64Image, updateOClient, setIsProcessing);
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                mode === 'create_new' ? (
                    <View style={{ flexDirection: 'row', marginRight: 10, alignItems: 'flex-end' }}>

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
                ) : (
                    <TouchableOpacity onPressIn={() => saveRef.current()}>
                        <Ionicons name="checkmark-sharp" size={32} color="#fff" style={{ marginRight: 15 }} />
                    </TouchableOpacity>
                )
            ),
            title: mode === 'create_new' ? 'New Client' : 'Client',
        });
    }, [navigation, mode]);


    const handleChange = (field: keyof ClientDB, value: string | number) => {
        if (!oClient) return; // guard clause
        setIsDirty(true);
        updateOClient({ [field]: value });
    };


    const handleSave = async () => {
        if (!oClient) return;

        const trimmedName = oClient.client_company_name?.trim();
        if (!trimmedName) {
            Alert.alert("Missing Client Name", "Client name cannot be empty or just spaces.");
            return;
        }

        isSavingRef.current = true; // Set before any navigation
        setIsDirty(false); // Optionally reset dirty flag

        if (mode === 'create_new') {
            insertClient(oClient, () => { navigation.goBack(); }, (err) => {
                console.error('Insert failed:', err);
                isSavingRef.current = false; // reset if failed
                setIsDirty(true); // flag dirty again if save failed
            }
            );
        } else {
            console.log("Updating client:", oClient);
            updateClient(oClient, () => { navigation.goBack(); }, (err) => {
                console.error('Insert failed:', err);
                isSavingRef.current = false; // reset if failed
                setIsDirty(true); // flag dirty again if save failed
            }
            );
        }
    };


    // Navigation guard
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (isSavingRef.current || !isDirty) {
                return; // allow navigation
            }

            // Prevent default behavior of leaving the screen
            e.preventDefault();
            setPendingAction(() => () => navigation.dispatch(e.data.action)); // Save action for later
            setShowConfirm(true);
        });

        return unsubscribe;
    }, [navigation, isDirty]);


    saveRef.current = handleSave;

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}        >
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); tip1.setVisible(false); }}            >

                <View style={{ flex: 1 }}>
                    <ScrollView
                        contentContainerStyle={{ padding: 8, paddingBottom: 100 }}
                        keyboardShouldPersistTaps="handled"
                    >

                        {/* Card 1: Basic Info */}
                        <View style={s_global.Card} >
                            <Text style={s_global.Label}>Client Name <Text style={{ color: "red" }}>*</Text></Text>
                            <TextInput
                                style={s_global.Input} placeholder="Client Name" placeholderTextColor="#999" multiline
                                value={oClient?.client_company_name || ''}
                                onChangeText={(text) => handleChange("client_company_name", text)}
                            />

                            {/* Label: Address */}
                            <View style={{ height: 12 }} /><Text style={s_global.Label}>Business Number</Text>
                            <TextInput style={[s_global.Input,]} placeholder="Business Number" placeholderTextColor="#999"
                                value={oClient?.client_business_number}
                                onChangeText={(text) => handleChange("client_business_number", text)}
                            />

                            {/* Label: Address */}
                            <View style={{ height: 12 }} />
                            <Text style={s_global.Label}>Address</Text>
                            <TextInput style={[s_global.Input, { minHeight: 80, textAlignVertical: 'top' },]} placeholder="Client Address" placeholderTextColor="#999" multiline
                                value={oClient?.client_address}
                                onChangeText={(text) => handleChange("client_address", text)}
                            />
                        </View>

                        {/* Card 2: Contact */}
                        <View style={s_global.Card}>
                            <Text style={s_global.Label}>Contact Name</Text>
                            <TextInput style={[s_global.Input]} placeholder="Contact Name" placeholderTextColor="#999"
                                value={oClient?.client_contact_name}
                                onChangeText={(text) => handleChange("client_contact_name", text)}
                            />

                            <Text style={s_global.Label}>Contact Title</Text>
                            <TextInput style={[s_global.Input]} placeholder="Contact Title" placeholderTextColor="#999"
                                value={oClient?.client_contact_title}
                                onChangeText={(text) => handleChange("client_contact_title", text)}
                            />

                            <View style={{ height: 12 }} />
                            <Text style={s_global.Label}>Email</Text>
                            <TextInput style={s_global.Input} placeholder=" Contact Email" placeholderTextColor="#999" keyboardType="email-address"
                                value={oClient?.client_email}
                                onChangeText={(text) => handleChange("client_email", text)}
                            />

                            <View style={{ height: 12 }} />
                            <Text style={s_global.Label}>Main Phone</Text>
                            <TextInput style={s_global.Input} placeholder="Main Phone" placeholderTextColor="#999" keyboardType="phone-pad"
                                value={oClient?.client_mainphone}
                                onChangeText={(text) => handleChange("client_mainphone", text)}
                            />

                            <View style={{ height: 12 }} />
                            <Text style={s_global.Label}>Second Phone</Text>
                            <TextInput style={s_global.Input} placeholder="Second Phone" placeholderTextColor="#999" keyboardType="phone-pad"
                                value={oClient?.client_secondphone}
                                onChangeText={(text) => handleChange("client_secondphone", text)}
                            />

                            <View style={{ height: 12 }} />
                            <Text style={s_global.Label}>Fax</Text>
                            <TextInput style={s_global.Input} placeholder="Fax" placeholderTextColor="#999" keyboardType="phone-pad"
                                value={oClient?.client_fax}
                                onChangeText={(text) => handleChange("client_fax", text)}
                            />
                        </View>

                        {/* Card 3: Financial & Meta */}
                        <View style={s_global.Card} >
                            <Text style={s_global.Label}>Currency</Text>
                            <View style={s_global.Picker}>
                                <Picker
                                    selectedValue={oClient?.client_currency}
                                    onValueChange={(itemValue) => handleChange("client_currency", itemValue)}
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
                            <Text style={s_global.Label}>Payment Term</Text>
                            <View style={[s_global.Input, { flexDirection: "row", alignItems: "center", paddingVertical: 0, height: 48 }]}>
                                <TextInput style={{ flex: 1, paddingVertical: 0 }} keyboardType="numeric" placeholder="30" placeholderTextColor="#999"
                                    value={oClient?.client_payment_term != null ? String(oClient.client_payment_term) : ""}
                                    onChangeText={(text) => handleChange("client_payment_term", text)}
                                />
                                <Text style={{ color: "#555", marginLeft: 4 }}>days</Text>
                            </View>

                            <View style={{ height: 12 }} />
                            <Text style={s_global.Label}>Terms & Conditions</Text>
                            <TextInput
                                style={[s_global.Input, { minHeight: 80, textAlignVertical: 'top' }]}
                                placeholder="Terms & Conditions"
                                placeholderTextColor="#999"
                                multiline
                                value={oClient?.client_terms_conditions}
                                onChangeText={(text) => handleChange("client_terms_conditions", text)}
                            />
                            <View style={{ height: 12 }} />
                            <Text style={s_global.Label}>Internal Notes</Text>
                            <TextInput
                                style={[s_global.Input, { minHeight: 80, textAlignVertical: 'top' }]}
                                placeholder="Notes"
                                placeholderTextColor="#999"
                                multiline
                                value={oClient?.client_note}
                                onChangeText={(text) => handleChange("client_note", text)}
                            />
                        </View>

                        {/* Card 4: Delete? */}
                        {mode !== "create_new" && <View style={s_global.Card}>
                            <Text style={s_global.Label}>Delete? </Text>

                            <View style={s_global.Delete_View}
                            >
                                <TouchableOpacity
                                    onPress={() => handleChange("is_deleted", oClient?.is_deleted === 1 ? 0 : 1)}
                                    style={[s_global.Delete_TouchableOpacity, { backgroundColor: oClient?.is_deleted === 1 ? "#ff5252" : "#fff" }]}
                                >
                                    {oClient?.is_deleted === 1 && (
                                        <Text style={{ color: "#fff", fontWeight: "bold" }}>✓</Text>
                                    )}
                                </TouchableOpacity>
                                <Text style={{ fontSize: 16 }}>Yes, delete this client</Text>
                            </View>
                        </View>
                        }
                                            {/* Card 4: place holder for input pad*/}
                                            <View style={{ height: 220, opacity: 0 }} pointerEvents="none" />
                        
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
                    />
                    {tip1.visible && <TooltipBubble text="✨Pick or shoot a business card" />}

                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView >
    );
};

export default ClientForm;