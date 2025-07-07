// src/components/ClientPickerModal.tsx
import React from "react";
import { useSQLiteContext } from "expo-sqlite";
import { Modal, View, Text, TouchableOpacity, FlatList } from "react-native";
import { PMDB } from "@/src/types";
import { modalStyles } from "@/src/constants/styles";
import { s_modal, s_global } from "@/src/constants";
import { useNavigation } from "@react-navigation/native";
import { useDrawerHeaderStore, useClientStore } from '@/src/stores';

interface PickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectPaymentMethod: (paymentMethod: PMDB) => void;
}

const M_PaymentMethod: React.FC<PickerModalProps> = ({ visible, onClose, onSelectPaymentMethod: onSelectPaymentMethod }) => {
    const db = useSQLiteContext();
    const [paymentMethods, setPaymentMethods] = React.useState<PMDB[]>([]);

    React.useEffect(() => {
        if (visible) { fetchPayments(); }
    }, [visible]);

    const fetchPayments = async () => {
        try {
            const result = await db.getAllAsync<PMDB>("SELECT * FROM payment_methods where NOT is_deleted");
            setPaymentMethods(result);
        } catch (err) {
            console.error("Failed to load Clients:", err);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}        >
            <View style={[s_modal.ModalOverlay, { justifyContent: 'flex-end', paddingBottom: 40 },]}>
                <View style={[s_modal.ModalContainer, { justifyContent: 'flex-end' },]}>
                    <Text style={s_modal.ModalTitle}>Select a Payment Method</Text>
                    <FlatList
                        data={paymentMethods}
                        keyExtractor={(item) => item.id!.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => onSelectPaymentMethod(item)} style={modalStyles.itemRow}                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                    <Text style={{ fontWeight: '500' }}>{item.pm_name}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />

                    <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
                        <Text style={{ color: "gray" }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default M_PaymentMethod;
