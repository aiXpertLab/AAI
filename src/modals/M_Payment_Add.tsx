import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';

import { PMDB } from "@/src/types";
import { s_global, s_modal } from '@/src/constants';
import { formatDateForUI } from "@/src/utils/dateUtils";
import M_PaymentMethod from './M_PaymentMethod';
import { useInvStore } from '../stores/InvStore';

interface AddPaymentModalProps {
    visible: boolean;
    onCancel: () => void;
    onSave: (paymentDetails: any) => void; // Parent will handle saving
}

export const M_Payment_Add: React.FC<AddPaymentModalProps> = ({ visible, onCancel, onSave }) => {
    const { oInv } = useInvStore(); // 🧠 Zustand action

    // Structured state to manage all form data in one object
    const [paymentDetails, setPaymentDetails] = useState({
        amount: '',
        date: new Date(),
        paymentMethod: '',
        note: 'Payment received',
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isClientModalVisible, setPaymentMethodModalVisible] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("PayPal");

    // Sync initial values from `oInv` when modal is visible
    useEffect(() => {
        if (visible && oInv) {
            setPaymentDetails({
                amount: oInv.inv_balance_due != null ? parseFloat(oInv.inv_balance_due.toString()).toFixed(2) : '',
                paymentMethod: oInv.inv_payment_status || '',
                date: new Date(), // Reset date when modal opens
                note: 'Payment received',
            });
        }
    }, [visible, oInv]);

    const handleAmountChange = (text: string) => {
        const cleaned = text.replace(/[^0-9.]/g, '');
        const parts = cleaned.split('.');
        if (parts.length > 2) return; // Invalid input (too many dots)
        if (parts[1]?.length > 2) return; // Limit to two decimal places

        setPaymentDetails((prev) => ({ ...prev, amount: cleaned }));
    };

    const handleSelectPM = (pm: PMDB | { pm_name: string }) => {
        setSelectedPaymentMethod(pm.pm_name);
        setPaymentMethodModalVisible(false);
        setPaymentDetails((prev) => ({ ...prev, paymentMethod: pm.pm_name }));
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setPaymentDetails((prev) => ({ ...prev, date: selectedDate }));
        }
    };

    const handleSave = async () => {
        if (onSave) onSave(paymentDetails); // Return payment details to the parent
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={s_modal.ModalOverlay}>
                <View style={s_modal.ModalContainer}>
                    <Text style={s_modal.ModalTitle}>Add Payment</Text>

                    {/* Amount Input */}
                    <Text style={s_modal.ModalLabel}>Amount</Text>
                    <TextInput
                        value={paymentDetails.amount}
                        onChangeText={handleAmountChange}
                        keyboardType="numeric"
                        placeholder="$0.00"
                        style={s_modal.ModalInput}
                    />

                    {/* Date Picker */}
                    <Text style={s_modal.ModalLabel}>Date</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={s_modal.ModalInput}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <Text>{formatDateForUI(paymentDetails.date.toISOString())}</Text>
                            <Ionicons name="calendar-outline" size={20} color="#888" />
                        </View>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={paymentDetails.date}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                        />
                    )}

                    {/* Payment Method Picker */}
                    <View style={s_modal.ModalSection}>
                        <Text style={s_modal.ModalLabel}>Payment Method</Text>
                        <TouchableOpacity style={s_global.DropdownButton} onPress={() => setPaymentMethodModalVisible(true)}>
                            <Text style={s_global.DropdownText}>{selectedPaymentMethod}</Text>
                            <Ionicons name="chevron-down" size={18} color="gray" />
                        </TouchableOpacity>
                        <M_PaymentMethod
                            visible={isClientModalVisible}
                            onSelectPaymentMethod={handleSelectPM}
                            onClose={() => setPaymentMethodModalVisible(false)}
                        />
                    </View>

                    {/* Note Input */}
                    <Text style={s_modal.ModalLabel}>Note (optional)</Text>
                    <TextInput
                        value={paymentDetails.note}
                        onChangeText={(text) => setPaymentDetails((prev) => ({ ...prev, note: text }))}
                        placeholder="Any notes..."
                        style={s_modal.ModalInput}
                    />

                    {/* Action Buttons */}
                    <View style={s_modal.ModalActions}>
                        <TouchableOpacity onPress={onCancel} style={[s_modal.ModalButton, s_modal.ModalButtonCancel]}>
                            <Text style={s_modal.ModalButtonCancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSave} style={[s_modal.ModalButton, s_modal.ModalButtonConfirm]}>
                            <Text style={s_modal.ModalButtonConfirmText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
