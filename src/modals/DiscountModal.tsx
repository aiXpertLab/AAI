/* DiscountModal.tsx */
import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, Pressable, } from 'react-native';
import { RadioButton } from 'react-native-paper';


interface Props {
    visible: boolean;
    onClose: () => void;
    onApply: (value: number, type: 'percent' | 'flat') => void;
}

const DiscountModal: React.FC<Props> = ({ visible, onClose, onApply }) => {
    const [type, setType] = useState<'percent' | 'flat'>('percent');
    const [value, setValue] = useState<string>('');

    const handleApply = () => {
        const num = Number(value);
        if (!isNaN(num) && num > 0) {
            onApply(num, type);
            setValue('');
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                {/* Transparent Pressable catches outside‑taps */}
            </Pressable>

            <View style={styles.card}>
                <Text style={styles.title}>Add a Discount</Text>

                {/* Radio buttons */}
                <View style={styles.radioRow}>
                    <RadioButton
                        value="percent"
                        status={type === 'percent' ? 'checked' : 'unchecked'}
                        onPress={() => setType('percent')}
                    />
                    <Text style={styles.radioLabel}>Percentage</Text>

                    <RadioButton
                        value="flat"
                        status={type === 'flat' ? 'checked' : 'unchecked'}
                        onPress={() => setType('flat')}
                    />
                    <Text style={styles.radioLabel}>Flat Amount</Text>
                </View>

                {/* Input */}
                <View style={styles.inputRow}>
                    <TextInput
                        value={value}
                        onChangeText={setValue}
                        placeholder="0"
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <Text style={styles.trailingText}>
                        {type === 'percent' ? '% of invoice total' : 'currency'}
                    </Text>
                </View>

                {/* Actions */}
                <View style={styles.actionRow}>
                    <TouchableOpacity onPress={onClose} style={styles.textButton}>
                        <Text style={styles.cancel}>CANCEL</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleApply} style={styles.textButton}>
                        <Text style={styles.continue}>APPLY</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default DiscountModal;

/* ---------- styles ---------- */
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#00000055',
    },
    card: {
        position: 'absolute',
        top: '35%',
        alignSelf: 'center',
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 24,
        paddingHorizontal: 20,
        elevation: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
    },
    radioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
    },
    radioLabel: { marginRight: 16, fontSize: 16 },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        alignSelf: 'center',
        marginBottom: 28,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#999',
        minWidth: 60,
        fontSize: 24,
        textAlign: 'center',
    },
    trailingText: { marginLeft: 6, fontSize: 16 },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    textButton: { paddingHorizontal: 12, paddingVertical: 4 },
    cancel: { fontSize: 16, color: '#666' },
    continue: { fontSize: 16, color: '#1976d2', fontWeight: '600' },
});
