import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { s_modal } from '../constants';

interface ConfirmModalProps {
    visible: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmColor?: string;
    danger?: boolean; 
}

export const M_Confirmation: React.FC<ConfirmModalProps> = ({
    visible,
    title = 'Confirm',
    message,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    confirmColor,
    danger, 
}) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={s_modal.ModalOverlay}>
                <View style={s_modal.ModalContainer}>
                    {title && <Text style={s_modal.ModalTitle}>{title}</Text>}
                    <Text style={s_modal.ModalText}>{message}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <TouchableOpacity onPress={onConfirm} style={[
                            s_modal.ModalButton,
                            s_modal.ModalButtonDelete,
                            confirmColor ? { backgroundColor: confirmColor } : null]}>
                            <Text style={s_modal.ModalButtonDeleteText}>{confirmText}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onCancel} style={[s_modal.ModalButton, s_modal.ModalButtonCancel]}>
                            <Text style={s_modal.ModalButtonCancelText}>{cancelText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

