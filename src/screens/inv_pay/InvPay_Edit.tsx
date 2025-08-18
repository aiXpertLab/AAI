import React from "react";
import { useWindowDimensions, TouchableOpacity, StyleSheet, View, Text, ScrollView, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ToastAndroid } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { WebView } from "react-native-webview";
import { Ionicons } from '@expo/vector-icons';

import { genHTML } from "@/src/utils/genHTML";

import { Inv1Me, Inv3Items, Inv4Total, Inv5Notes } from "@/src/screens/inv_new";
import { InvPay_Edit_Client } from "@/src/screens/inv_pay/InvPay_Edit_Client";
import { DetailStack, InvDB } from "@/src/types";
import { useClientStore, useInvStore, useBizStore } from '@/src/stores';
import { viewPDF, genPDF } from '@/src/utils/genPDF'; // adjust path
import { uploadB64, cameraB64, processB64Inv } from "@/src/utils/u_img64";

import { s_global, s_fab, } from "@/src/constants";
import { M_Spinning, M_TemplatePicker, M_Confirmation } from "@/src/modals";
import { TooltipBubble } from "@/src/components/toolTips";
import { useTipVisibility } from '@/src/hooks/useTipVisibility';

import { useInvCrud } from "@/src/firestore/fs_crud_inv";
import { useBizCrud } from "@/src/firestore/fs_crud_biz";

export const InvPay_Edit: React.FC = () => {
    console.log("InvPay_Edit")
    const navigation = useNavigation<NativeStackNavigationProp<DetailStack>>();
    const isSavingRef = React.useRef(false);
    const [isProcessing, setIsProcessing] = React.useState(false);

    const { oInv, isDirty, setIsDirty } = useInvStore();
    const { oBiz, updateOBiz } = useBizStore();  // 🧠 Zustand action
    const { oClient, updateOClient } = useClientStore();

    const { updateBiz } = useBizCrud();


    const { updateInv,  fetch1Inv } = useInvCrud();
    const [showTooltip, setShowTooltip] = React.useState(true);

    const saveRef = React.useRef(() => { });

    const [showConfirmModal, setShowConfirmModal] = React.useState(false);
    const [showTemplateModal, setShowTemplateModal] = React.useState(false);

    const [pendingAction, setPendingAction] = React.useState<any>(null);

    const [initItem, setInitItem] = React.useState<InvDB | null>(null);
    const [confirmMessage, setConfirmMessage] = React.useState("");
    const [confirmTitle, setConfirmTitle] = React.useState("");

    const showValidationModal = (title: string, message: string, onConfirmAction?: () => void) => {
        setConfirmTitle(title)
        setConfirmMessage(message);
        // setPendingAction(() => onConfirmAction || null);
        setShowConfirmModal(true);
    };

    const tip1 = useTipVisibility('tip1_count', true, 800);
    const [tip2Trigger, setTip2Trigger] = React.useState(false);
    const tip2 = useTipVisibility('tip2_count', tip2Trigger, 3000);
    const tip2Ref = React.useRef<View>(null);
    const { height: windowHeight } = useWindowDimensions();

    const handleScroll = () => {
        tip2Ref.current?.measure((fx, fy, width, height, px, py) => {
            const inView = py < windowHeight && py + height > 0;
            if (inView && !tip2Trigger) {
                setTip2Trigger(true);
            }
        });
    };

    React.useEffect(() => {
        const timer = setTimeout(() => setShowTooltip(false), 3000);
        return () => clearTimeout(timer);
    }, []);


    React.useEffect(() => { setIsDirty(false); }, []);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                    <TouchableOpacity onPressOut={() => saveRef.current()}>
                        <Ionicons name="checkmark-sharp" size={32} color="#fff" />
                    </TouchableOpacity>
                </View>
            ),
            title: oInv!.inv_number,

        });
    }, [navigation,]);

    const onPDF = async () => {
        try {
            // const uri = await genPDF(oInv, oBiz, oInv!.inv_items);
            // await viewPDF(uri);
            // await openWithExternalPDFViewer(uri);
        } catch (err) {
            console.error("Error viewing PDF:", err);
        }
    };

    const handleSave = async () => {
        if (!oInv) { return }
        isSavingRef.current = true;
        setIsDirty(false);

        // ✅ 4. Must have at least one item
        if (!oInv.inv_items || oInv.inv_items.length === 0) {
            console.log(oInv.inv_items)
            showValidationModal(
                'Missing Item',
                'Invoice must have at least one item. Please add items before saving.'
            );
            return
        }

        isSavingRef.current = true;
        setIsDirty(false);

        try {
            await updateInv(oInv, oInv.inv_id);
            const match = oInv.inv_number.match(/(\d+)$/); // last sequence of digits
            let newNumber = 1;
            if (match) {
                newNumber = parseInt(match[1], 10) + 1;
            }
            await updateOBiz({ be_inv_integer: newNumber });
            await updateBiz({ be_inv_integer: newNumber });

            ToastAndroid.show('Succeed!', ToastAndroid.SHORT);
            navigation.goBack(); // only runs if insertInv didn't throw
        } catch (err) {
            console.error(err);
        } finally {
            isSavingRef.current = false;
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
            showValidationModal(
                'Invalid Invoice Number',
                'Invoice number duplicated. Please change the invoice number before saving.'
            );

            setShowConfirmModal(true);
        };

        const unsubscribe = navigation.addListener("beforeRemove", handleBeforeRemove);

        return unsubscribe;
    }, [navigation, isDirty]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback
                onPress={() => {
                    Keyboard.dismiss();
                    tip1.setVisible(false);
                    tip2.setVisible(false);
                }}
            >
                <View style={{ flex: 1 }}>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ flexGrow: 1, padding: 16, paddingBottom: 0 }}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        <Inv1Me />
                        {tip1.visible && <TooltipBubble />}

                        <View style={{ borderBottomWidth: 1, borderColor: '#ddd', marginVertical: 18 }} />

                        <InvPay_Edit_Client />

                        <Inv3Items />

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <View style={{ width: '60%' }}>
                                <Inv4Total />
                            </View>
                        </View>

                        <Inv5Notes />


                        <View ref={tip2Ref} style={{ position: 'relative', minHeight: 600, flexShrink: 0 }}>
                            {/* Invoice Preview */}
                            <WebView
                                originWhitelist={['*']}
                                source={{ html: genHTML(oInv!, oBiz!, "view", oInv!.inv_template_id || 't1') }}
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
                        visible={showConfirmModal}
                        // title="Discard changes?"
                        title={confirmTitle}
                        // message={'You have unsaved changes. \n\nTap "Keep Editing" and use the ✅ icon in the top right corner to save.'}\
                        message={confirmMessage}
                        confirmText="Discard"
                        cancelText="Keep Editing"
                        onConfirm={() => {
                            setShowConfirmModal(false);
                            if (pendingAction) pendingAction();
                        }}
                        onCancel={() => setShowConfirmModal(false)}
                        confirmColor="#d9534f"
                    />

                    <M_TemplatePicker
                        visible={showTemplateModal}
                        onClose={() => setShowTemplateModal(false)}
                    />
                    <M_Spinning visible={isProcessing} />
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};