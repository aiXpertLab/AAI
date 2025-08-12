import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Platform, } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

import DateTimePicker from '@react-native-community/datetimepicker';

import { PMDB } from "@/src/types";
import { s_global, s_modal } from '@/src/constants';
import { useInvStore,  } from '@/src/stores/InvStore';
import { formatDateForUI } from "@/src/utils/dateUtils";
import M_PaymentMethod from './M_PaymentMethod';

interface AddPaymentModalProps {
    visible: boolean;
    onCancel: () => void;
    onSave: () => void;
}

export const M_PaymentList: React.FC<AddPaymentModalProps> = ({ visible, onCancel, onSave }) => {
    const { oInv } = useInvStore();  // 🧠 Zustand action
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [note, setNote] = useState('Payment received');

    const [isClientModalVisible, setPaymentMethodModalVisible] = React.useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState("PayPal");

    const handleSelectPM = (pm: PMDB | { pm_name: string }) => {
        setSelectedPaymentMethod(pm.pm_name);
        setPaymentMethodModalVisible(false);
    };

    React.useEffect(() => {
        if (visible && oInv) {
            setAmount(
                oInv.inv_balance_due != null
                    ? parseFloat(oInv.inv_balance_due.toString()).toFixed(2)
                    : ''
            );
            setPaymentMethod(oInv.client_payment_method || '');
            setDate(new Date()); // optional: reset date when modal opens
            setNote('Payment received');
        }
    }, [visible]);

    const onPressPaymentMethod = () => setPaymentMethodModalVisible(true);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };


    const handleSave = async () => {
        if (!oInv) return; // Ensure oInv is defined before proceeding
        console.log(oInv)
        if (onSave) onSave(); // notify parent

    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={s_modal.ModalOverlay}>
                <View style={s_modal.ModalContainer}>
                    <Text style={s_modal.ModalTitle}>Add Payment</Text>
                    <Text style={s_modal.ModalLabel}>Amount</Text>
                    <TextInput
                        value={amount}
                        onChangeText={(text) => {
                            const cleaned = text.replace(/[^0-9.]/g, '');
                            const parts = cleaned.split('.');
                            if (parts.length > 2) return; // Invalid input (too many dots)

                            // Limit to two decimal places
                            if (parts[1]?.length > 2) return;

                            setAmount(cleaned);
                        }}

                        keyboardType="numeric"
                        placeholder="$0.00"
                        style={s_modal.ModalInput}
                    />

                    <Text style={s_modal.ModalLabel}>Date</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={s_modal.ModalInput}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <Text>{formatDateForUI(date.toISOString())}</Text>
                            <Ionicons name="calendar-outline" size={20} color="#888" />
                        </View>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                        />
                    )}


                    {/* Client Picker */}
                    <View style={s_modal.ModalSection}>
                        <Text style={s_modal.ModalLabel}>Payment Method</Text>
                        <TouchableOpacity style={s_global.DropdownButton} onPress={onPressPaymentMethod}>
                            <Text style={s_global.DropdownText}>{selectedPaymentMethod}</Text>
                            <Ionicons name="chevron-down" size={18} color="gray" />
                        </TouchableOpacity>
                        <M_PaymentMethod
                            visible={isClientModalVisible}
                            onSelectPaymentMethod={handleSelectPM}
                            onClose={() => setPaymentMethodModalVisible(false)}
                        />
                    </View>



                    <Text style={s_modal.ModalLabel}>Note (optional)</Text>
                    <TextInput
                        value={note}
                        onChangeText={setNote}
                        placeholder="Any notes..."
                        style={s_modal.ModalInput}
                    />

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
