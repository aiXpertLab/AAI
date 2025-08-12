// src/components/ClientPickerModal.tsx
import React from "react";
import { Modal, View, Text, TouchableOpacity, FlatList } from "react-native";
import { PMDB } from "@/src/types";
import { modalStyles } from "@/src/constants/styles";
import { s_modal, s_global } from "@/src/constants";
import { useNavigation } from "@react-navigation/native";
import { useDrawerHeaderStore, useClientStore } from '@/src/stores';
import { usePMCrud } from "@/src/firestore/fs_crud_pm";

interface PickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectPaymentMethod: (paymentMethod: PMDB) => void;
}

const M_PaymentMethod: React.FC<PickerModalProps> = ({ visible, onClose, onSelectPaymentMethod: onSelectPaymentMethod }) => {
    
    const [paymentMethods, setPaymentMethods] = React.useState<PMDB[]>([]);
    const { fetchPMs } = usePMCrud();

    React.useEffect(() => {
        const fetchPaymentMethods = async () => {
            const paymentMethods = await fetchPMs();
            setPaymentMethods(paymentMethods);
        };

        fetchPaymentMethods();
    }, [fetchPMs]);

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}        >
            <View style={[s_modal.ModalOverlay, { justifyContent: 'flex-end', paddingBottom: 40 },]}>
                <View style={[s_modal.ModalContainer, { justifyContent: 'flex-end' },]}>
                    <Text style={s_modal.ModalTitle}>Select a Payment Method</Text>
                    <FlatList
                        data={paymentMethods}
                        keyExtractor={(item) => item.pm_id}
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
