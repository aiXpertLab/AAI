// src/components/ItemPickerModal.tsx
import React from "react";
import { Modal, View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ItemDB } from "@/src/types";
import { modalStyles } from "@/src/constants/styles";
import { useNavigation } from "@react-navigation/native";
import { useDrawerHeaderStore, useItemStore } from '@/src/stores';

interface ItemPickerModalProps {
    visible: boolean;
    items: ItemDB[];
    onClose: () => void;
    onSelectItem: (item: ItemDB) => void;
}

const ItemPickerModal: React.FC<ItemPickerModalProps> = ({ visible, items, onClose, onSelectItem, }) => {
    const navigation = useNavigation();
    const { showDrawerHeader, setShowDrawerHeader } = useDrawerHeaderStore(); // 🧠 Zustand action
    const { createEmptyItem4New } = useItemStore(); // 🧠 Zustand action

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={modalStyles.overlay}>
                <View style={modalStyles.modalContent}>
                    <Text style={modalStyles.modalTitle}>Select an Item</Text>

                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => onSelectItem(item)}
                                style={modalStyles.itemRow}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                    <Text style={{ fontWeight: '500' }}>{item.item_name}</Text>
                                    <Text style={{ color: '#666' }}>${item.item_rate ?? '0.00'}</Text>
                                </View>

                            </TouchableOpacity>
                        )}
                    />

                    <TouchableOpacity
                        style={modalStyles.addNewButton}
                        onPress={() => {
                            onClose();
                            // setShowDrawerHeader('fromInv');
                            createEmptyItem4New();
                            navigation.navigate("Tab3_Item_Form" as never);
                        }}
                    >
                        <Ionicons name="add" size={16} color="#fff" />
                        <Text style={modalStyles.addNewText}>Add New Item</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
                        <Text style={{ color: "gray" }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ItemPickerModal;
