import React from "react";
import { StyleSheet, Alert, Animated, TouchableOpacity, View, Text, ScrollView, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import axios from 'axios';

import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WebView } from "react-native-webview";
import * as ImagePicker from 'expo-image-picker';
import { sharePDF, emailPDF, viewPDF, openWithExternalPDFViewer, genPDF } from '@/src/utils/genPDF'; // adjust path

import { Ionicons } from '@expo/vector-icons';

import { genHTML } from "@/src/utils/genHTML";
import { useInvoiceCrud } from '@/src/db/useInvoiceCrud';
import { s_global, s_fab, colors } from "@/src/constants";
import { Inv1Me, Inv2Client, Inv3Items, Inv4Total, Inv5Notes } from "@/src/screens/invoice";
import { DetailStackPara, ClientDB, RouteType, InvDB } from "@/src/types";
import { useInvStore, useInvItemListStore, useBizStore } from '@/src/stores/useInvStore';

import { TooltipBubble } from "@/src/components/toolTips";
import { useTipVisibility } from '@/src/hooks/useTipVisibility';
import { M_TemplatePicker, M_Confirmation } from "@/src/modals";

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export const Inv_Form: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<DetailStackPara>>();
    const mode = useRoute<RouteType<'Tab2_Client_Form'>>().params?.mode ?? 'create_new';
    const isSavingRef = React.useRef(false);

    const [tip2Trigger, setTip2Trigger] = React.useState(false);
    const tip2 = useTipVisibility('tip2_count', tip2Trigger, 3000);
    const tip2Ref = React.useRef<View>(null);
    const [showTooltip, setShowTooltip] = React.useState(true);
    const [showTemplateModal, setShowTemplateModal] = React.useState(false);

    const { oInv, setOInv, isDirty, setIsDirty } = useInvStore();
    const { oBiz, } = useBizStore();  // 🧠 Zustand action

    const { oInvItemList } = useInvItemListStore();
    const { saveInvoice, updateInvoice } = useInvoiceCrud();

    const [isOpen, setIsOpen] = React.useState(false);

    const saveRef = React.useRef(() => { });
    const animation = React.useRef(new Animated.Value(0)).current;

    const [showConfirm, setShowConfirm] = React.useState(false);
    const [pendingAction, setPendingAction] = React.useState<any>(null);

    const [initItem, setInitItem] = React.useState<InvDB | null>(null);
    const resetToInitialState = () => { if (initItem) { setOInv(initItem); } };

    React.useEffect(() => { setIsDirty(false); }, []);
    console.log("Invoice Form ----  ", mode, isDirty);

    const onPDF = async () => {
        try {
            const uri = await genPDF(oInv, oBiz, oInvItemList);
            await viewPDF(uri);
            // await openWithExternalPDFViewer(uri);
        } catch (err) {
            console.error("Error viewing PDF:", err);
        }
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                    {mode === 'create_new' && (
                        <TouchableOpacity onPressIn={onPDF} style={{ marginRight: 15 }}>

                            <Ionicons name="camera-outline" size={28} color="#fff" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPressOut={() => saveRef.current()}>
                        <Ionicons name="checkmark-sharp" size={32} color="#fff" />
                    </TouchableOpacity>
                </View>
            ),
            title: mode === 'create_new' ? 'New Invoice' : 'Invoice',
        });
    }, [navigation, mode]);


    if (!oInv) return <Text>Loading...</Text>;

    const handleSave = async () => {
        console.log("Saving invoice...", mode);
        isSavingRef.current = true;
        setIsDirty(false);
        if (mode === 'create_new') {
            const success = await saveInvoice();
            isSavingRef.current = false; // reset if failed
            if (success) { navigation.goBack(); }
        } else {
            const success = await updateInvoice();
            isSavingRef.current = false; // reset if failed
            if (success) { navigation.goBack(); }
        }
    };

    saveRef.current = handleSave;

    React.useEffect(() => {
        const handleBeforeRemove = (e: any) => {
            console.log("beforeRemove", isDirty, isSavingRef.current);

            // Allow navigation if saving or no changes
            if (isSavingRef.current || !isDirty) return;

            // Prevent navigation and prompt confirmation
            e.preventDefault();
            setPendingAction(() => () => navigation.dispatch(e.data.action));
            setShowConfirm(true);
        };

        const unsubscribe = navigation.addListener("beforeRemove", handleBeforeRemove);

        return unsubscribe;
    }, [navigation, isDirty]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ flexGrow: 1, padding: 16, paddingBottom: 0 }}
                    >
                        <Inv1Me />
                        <View style={{ borderBottomWidth: 1, borderColor: '#ddd', marginVertical: 18 }} />

                        <Inv2Client />

                        <Inv3Items />

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <View style={{ width: '60%' }}>
                                <Inv4Total />
                            </View>
                        </View>

                        <Inv5Notes />

                        {/* Live Preview */}

                        <View ref={tip2Ref} style={{ position: 'relative', minHeight: 600, flexShrink: 0 }}>
                            {/* Invoice Preview */}
                            <WebView
                                originWhitelist={['*']}
                                source={{ html: genHTML(oInv!, oBiz!, oInvItemList, "view", oInv!.biz_inv_template_id || 't1') }}
                                style={{ flex: 1, backgroundColor: 'transparent' }}
                                nestedScrollEnabled
                            />

                            {/* {showTip2 && <TooltipBubble />} */}
                            {tip2.visible && <TooltipBubble text="✨ Tap to change template" />}

                            {/* Clickable Overlay */}
                            <TouchableWithoutFeedback onPress={() => setShowTemplateModal(true)}>
                                <View style={StyleSheet.absoluteFillObject} />
                            </TouchableWithoutFeedback>
                        </View>
                    </ScrollView>

                    <View style={s_global.Container}>
                        <TouchableOpacity style={s_global.FABCircle} onPress={onPDF}>
                            <Text style={s_fab.menuText}>PDF</Text>
                        </TouchableOpacity>
                    </View>

                    <M_Confirmation
                        visible={showConfirm}
                        title="Discard changes?"
                        message={'You have unsaved changes. \n\nTap "Keep Editing" and use the ✅ icon in the top right corner to save.'}
                        confirmText="Discard"
                        cancelText="Keep Editing"
                        onConfirm={() => {
                            setShowConfirm(false);
                            if (pendingAction) pendingAction(); // Dispatch saved action
                        }}
                        onCancel={() => setShowConfirm(false)}
                        confirmColor="#d9534f"
                    />
                    <M_TemplatePicker
                        visible={showTemplateModal}
                        onClose={() => setShowTemplateModal(false)}
                    />

                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

// default InvForm;
