// src/components/TaxPickerModal.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Modal, View, Text, TouchableOpacity, FlatList, } from 'react-native';
// import { useSQLiteContext } from "expo-sqlite";

import { useNavigation } from '@react-navigation/native';

import { modalStyles } from '@/src/constants/styles';
import { TaxDB, TaxPickerModalProps } from '@/src/types';
import { useTaxCrud } from "@/src/firestore/fs_crud_tax";


const M_TaxPicker: React.FC<TaxPickerModalProps> = ({ visible, taxRows, onClose, onSelectTax, }) => {
    const navigation = useNavigation();
    // const db = useSQLiteContext();
    const [selectedTaxes, setSelectedTaxes] = React.useState<TaxDB[]>([]);

    const handleDeleteTax = async (id: number) => {
        const confirmed = await new Promise<boolean>((resolve) => {
            Alert.alert(
                "Delete Tax?",
                "Are you sure you want to mark this tax as deleted?",
                [
                    { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
                    { text: "Delete", style: "destructive", onPress: () => resolve(true) },
                ]
            );
        });

        if (!confirmed) return;

        const success = await updateTaxStatus(db, id, 1, 'deleted');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={modalStyles.overlay}>
                <View style={modalStyles.modalContent}>
                    <Text style={modalStyles.modalTitle}>Select Tax Rate</Text>
                    <FlatList
                        data={taxRows}
                        keyExtractor={(t) => t.id!.toString()}
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingVertical: 4,
                                }}
                            >
                                {/* Selection area */}
                                <TouchableOpacity
                                    onPress={() => {
                                        const alreadySelected = selectedTaxes.find(t => t.id === item.id);
                                        if (alreadySelected) {
                                            setSelectedTaxes(prev => prev.filter(t => t.id !== item.id));
                                        } else {
                                            setSelectedTaxes(prev => [...prev, item]);
                                        }
                                    }}
                                    style={[
                                        modalStyles.itemRow,
                                        { flex: 1 },
                                        selectedTaxes.some(t => t.id === item.id) && { backgroundColor: '#e6f7ff' },
                                    ]}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                        }}
                                    >
                                        <Text style={{ fontWeight: '500' }}>{item.tax_name}</Text>
                                        <Text style={{ color: '#666' }}>
                                            {(Number(item.tax_rate || 0) * 100).toFixed(3)}%
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                {/* Trash icon on the right */}
                                <TouchableOpacity
                                    onPress={() => handleDeleteTax(item.id!)}
                                    style={{ paddingLeft: 12, paddingVertical: 6 }}
                                >
                                    <Ionicons name="trash-outline" size={18} color="red" />
                                </TouchableOpacity>
                            </View>
                        )}
                    />

                    <TouchableOpacity
                        style={modalStyles.confirmButton}
                        onPress={() => {
                            const combinedRate = selectedTaxes.reduce((sum, tax) => sum + tax.tax_rate, 0);
                            // const combinedName = selectedTaxes.map(t => t.tax_name).join(" + ");
                            const combinedName = `${selectedTaxes.map(t => t.tax_name).join(" + ")} (${(combinedRate*100).toFixed(3)}%)`;
                            onSelectTax({
                                id: 0,
                                tax_name: combinedName,
                                tax_rate: combinedRate,
                            } as TaxDB);
                            setSelectedTaxes([]);
                            onClose();
                        }}
                    >
                        <Text style={modalStyles.addNewText}>
                            Apply Selected ({selectedTaxes.length})
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={modalStyles.addNewButton}
                        onPress={() => {
                            onClose();
                            navigation.navigate('Inv4Total_TaxForm' as never); // create if needed
                        }}
                    >
                        <Ionicons name="add" size={16} color="#fff" />
                        <Text style={modalStyles.addNewText}>Add New Tax</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
                        <Text style={{ color: 'gray' }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default M_TaxPicker;
