import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { WebView } from "react-native-webview";
import Toast from 'react-native-toast-message';

import { s_global_template, s_modal } from '@/src/constants';
import { useBizCrud } from "@/src/firestore/fs_crud_biz";
import { useInvCrud } from "@/src/firestore/fs_crud_inv";
import { useClientStore, useInvStore, useBizStore } from '@/src/stores';

import { genHTML } from "@/src/utils/genHTML";
import Purchases from 'react-native-purchases';

type Props = {
    visible: boolean;
    onClose: () => void;
};

export const M_TemplatePicker: React.FC<Props> = ({ visible, onClose, }) => {
    const { oInv, updateOInv, } = useInvStore();
    const { updateOBiz, oBiz } = useBizStore();
    const { oClient } = useClientStore();
    const { updateBiz } = useBizCrud();
    const { updateInv } = useInvCrud();

    const saveTemplate2DB = async (template_id: string) => {
        updateBiz({be_inv_template_id: template_id,});
        updateInv({inv_template_id: template_id,}, oInv!.inv_id);
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
            updateOInv({ inv_template_id: templateId });
            updateOBiz({ be_inv_template_id: templateId });
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
                    <Text style={s_global_template.title}>Choose a Template</Text>

                    <ScrollView style={{ alignSelf: 'stretch', maxHeight: 530 }}>
                        <View style={s_global_template.grid}>
                            {['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12', 't13', 't14', 't15', 't16', 't17', 't18'].slice(0, 18).map((key) => (
                                <TouchableOpacity
                                    key={key}
                                    onPress={() => handleTemplatePress(key)}
                                    activeOpacity={0.9}
                                    style={s_global_template.templateBox}
                                >
                                    <WebView
                                        originWhitelist={['*']}
                                        source={{ html: genHTML(oInv!, oBiz!, "picker", key) }}
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

                    <TouchableOpacity style={s_global_template.closeBtn} onPress={onClose}>
                        <Text style={s_global_template.closeText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

