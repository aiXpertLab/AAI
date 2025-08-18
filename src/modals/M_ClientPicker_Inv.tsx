// src/components/ClientPickerModal.tsx
import React from "react";

import { Modal, View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ClientDB } from "@/src/types";
import { modalStyles } from "@/src/constants/styles";
import { s_modal } from "@/src/constants";
import { useNavigation } from "@react-navigation/native";
import { useClientStore } from '@/src/stores';
import { useClientCrud } from "../firestore/fs_crud_client";

interface ClientPickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectClient: (client: ClientDB) => void;
}

const ClientPickerModal: React.FC<ClientPickerModalProps> = ({ visible, onClose, onSelectClient }) => {
    const navigation = useNavigation();
    const { oClient, updateOClient, createEmptyClient4New } = useClientStore();  // 🧠 Zustand action
    const [clients, setClients] = React.useState<ClientDB[]>([]);
    const { insertClient, updateClient, fetchClients } = useClientCrud();

    React.useEffect(() => {
        const unsubscribeFocus = navigation.addListener("focus", async () => {
            try {
                const fetchedClients = await fetchClients();
                setClients(fetchedClients);
            } catch (err) {
                console.error("❌ fetchClients error:", err);
            }
        });

        return unsubscribeFocus;
    }, [navigation]);


    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            {/* <View style={modalStyles.overlay}>
                <View style={modalStyles.modalContent}>
                    <Text style={modalStyles.modalTitle}>Select a Client</Text> */}
            <View style={[s_modal.ModalOverlay, { justifyContent: 'flex-end', paddingBottom: 40 },]}>
                <View style={[s_modal.ModalContainer, { justifyContent: 'flex-end' },]}>
                    <Text style={s_modal.ModalTitle}>Select a Client</Text>

                    <FlatList
                        data={clients}
                        keyExtractor={(item) => item.client_id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => onSelectClient(item)}
                                style={modalStyles.itemRow}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                    <Text style={{ fontWeight: '500' }}>{item.client_company_name}</Text>
                                    <Text style={{ color: '#666' }}>{item.client_contact_name ?? '0.00'}</Text>
                                </View>

                            </TouchableOpacity>
                        )}
                    />

                    <TouchableOpacity
                        style={modalStyles.addNewButton}
                        onPress={() => {
                            onClose();
                            createEmptyClient4New();
                            navigation.navigate("Client_Form" as never);
                        }}
                    >
                        <Ionicons name="add" size={16} color="#fff" />
                        <Text style={modalStyles.addNewText}>Add New Client</Text>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
                        <Text style={{ color: "gray" }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ClientPickerModal;
