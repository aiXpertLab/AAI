// src/components/ClientPickerModal.tsx
import React from "react";

import { Modal, View, Text, TouchableOpacity, FlatList } from "react-native";
import { ClientDB } from "@/src/types";
import { modalStyles } from "@/src/constants/styles";
import { s_modal, s_global } from "@/src/constants";

interface ClientPickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectClient: (client: ClientDB) => void;
}

const M_HeaderClientPicker: React.FC<ClientPickerModalProps> = ({ visible, onClose, onSelectClient }) => {
    const [clients, setClients] = React.useState<ClientDB[]>([]);

    React.useEffect(() => {
        if (visible) {
            fetchClients();
        }
    }, [visible]);

    const fetchClients = async () => {
        try {
            const result = await db.getAllAsync<ClientDB>(
                "SELECT * FROM Clients WHERE NOT is_deleted ORDER BY id ASC"
            );

            if (result.length > 0) {
                const allOption = { ...result[0] }; // Copy first client
                allOption.id = -1;
                allOption.client_company_name = "All";

                setClients([allOption, ...result]); // Prepend to client list
            } else {
                setClients([]);
            }
        } catch (err) {
            console.error("Failed to load Clients:", err);
        }
    };


    return (
        <Modal
            visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}
        >
            <View style={s_modal.ModalOverlay}>
                <View style={s_modal.ModalContainer}>
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


                    <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
                        <Text style={{ color: "gray" }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default M_HeaderClientPicker;
