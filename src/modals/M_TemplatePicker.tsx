import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { WebView } from "react-native-webview";
import Toast from 'react-native-toast-message';
import { s_global, s_modal } from '@/src/constants';

import { useSQLiteContext } from 'expo-sqlite';
import { genHTML } from "@/src/utils/genHTML";
import { useInvStore, useInvItemListStore, useBizStore } from '@/src/stores/InvStore';
import Purchases from 'react-native-purchases';

type Props = {
    visible: boolean;
    onClose: () => void;
};

export const M_TemplatePicker: React.FC<Props> = ({ visible, onClose, }) => {
    const { oInv, updateOInv, } = useInvStore();
    const { updateOBiz, oBiz } = useBizStore();
    const { oInvItemList } = useInvItemListStore();
    const db = useSQLiteContext();

    const saveTemplate2DB = async (template_id: string) => {
        try {
            await db.runAsync('UPDATE biz       SET biz_inv_template_id = ? WHERE me = ?', [template_id, 'meme']);
            await db.runAsync('UPDATE invoices  SET biz_inv_template_id = ? WHERE id = ?', [template_id, oInv!.id!]);
            Toast.show({ type: 'success', text1: 'Template Saved!', text2: "Your template has been updated." });
        } catch (err) {
            console.error("Error saving logo:", err);
            Toast.show({ type: 'fail', text1: 'Failed to Save Logo', text2: "An error occurred." });
        }
    };

    const handleTemplatePress = async (templateId: string) => {
        if (templateId === 't18') {
            try {
                const products = await Purchases.getProducts(['pid_customized_template'], Purchases.PURCHASE_TYPE.INAPP);
                // console.log('Available products:', products);
                const offerings = await Purchases.getOfferings();

                const current = offerings.current;
                if (!current || current.availablePackages.length === 0) {
                    console.error("No offerings/packages found.");
                    Toast.show({ type: 'error', text1: 'Error', text2: 'No available purchase option.' });
                    return;
                }

                const selectedPackage = current.availablePackages[0];

                const { customerInfo } = await Purchases.purchasePackage(selectedPackage);

                // if (products.length === 0) {
                //     console.error('Product not found!');
                // } else {
                //     console.log('Product details:', products[0]);
                // }


                // const { customerInfo } = await Purchases.purchaseProduct('pid_customized_template');



                if (customerInfo.entitlements.active['customized_template']) {
                    // updateOInv({ biz_inv_template_id: templateId });
                    // updateOBiz({ biz_inv_template_id: templateId });
                    // await saveTemplate2DB(templateId);
                    Toast.show({ type: 'success', text1: 'Purchased!', text2: 'Template unlocked.' });
                    onClose();
                } else {
                    Toast.show({ type: 'error', text1: 'Not entitled', text2: 'Purchase not verified.' });
                }
            } catch (e: any) {
                if (!e.userCancelled) {
                    console.error('Purchase failed', e);
                    Toast.show({ type: 'error', text1: 'Error', text2: 'Something went wrong.' });
                }
            }
        } else {
            updateOInv({ biz_inv_template_id: templateId });
            updateOBiz({ biz_inv_template_id: templateId });
            await saveTemplate2DB(templateId);
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={s_modal.ModalOverlay}>
                <View style={s_modal.TemplateModalContainer}>
                    <Text style={styles.title}>Choose a Template</Text>

                    <ScrollView style={{ alignSelf: 'stretch', maxHeight: 530 }}>
                        <View style={styles.grid}>
                            {['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12', 't13', 't14', 't15', 't16', 't17', 't18'].slice(0, 18).map((key) => (
                                <TouchableOpacity
                                    key={key}
                                    onPress={() => handleTemplatePress(key)}
                                    activeOpacity={0.9}
                                    style={styles.templateBox}
                                >
                                    <WebView
                                        originWhitelist={['*']}
                                        source={{ html: genHTML(oInv!, oBiz!, oInvItemList, "picker", key) }}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: 'transparent'
                                        }}
                                        scrollEnabled={false}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 18,
        marginTop: 8,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    templateLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    closeBtn: {
        marginTop: 16,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#eee',
        borderRadius: 10,
    },
    closeText: {
        fontSize: 16,
    },
    templateBox: {
        width: '47%',
        aspectRatio: 1 / 1.414,
        // height: 180,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f1f1f1',
        marginHorizontal: '1%',
        justifyContent: 'center',
        // alignItems: 'center',        this is the key issue
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        position: 'relative',
    },
});
