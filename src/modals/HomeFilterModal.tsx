// src/components/ClientPickerModal.tsx
import React from "react";
import { Modal, View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Client } from "@/src/types";
import { modalStyles } from "@/src/constants/styles";
import { useNavigation } from "@react-navigation/native";

interface ClientPickerModalProps {
    visible: boolean;
    clients: Client[];
    onClose: () => void;
    onSelectClient: (client: Client) => void;
}

const HomeFilterModal: React.FC<ClientPickerModalProps> = ({ visible, clients, onClose, onSelectClient, }) => {
    const navigation = useNavigation();

    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
    >
        <View style={s_global.modalOverlay}>
            <View style={s_global.modalContainer}>
                <Text style={s_global.modalTitle}>Filter Invoices</Text>

                {/* Client Dropdown */}
                <View style={s_global.modalSection}>
                    <Text style={s_global.modalLabel}>Client</Text>
                    <Picker
                        selectedValue={selectedClient}
                        onValueChange={(itemValue) => setSelectedClient(itemValue)}
                        style={s_global.modalPicker}
                    >
                        <Picker.Item label="Select a Client" value={null} />
                        {/* Populate this dynamically with clients */}
                        <Picker.Item label="Client 1" value="client1" />
                        <Picker.Item label="Client 2" value="client2" />
                        <Picker.Item label="Client 3" value="client3" />
                    </Picker>
                </View>

                {/* Date Range Pickers */}
                <View style={s_global.modalSection}>
                    <Text style={s_global.modalLabel}>Date Range</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity
                            style={s_global.datePickerButton}
                            onPress={() => setShowFromDate(true)} // Show the Date Picker for 'From Date'
                        >
                            <Text>{fromDate || "From Date"}</Text>
                            <Ionicons name="calendar" size={18} color="green" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={s_global.datePickerButton}
                            onPress={() => setShowToDate(true)} // Show the Date Picker for 'To Date'
                        >
                            <Text>{toDate || "To Date"}</Text>
                            <Ionicons name="calendar" size={18} color="green" />
                        </TouchableOpacity>

                        {showFromDate && (
                            <DateTimePicker
                                value={selectedFromDate}
                                mode="date"
                                display="default"
                                onChange={onFromDateChange}
                            />
                        )}

                        {showToDate && (
                            <DateTimePicker
                                value={selectedToDate}
                                mode="date"
                                display="default"
                                onChange={onToDateChange}
                            />
                        )}

                    </View>
                </View>

                {/* Action Buttons */}
                <View style={s_global.modalActions}>
                    <TouchableOpacity
                        style={s_global.button}
                        onPress={() => {
                            console.log("Filters applied");
                            setModalVisible(false);
                        }}
                    >
                        <Text style={s_global.buttonText}>Apply Filters</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={s_global.button}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={s_global.buttonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
);
};

export default HomeFilterModal;
