import React from 'react';
import { Modal, View, ActivityIndicator, Text } from 'react-native';

interface Props {
    visible: boolean;
}

export const M_Spinning: React.FC<Props> = ({ visible }) => {
    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={() => { }}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{
                    backgroundColor: '#fff',
                    padding: 20,
                    borderRadius: 10,
                    alignItems: 'center',
                }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={{ marginTop: 10 }}>Processing...</Text>
                </View>
            </View>
        </Modal>
    );
};

