import React from "react";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, ToastAndroid, View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Modal, TextInput, Button, Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { useSQLiteContext } from "expo-sqlite";
import { useInvStore, useInvItemListStore, useBizStore } from '@/src/stores/useInvStore';
import { WebView } from "react-native-webview";

import { genHTML } from "@/src/utils/genHTML";
import { DetailStackPara, InvPaymentDB } from "@/src/types";
import { s_inv } from "@/src/constants";
import { useInvoiceCrud } from "@/src/db/useInvoiceCrud";
import {viewPDF, sharePDF, emailPDF, genPDF } from '@/src/utils/genPDF'; // adjust path
import { s_global, s_fab, colors } from "@/src/constants";

import { M_TemplatePicker, M_Confirmation, M_PaymentList } from "@/src/modals";
import { TooltipBubble } from "@/src/components/toolTips";
import { useTipVisibility } from '@/src/hooks/useTipVisibility';

export const Inv_Pay: React.FC = () => {
    const db = useSQLiteContext();
    const navigation = useNavigation<NativeStackNavigationProp<DetailStackPara>>();
    const { oInv, updateOInv, isDirty, setIsDirty } = useInvStore();  // 🧠 Zustand action
    const { oInvItemList } = useInvItemListStore();
    const { oBiz, } = useBizStore();  // 🧠 Zustand action

    const [showConfirm, setShowConfirm] = React.useState(false);
    const [showTemplateModal, setShowTemplateModal] = React.useState(false);
    const [confirmAction, setConfirmAction] = React.useState<'delete' | 'archive' | 'duplicate' | 'recurring' | null>(null);

    const [payments, setPayments] = React.useState<InvPaymentDB[]>([]);
    const [showAddPayment, setShowAddPayment] = React.useState(false);
    const tip1 = useTipVisibility('tip1_count', true, 1800);

    const { deleteInvoice, lockInvoice, duplicateInvoice } = useInvoiceCrud();

    const removePayment = async (paymentId: number) => {
        try {
            await db.runAsync(
                `UPDATE inv_payments SET is_deleted = 1, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?`,
                [paymentId]
            );
            loadData(); // Reload payments or other data
        } catch (error) {
            console.error("Failed to remove payment:", error);
        }
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
            const uri = await genPDF(oInv, oBiz, oInvItemList);
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
        const success = await deleteInvoice(oInv?.id!, oInv?.inv_number!);
        if (success) navigation.goBack();
    };

    const handleConfirmArchive = async () => {
        setShowConfirm(false);
        const success = await lockInvoice(oInv?.id!, oInv?.inv_number!);
        if (success) navigation.goBack();
    };

    const handleDuplicate = async () => {
        try {
            const success = await duplicateInvoice();
            console.log('Duplicate success:', success);
        } catch (error) {
            console.error('Error during duplication:', error);
        }
    };

    const sendEmail = async () => {
        try {
            const uri = await genPDF(oInv, oBiz, oInvItemList);
            await emailPDF(uri, oInv);
        } catch (err) { console.error("Error Email:", err); }
    };

    const handleShare = async () => {
        try {
            const uri = await genPDF(oInv, oBiz, oInvItemList);
            await sharePDF(uri);
        } catch (err) { console.error("Error sharing PDF:", err); }
    };

    const onEdit = () => {
        if (oInv?.is_locked) {
            if (Platform.OS === 'android') { ToastAndroid.show('This invoice is locked and cannot be edited.', ToastAndroid.SHORT); }
            return;
        }
        console.log(JSON.stringify(oInv, null, 4), isDirty);
        setIsDirty(false);
        navigation.navigate('Inv_Form', { mode: 'modify_existed' });
    };

    React.useEffect(() => { loadData(); }, [oInv]);

    const loadData = async () => {

        const paymentData = await db.getAllAsync<InvPaymentDB>(`SELECT * FROM inv_payments WHERE inv_id = ? AND is_deleted =0`, [oInv!.id!]);
        setPayments(paymentData);
        const paid_total = paymentData.reduce((sum, p) => sum + (p.pay_amount || 0), 0);
        const newBalance = oInv!.inv_total! - paid_total;

        console.log("Payments:", paymentData, paid_total, newBalance);
        if (oInv!.inv_paid_total !== paid_total || oInv!.inv_balance_due !== newBalance) {
            updateOInv({ inv_paid_total: paid_total, inv_balance_due: newBalance });
        }       //only in this way can avoid unlimited loop of useEffect

        console.log("oInv 123:", oInv?.inv_total, paid_total, newBalance);
        await db.runAsync(
            `UPDATE invoices 
            SET
                inv_paid_total = ?,
                inv_balance_due = ?,
                inv_payment_status = CASE
                    WHEN ? >= inv_total THEN 'Paid'
                    WHEN ? < inv_total AND inv_due_date < date('now') THEN 'Overdue'
                    WHEN ? > 0 THEN 'Partially Paid'
                    ELSE 'Unpaid'
            END,
            updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
        WHERE id = ?`, [paid_total, newBalance, paid_total, paid_total, paid_total, oInv!.id!]);
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* Email Button */}
                    <TouchableOpacity onPressIn={sendEmail}>
                        <Ionicons name="mail-outline" size={25} color="#fff" style={{ marginRight: 30 }} />
                    </TouchableOpacity>
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

                        {!oInv?.is_locked && <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 8 }}>
                            {/* Group Add Payments and + together on the RIGHT */}
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginRight: 8 }}>Add New Payments</Text>
                                <TouchableOpacity
                                    onPress={() => setShowAddPayment(true)}
                                    style={s_inv.Inv_Pay_Icon}
                                >
                                    <Ionicons name="add" size={18} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>}

                        <View style={s_inv.Inv_Pay_List}>
                            {payments.length === 0 ? (
                                <Text style={{ color: '#aaa' }}>No payments recorded.</Text>
                            ) : (
                                payments.map((p, index) => (
                                    <View key={p.id} style={{ marginBottom: 12, width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                                        {/* Left Column: Payment Info */}
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={{ fontWeight: "bold" }}>{p.pay_method}</Text>
                                                <Text style={{ fontSize: 12, fontWeight: "600" }}>${p.pay_amount.toFixed(2)}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={{ fontSize: 12, color: "#888" }}>{p.pay_note ?? ""}</Text>
                                                <Text style={{ fontSize: 12, color: "#888" }}>{p.pay_date?.split("T")[0]}</Text>
                                            </View>
                                        </View>

                                        {/* Right Column: Trash Icon vertically centered */}
                                        <View style={{ justifyContent: "center", paddingLeft: 8 }}>
                                            <TouchableOpacity onPress={() => removePayment(p.id)}>
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
                            <WebView
                                originWhitelist={["*"]}
                                // source={{ html: genHTML(oInv!, oBiz!, oInvItemList, true) }}
                                source={{ html: genHTML(oInv!, oBiz!, oInvItemList, "view", oInv!.biz_inv_template_id || 't1') }}
                                style={{ flex: 1, backgroundColor: 'transparent' }}
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

                    <M_PaymentList
                        visible={showAddPayment}
                        onCancel={() => setShowAddPayment(false)}
                        onSave={() => {
                            setShowAddPayment(false); // hide modal
                            loadData(); // reload payments or other data
                        }}
                    />
                    <M_TemplatePicker
                        visible={showTemplateModal}
                        onClose={() => setShowTemplateModal(false)}
                    />

                    {/* Bottom Floating Action Bar */}
                    <View style={s_inv.FloatingBar}>
                        <TouchableOpacity onPress={onDelete}><Ionicons name="trash-outline" size={26} color="#333" /></TouchableOpacity>
                        <TouchableOpacity onPress={onArchive}><Ionicons name="archive-outline" size={26} color="#333" /></TouchableOpacity>
                        <TouchableOpacity onPress={onDuplicate}><Ionicons name="copy-outline" size={26} color="#333" /></TouchableOpacity>
                        <TouchableOpacity onPress={handleShare}><Ionicons name="share-social-outline" size={26} color="#333" /></TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

