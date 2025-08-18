import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, ActivityIndicator, Alert } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";

import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';

import { useModalStore } from '@/src/stores/ModalStore';
import { cameraB64, processB64Item, uploadB64 } from "@/src/utils/u_img64";

import { Ionicons } from '@expo/vector-icons';

import { useItemStore } from '@/src/stores/ItemStore';
import { s_global, colors } from "@/src/constants";

import { RootStack, ItemDB, RouteType } from '@/src/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useItemCrud } from "@/src/firestore/fs_crud_item";
import { M_Confirmation, M_Spinning } from "@/src/modals";

const ItemsScreen: React.FC = () => {
    const mode = useRoute<RouteType<'CreateModify'>>().params?.mode ?? 'create_new';

    const { filterIcon, showFilterIcon, hideFilterIcon } = useModalStore();
    const navigation = useNavigation<NativeStackNavigationProp<RootStack>>();
    const [isFocused, setIsFocused] = useState(false);
    const [items, setItems] = useState<ItemDB[]>([]);
    const { createEmptyItem4New, setOItem } = useItemStore();  // 🧠 Zustand action
    const [isProcessing, setIsProcessing] = React.useState(false);

    const [previewItems, setPreviewItems] = useState<ItemDB[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const { insertItem, updateItem, fetchItems } = useItemCrud();

    useFocusEffect(
        useCallback(() => {
            setIsFocused(true);
            return () => setIsFocused(false);
        }, [])
    );

    React.useEffect(() => { hideFilterIcon(); }, []);

    useEffect(() => {
        const unsubscribeFocus = navigation.addListener("focus", async () => {
            try {
                const fetchedItems = await fetchItems();
                setItems(fetchedItems);
            } catch (err) {
                console.error("❌ fetchClients error:", err);
            }
        });

        return unsubscribeFocus;
    }, [navigation]);


    const handleUploadImage = async () => {
        const base64Image = await uploadB64();
        const items = await processB64Item(base64Image, setIsProcessing);
        console.log("Items from uploadB64:", items);
        if (items && items.length > 0) {
            setPreviewItems(items);
            setShowConfirm(true);
        } else {
            Alert.alert(
                "No Items Detected",
                "Looks like nothing was picked up from the image. You can still add items manually using the ➕ button."
            );
        }
    };

    const handleCamera = async () => {
        const base64Image = await cameraB64();
        await processB64Item(base64Image, setIsProcessing);
    };

    const cancelInsert = () => {
        setPreviewItems([]);
        setShowConfirm(false);
    };


    const confirmInsert = async () => {
        for (const item of previewItems) {
            await insertItem(item);
        }
        setPreviewItems([]);
        setShowConfirm(false);
        fetchItems();  // refresh from DB
    };


    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row', marginRight: 10, alignItems: 'flex-end' }}>

                    <TouchableOpacity onPressIn={handleUploadImage} style={{ marginRight: 20 }}>
                        <Ionicons name="arrow-up" size={28} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPressIn={handleCamera} style={{ marginRight: 0 }}>
                        <Ionicons name="camera-outline" size={28} color="#fff" />
                    </TouchableOpacity>

                </View>
            )
        });
    }, [navigation]);


    const renderRightActions = (progress: any, dragX: any, itemId: string) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [0, 0, 0, 1],
        });

        return (
            <RectButton
                style={s_global.deleteButton}
                onPress={() => handleDelete(itemId)}
            >
                <Ionicons name="trash-outline" size={24} color="white" />
            </RectButton>
        );
    };

    const handleDelete = async (itemId: string) => {
        await updateItem({ item_id: itemId, is_deleted: 1, },);
        setItems(prev => prev.filter(item => item.item_id !== itemId));
    };


    const renderItem = ({ item }: { item: ItemDB }) => (
        <Swipeable
            renderRightActions={(progress, dragX) =>
                renderRightActions(progress, dragX, item.item_id)
            }
        >

            <TouchableOpacity
                style={s_global.Card}
                onPress={() => {
                    setOItem(item)
                    navigation.navigate('DetailStack', {
                        screen: 'Item_Form',
                        params: { mode: 'modify_existed' }
                    });
                }}
                onLongPress={() => console.log("Long Press - maybe show item options", item.item_id)}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
                    <Text style={s_global.Label_BoldLeft_RegularRight} numberOfLines={1}>{item.item_name}</Text>
                    <Text>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(item.item_rate))}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={s_global.Content_Left_Right} numberOfLines={3}>
                            {item.item_description}
                        </Text>
                    </View>
                    <Text style={[s_global.Content, { textAlign: 'right', maxWidth: 180 }]} numberOfLines={1}>
                        {item.item_sku}
                    </Text>
                </View>

            </TouchableOpacity>
        </Swipeable>
    );

    return (
        <View style={s_global.Container}>
            <M_Spinning visible={isProcessing} />

            {items.length === 0 ? (
                <Text style={s_global.EmptyText}>No Items yet. Tap ➕ to add one.</Text>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.item_id}
                    renderItem={renderItem}
                />
            )}

            <TouchableOpacity style={[s_global.FABSquare,]}
                onPress={() => {
                    createEmptyItem4New();
                    navigation.navigate('DetailStack', {
                        screen: 'Item_Form',
                        params: { mode: 'create_new' }
                    });
                }}
            >
                <Ionicons name="add" size={42} color="white" />
            </TouchableOpacity>
            <M_Confirmation
                visible={showConfirm}
                title="Confirm Import"
                message={`Import ${previewItems.length} new item(s)?`}
                confirmText="Yes, Import"
                cancelText="Cancel"
                onConfirm={confirmInsert}
                onCancel={cancelInsert}
            />
        </View>

    );
};

export default ItemsScreen;
