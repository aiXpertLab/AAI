import React from "react";
import { useWindowDimensions, TouchableOpacity, StyleSheet, View, Text, ScrollView, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ToastAndroid, Alert } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { WebView } from "react-native-webview";
import { Ionicons } from '@expo/vector-icons';

import { genHTML } from "@/src/utils/genHTML";
import { viewPDF, genPDF } from '@/src/utils/genPDF'; // adjust path
import { uploadB64, cameraB64, processB64Inv } from "@/src/utils/u_img64";

import { Inv1Me, Inv2Client, Inv3Items, Inv4Total, Inv5Notes } from "@/src/screens/inv_new";

import { DetailStack, InvDB } from "@/src/types";
import { useClientStore, useItemStore, useInvStore, useBizStore } from '@/src/stores';
import { s_global, s_fab, } from "@/src/constants";
import { M_Spinning, M_TemplatePicker, M_Confirmation } from "@/src/modals";
import { TooltipBubble } from "@/src/components/toolTips";
import { useTipVisibility } from '@/src/hooks/useTipVisibility';

import { useInvCrud } from "@/src/firestore/fs_crud_inv";
import { useBizCrud } from "@/src/firestore/fs_crud_biz";
import { useItemCrud } from "@/src/firestore/fs_crud_item";

import { emptyItem } from '@/src/stores/seeds4store';

export const InvNew: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<DetailStack>>();
    const isSavingRef = React.useRef(false);
    const [isProcessing, setIsProcessing] = React.useState(false);

    const { oInv, updateOInv, isDirty, setIsDirty } = useInvStore();
    const { oBiz, updateOBiz } = useBizStore();  // 🧠 Zustand action
    const { oClient, updateOClient } = useClientStore();
    const { createEmptyItem4New, oItem } = useItemStore();

    const { updateBiz } = useBizCrud();


    const { insertInv, fetch1Inv } = useInvCrud();
    const { fetch1Item } = useItemCrud();
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

    const handleUploadImage = async () => {
        const base64Image = await uploadB64();
        await processB64Inv(base64Image, setIsProcessing);
    }

    const handleCamera = async () => {
        const base64Image = await cameraB64();
        await processB64Inv(base64Image, setIsProcessing);
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
                    <TouchableOpacity onPressIn={handleUploadImage} style={{ marginRight: 20 }}>
                        <Ionicons name="arrow-up" size={28} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPressIn={handleCamera} style={{ marginRight: 15 }}>
                        <Ionicons name="camera-outline" size={28} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPressOut={() => saveRef.current()}>
                        <Ionicons name="checkmark-sharp" size={32} color="#fff" />
                    </TouchableOpacity>
                </View>
            ),
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

        oInv.inv_number = (oBiz?.be_inv_prefix ?? "") + (oBiz?.be_inv_integer ?? 0);
        if (oClient?.client_id) oInv.client_id = oClient.client_id;

        // ✅ 2. Check if inv_number is duplicated in Firestore
        const invoice = await fetch1Inv(oInv.inv_number);
        if (invoice) {
            Alert.alert(
                "Invalid Invoice Number",
                "Invoice number duplicated. Please change the invoice number before saving.",
                [
                    { text: "Keep Editing", style: "cancel" },
                    {
                        text: "Discard",
                        style: "destructive",
                        onPress: () => {
                            // 👇 put your "next step" logic here
                            navigation.goBack()
                        },
                    },
                ]
            );
            return; // stop here until user decides
        }
        // ✅ 4. if no item, set TBD
        if (!oInv.inv_items || oInv.inv_items.length === 0) {
            updateOInv({ inv_items: [emptyItem()] });
        }

        isSavingRef.current = true;
        setIsDirty(false);

        try {
            await insertInv();
            const newInvInteger = (oBiz?.be_inv_integer ?? 0) + 1;
            await updateOBiz({ be_inv_integer: newInvInteger });
            await updateBiz({ be_inv_integer: newInvInteger, be_inv_prefix: oBiz?.be_inv_prefix });

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

                        <Inv2Client />

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