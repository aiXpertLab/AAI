// src/components/ClientPickerModal.tsx
import React from "react";
import { useSQLiteContext } from "expo-sqlite";
import { Modal, View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ClientDB } from "@/src/types";
import { modalStyles } from "@/src/constants/styles";
import { s_modal, s_global } from "@/src/constants";
import { useNavigation } from "@react-navigation/native";
import { useDrawerHeaderStore, useClientStore } from '@/src/stores';

interface ClientPickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectClient: (client: ClientDB) => void;
}

const ClientPickerModal: React.FC<ClientPickerModalProps> = ({ visible, onClose, onSelectClient }) => {
    const db = useSQLiteContext();
    const navigation = useNavigation();
    const { oClient, updateOClient, createEmptyClient4New } = useClientStore();  // 🧠 Zustand action
    const [clients, setClients] = React.useState<ClientDB[]>([]);

    React.useEffect(() => {
        if (visible) {
            fetchClients();
        }
    }, [visible]);

    const fetchClients = async () => {
        try {
            const result = await db.getAllAsync<ClientDB>("SELECT * FROM Clients WHERE NOT is_deleted ORDER BY id ASC");
            setClients(result);
        } catch (err) {
            console.error("Failed to load Clients:", err);
        }
    };

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
            <View style={[s_modal.ModalOverlay,  { justifyContent: 'flex-end', paddingBottom: 40 },]}>
                <View style={[s_modal.ModalContainer, { justifyContent: 'flex-end' },]}>
                    <Text style={s_modal.ModalTitle}>Select a Client</Text>

                    <FlatList
                        data={clients}
                        keyExtractor={(item) => item.id!.toString()}
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
                            navigation.navigate("Tab2_Client_Form" as never);
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
