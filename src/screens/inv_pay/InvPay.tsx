import * as Crypto from 'expo-crypto';
import React from "react";
import * as Print from 'expo-print';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, ToastAndroid, View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Modal, TextInput, Button, Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { Ionicons } from '@expo/vector-icons';

import { useInvStore, useBizStore, usePMStore } from '@/src/stores';
import { useInvCrud, useBizCrud } from "@/src/firestore";

import { genHTML } from "@/src/utils/genHTML";

import { RootStack, PMDB } from "@/src/types";
import { s_global, s_fab, s_inv } from "@/src/constants";

import { viewPDF, sharePDF, emailPDF, genPDF } from '@/src/utils/genPDF'; // adjust path

import { M_TemplatePicker, M_Confirmation, M_Payment_Add } from "@/src/modals";
import { TooltipBubble } from "@/src/components/toolTips";
import { useTipVisibility } from '@/src/hooks/useTipVisibility';
import { date2string } from "@/src/utils/dateUtils";

export const InvPay: React.FC = () => {
    console.log("InvPay")
    const navigation = useNavigation<NativeStackNavigationProp<RootStack>>();
    const { oInv, setOInv, addPaymentToOInv, updateOInvPayments, updateOInv, isDirty, setIsDirty, } = useInvStore();  // 🧠 Zustand action
    const { createEmptyPM4New, oPM, updateOPM } = usePMStore();  // 🧠 Zustand action
    const { oBiz, updateOBiz } = useBizStore();  // 🧠 Zustand action

    const [showConfirm, setShowConfirm] = React.useState(false);
    const [showTemplateModal, setShowTemplateModal] = React.useState(false);
    const [confirmAction, setConfirmAction] = React.useState<'delete' | 'archive' | 'duplicate' | 'recurring' | null>(null);

    const [payments, setPayments] = React.useState<PMDB[]>([]);
    const [showAddPayment, setShowAddPayment] = React.useState(false);
    const tip1 = useTipVisibility('tip1_count', true, 1800);

    const { updateInv, fetch1Inv, insertPayment, deletePayment, duplicateInv } = useInvCrud();
    const { updateBiz } = useBizCrud();

    const removePayment = async (pId: string) => {
        console.log('removePayment called with pId:', pId);
        console.log('oInv before removal:', oInv);
        const paymentToRemove = oInv?.inv_payments.find(payment => payment.pm_id === pId);

        if (paymentToRemove) {
            const result = await deletePayment(oInv!.inv_number, pId);

            if (result !== false) {
                const updatedPayments = oInv?.inv_payments.filter(payment => payment.pm_id !== pId);

                updateOInv({
                    inv_balance_due: result.updatedBalanceDue,
                    inv_paid_total: result.updatedInvPaidTotal,
                    inv_payments: updatedPayments
                });

                console.log('Payment removed successfully');
            } else {
                console.log('Error removing payment: failed to update totals.');
            }
        } else {
            console.log('Payment not found');
        }
    };

    const handleAddPayment = () => {
        createEmptyPM4New();
        updateOPM({ pay_amount: oInv?.inv_balance_due ?? 0 });
        setShowAddPayment(true);
    };

    const onDuplicate = () => {
        setConfirmAction('duplicate');
        setShowConfirm(true);
    };

    const onDelete = () => {
        setConfirmAction('delete');
        setShowConfirm(true);
    };

    const onArchive = () => {
        setConfirmAction('archive');
        setShowConfirm(true);
    };

    const onPDF = async () => {
        try {
            // genHTML(oInv!, oBiz!, "view", oInv!.inv_template_id || 't1')
            // const uri = await genPDF(oInv, oBiz, oInv!.inv_items);
            const htmlContent = genHTML(oInv!, oBiz!, "pdf", oInv!.inv_template_id || 't1')
            const { uri } = await Print.printToFileAsync({ html: htmlContent });

            // return uri;

            await viewPDF(uri);
            // await openWithExternalPDFViewer(uri);
        } catch (err) {
            console.error("Error viewing PDF:", err);
        }
    };

    const handleConfirm = () => {
        setShowConfirm(false);
        if (confirmAction === 'delete') {
            handleConfirmDelete();
        } else if (confirmAction === 'archive') {
            handleConfirmArchive();
        } else if (confirmAction === 'duplicate') {
            handleDuplicate();
        }
    };

    const handleConfirmDelete = async () => {
        setShowConfirm(false);
        try {
            await updateInv({ is_deleted: 1 }, oInv?.inv_id!);

            navigation.goBack();
        } catch (error) {
            console.error('Error during deletion:', error);
        }
    };

    const handleConfirmArchive = async () => {
        setShowConfirm(false);
        try {
            // await updateInv(oInv?.inv_id!, oInv?.inv_number!);
            navigation.goBack();
        } catch (error) {
            console.error('Error during archiving:', error);
        }
    };

    const handleDuplicate = async () => {
        try {
            const newInvId = 'i2_' + Crypto.randomUUID().replace(/-/g, '');
            const newInvNumber = `${oBiz!.be_inv_prefix}${oBiz?.be_inv_integer}`

            const success = await duplicateInv(newInvId, newInvNumber);

            const max = Math.max(oBiz?.be_inv_integer ?? 0, oBiz?.be_inv_integer_max ?? 0) + 1;

            await updateOBiz({ be_inv_integer: max, be_inv_integer_max: max });
            await updateBiz!({ be_inv_integer: max, be_inv_integer_max: max, be_inv_prefix: oBiz?.be_inv_prefix });

            console.log('Duplicate success:', success);
            navigation.goBack();
        } catch (error) {
            console.error('Error during duplication:', error);
        }
    };

    const sendEmail = async () => {
        try {
            const htmlContent = genHTML(oInv!, oBiz!, "pdf", oInv!.inv_template_id || 't1');
            const { uri } = await Print.printToFileAsync({ html: htmlContent });

            await emailPDF(uri, oInv!, oBiz!);
        } catch (err) {
            console.error("Error Email:", err);
        }
    };

    const handleShare = async () => {
        try {
            const uri = await genPDF(oInv, oBiz, oInv!.inv_items);
            await sharePDF(uri);
        } catch (err) { console.error("Error sharing PDF:", err); }
    };

    const onEdit = () => {
        // console.log(JSON.stringify(oInv, null, 4), isDirty);
        setIsDirty(false);
        navigation.navigate('DetailStack', { screen: 'InvPay_Edit' });
    };


    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* Email Button */}
                    {/* <TouchableOpacity onPressIn={sendEmail}>
                        <Ionicons name="mail-outline" size={25} color="#fff" style={{ marginRight: 30 }} />
                    </TouchableOpacity> */}
                    {/* Edit Button */}
                    <TouchableOpacity onPressOut={() => onEdit()}>
                        <Ionicons name="create-outline" size={26} color="#fff" style={{ marginRight: 4 }} />
                    </TouchableOpacity>
                </View>
            ),
            title: oInv!.inv_number,
        });
    }, [navigation]);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
                        {/* Payments Section */}

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 8 }}>
                            {/* Group Add Payments and + together on the RIGHT */}
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginRight: 8 }}>Add New Payments</Text>
                                <TouchableOpacity
                                    // onPress={() => setShowAddPayment(true)}
                                    onPress={handleAddPayment}
                                    style={s_inv.Inv_Pay_Icon}
                                >
                                    <Ionicons name="add" size={18} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={s_inv.Inv_Pay_List}>
                            {oInv?.inv_payments.length === 0 ? (
                                <Text style={{ color: '#aaa' }}>No payments recorded.</Text>
                            ) : (
                                oInv?.inv_payments.map((p, index) => (
                                    <View key={p.pm_id} style={{ marginBottom: 12, width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                                        {/* Left Column: Payment Info */}
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={{ fontWeight: "bold" }}>{p.pm_name}</Text>
                                                <Text style={{ fontSize: 12, fontWeight: "600" }}>${p.pay_amount}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={{ fontSize: 12, color: "#888" }}>{p.pay_note ?? ""}</Text>
                                                <Text style={{ fontSize: 12, color: "#888" }}>{date2string(p.pay_date)}</Text>
                                            </View>
                                        </View>

                                        {/* Right Column: Trash Icon vertically centered */}
                                        <View style={{ justifyContent: "center", paddingLeft: 8 }}>
                                            <TouchableOpacity onPress={() => removePayment(p.pm_id)}>
                                                <Ionicons name="trash-outline" size={14} color="#e74c3c" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))


                            )}
                        </View>
                        {/* Amount Due */}
                        <View style={{ alignItems: 'center', marginVertical: 20 }}>
                            <Text style={{ fontSize: 16, color: '#666' }}>Amount Due</Text>
                            <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#000' }}>${oInv!.inv_balance_due!.toFixed(2)}</Text>
                        </View>

                        {/* Live Preview */}
                        <View style={{ minHeight: 600, flexShrink: 0 }}>
                            {/* <WebView
                                originWhitelist={["*"]}
                                source={{ html: genHTML(oInv!, oBiz!, "view", oInv!.inv_template_id || 't1') }}
                                style={{ flex: 1, backgroundColor: 'transparent' }}
                                nestedScrollEnabled
                            /> */}
                            <WebView
                                // key={oInv?.inv_id + (oInv?.inv_payment_status ?? "")}
                                key={JSON.stringify({ oInv, oBiz })}
                                originWhitelist={["*"]}
                                source={{ html: genHTML(oInv!, oBiz!, "view", oInv!.inv_template_id || "t1") }}
                                style={{ flex: 1, backgroundColor: "transparent" }}
                                nestedScrollEnabled
                            />


                            {tip1.visible && <TooltipBubble />}
                            <TouchableWithoutFeedback onPress={() => setShowTemplateModal(true)}>
                                <View style={StyleSheet.absoluteFillObject} />
                            </TouchableWithoutFeedback>

                        </View>
                    </ScrollView>

                    <View style={s_global.Container}>
                        <TouchableOpacity style={[s_global.FABCircle, { bottom: 70 }]} onPress={onPDF}>
                            <Text style={s_fab.menuText}>PDF</Text>
                        </TouchableOpacity>
                    </View>

                    <M_Confirmation
                        visible={showConfirm}
                        title={
                            confirmAction === 'delete' ? 'Confirm Deletion' :
                                confirmAction === 'archive' ? 'Confirm Archive' :
                                    confirmAction === 'duplicate' ? 'Duplicate Invoice' :
                                        'Create Recurring'
                        }
                        message={
                            confirmAction === 'delete' ? 'Are you sure you want to move this invoice to Trash? You can restore it later from the Deleted section in the Drawer Menu.' :
                                confirmAction === 'archive' ? 'Archiving this invoice will lock it and make it uneditable. You can restore it later from the Archived section in the Drawer Menu.' :
                                    confirmAction === 'duplicate' ? 'Create a copy of this invoice with a new number?' :
                                        'Set up this invoice to recur automatically?'
                        }
                        confirmText={
                            confirmAction === 'delete' ? 'Delete' :
                                confirmAction === 'archive' ? 'Archive' :
                                    confirmAction === 'duplicate' ? 'Duplicate' :
                                        'Create Recurring'
                        }
                        cancelText="Cancel"
                        danger={confirmAction === 'delete'} // Only show as dangerous for delete
                        onConfirm={handleConfirm}
                        onCancel={() => setShowConfirm(false)}
                    />

                    <M_Payment_Add
                        visible={showAddPayment}
                        onCancel={() => setShowAddPayment(false)}
                        onSave={async () => {
                            console.log('M_Payment_Add --> ', oPM)
                            if (oPM) {
                                if (typeof oPM.pay_amount === 'string') {
                                    oPM.pay_amount = parseFloat(oPM.pay_amount);  // or use Number(oPM.pay_amount)
                                }

                                // const updatedPayments = [...(oInv?.inv_payments || []), oPM];
                                // updateOInvPayments(updatedPayments);
                                // console.log('oPM --> ', oPM)
                                // // addPaymentToOInv(oPM);
                                // console.log('oInv --> ', oInv?.inv_payments)

                                // // const updatedBalanceDue = oInv?.inv_balance_due! - oPM.pay_amount;
                                // // const updatedInvPaidTotal = oInv?.inv_paid_total! + oPM.pay_amount;

                                // // updateOInv({ inv_balance_due: updatedBalanceDue, inv_paid_total: updatedInvPaidTotal });

                                await insertPayment({ inv_payments: [oPM] }, oInv!.inv_id);
                                const updatedInv = await fetch1Inv(oInv!.inv_number); // Assuming fetch1Inv fetches an invoice by its number

                                if (updatedInv) {
                                    setOInv(updatedInv);
                                } else {
                                    console.log('Failed to refetch updated invoice');
                                }

                            }
                            setShowAddPayment(false); // hide modal

                        }}
                    />

                    <M_TemplatePicker
                        visible={showTemplateModal}
                        onClose={() => setShowTemplateModal(false)}
                    />

                    {/* Bottom Floating Action Bar */}
                    <View style={s_inv.FloatingBar}>
                        <TouchableOpacity onPress={onDelete}><Ionicons name="trash-outline" size={26} color="#333" /></TouchableOpacity>
                        <TouchableOpacity onPress={onDuplicate}><Ionicons name="copy-outline" size={26} color="#333" /></TouchableOpacity>
                        <TouchableOpacity onPress={sendEmail}><Ionicons name="mail-outline" size={26} color="#333" /></TouchableOpacity>
                        <TouchableOpacity onPress={handleShare}><Ionicons name="share-social-outline" size={26} color="#333" /></TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};
