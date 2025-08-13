import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';

import { PMDB } from "@/src/types";
import { s_global, s_modal } from '@/src/constants';
import { formatDateForUI } from "@/src/utils/dateUtils";
import M_PaymentMethod from './M_PaymentMethod';
import { useInvStore, usePMStore } from '../stores/InvStore';

interface AddPaymentModalProps {
    visible: boolean;
    onCancel: () => void;
    onSave: () => void; // Parent will handle saving
}

export const M_Payment_Add: React.FC<AddPaymentModalProps> = ({ visible, onCancel, onSave }) => {
    const { oInv } = useInvStore(); // 🧠 Zustand action
    const { oPM, updateOPM } = usePMStore();  // 🧠 Zustand action

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isClientModalVisible, setPaymentMethodModalVisible] = useState(false);


    const handleChange = (field: keyof PMDB, value: string | number) => {
        if (!oPM) return; // guard clause
        updateOPM({ [field]: value });
    };

    const handleAmountChange = (text: string) => {
        console.log("Amount changed:", text);
        const cleaned = text.replace(/[^0-9.]/g, '');
        // const parts = cleaned.split('.');
        // if (parts.length > 2) return; // Invalid input (too many dots)
        // if (parts[1]?.length > 2) return; // Limit to two decimal places
        // const pay_amount = parseFloat(text) || 0; // Convert text to number (fallback to 0)
        updateOPM({ pay_amount: parseFloat(cleaned) }); // Update the store
    };

    const handleSelectPM = (pm_row: PMDB | { pm_name: string }) => {
        updateOPM({ pm_name: pm_row.pm_name, }); // Update payment method in store
        setPaymentMethodModalVisible(false);
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (selectedDate) { // Only update if a date was selected (not cancelled)
            updateOPM({ pay_date: selectedDate });
        }
        setShowDatePicker(false);
    };

    const handleSave = async () => {
        if (onSave) onSave(); // notify parent
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={s_modal.ModalOverlay}>
                <View style={s_modal.ModalContainer}>
                    <Text style={s_modal.ModalTitle}>Add Payment</Text>

                    {/* Amount Input */}
                    <Text style={s_modal.ModalLabel}>Amount</Text>
                    <TextInput
                        style={s_global.Input}
                        placeholder="$9.99"
                        placeholderTextColor="#999"
                        keyboardType="decimal-pad"
                        value={
                            oPM?.pay_amount !== undefined
                                ? String(oPM.pay_amount)
                                : ""
                        }
                        // onFocus={() => handleChange("pay_amount", "55")} // Clear on focus
                        onChangeText={(text) => handleChange("pay_amount", text)}
                        onBlur={() => {
                            const num = parseFloat(String(oPM?.pay_amount));
                            if (!isNaN(num)) {
                                handleChange("pay_amount", Number(num.toFixed(2)));
                            }
                        }}
                    />


                    {/* <TextInput
                        value={oPM?.pay_amount.toString() || ''}
                        onChangeText={handleAmountChange}
                        keyboardType="decimal-pad"
                        placeholder="0.00"
                        style={s_modal.ModalInput}
                    /> */}

                    {/* Date Picker */}
                    <Text style={s_modal.ModalLabel}>Date</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={s_modal.ModalInput}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <Text>{formatDateForUI(oPM?.pay_date?.toISOString())}</Text>
                            <Ionicons name="calendar-outline" size={20} color="#888" />
                        </View>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={oPM?.pay_date || new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                        />
                    )}

                    {/* Payment Method Picker */}
                    <View style={s_modal.ModalSection}>
                        <Text style={s_modal.ModalLabel}>Payment Method</Text>
                        <TouchableOpacity style={s_global.DropdownButton} onPress={() => setPaymentMethodModalVisible(true)}>
                            <Text style={s_global.DropdownText}>{oPM?.pm_name}</Text>
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
                        value={oPM?.pay_note}
                        onChangeText={(text) => updateOPM({ pay_note: text })}
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
