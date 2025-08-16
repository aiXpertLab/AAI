import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useModalStore } from '@/src/stores/ModalStore';

import { Ionicons } from '@expo/vector-icons';

import { usePMStore } from '@/src/stores/InvStore';
import { s_global, } from "@/src/constants";

import { RootStack, PMDB } from '@/src/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePMCrud } from "@/src/firestore/fs_crud_pm"

export const PaymentMethod_List: React.FC = () => {
    const { filterIcon, showFilterIcon, hideFilterIcon } = useModalStore();
    const { fetchPMs } = usePMCrud();
    const navigation = useNavigation<NativeStackNavigationProp<RootStack>>();
    const [isFocused, setIsFocused] = useState(false);
    const [items, setItems] = useState<PMDB[]>([]);
    const { oPM, setOPM, createEmptyPM4New } = usePMStore();  // 🧠 Zustand action

    useEffect(() => {
        const unsubscribeFocus = navigation.addListener("focus", async () => {
            try {
                const fetchedItems = await fetchPMs();
                setItems(fetchedItems);
            } catch (err) {
                console.error("❌ fetchClients error:", err);
            }
        });

        return unsubscribeFocus;
    }, [navigation]);


    useFocusEffect(
        useCallback(() => {
            setIsFocused(true);
            return () => setIsFocused(false);
        }, [])
    );

    React.useEffect(() => { hideFilterIcon(); }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", fetchPMs);
        return unsubscribe;
    }, [navigation]);

    const renderPM = ({ item: PM }: { item: PMDB }) => (
        <TouchableOpacity style={s_global.Card}
            onPress={() => {
                setOPM(PM);
                navigation.navigate('DetailStack', {
                    screen: 'PaymentMethod_Form',
                    params: { mode: 'modify_existed' }
                });

            }}

        >
            <Text style={s_global.Label}>{PM.pm_name}</Text>
            <Text style={s_global.Content}>{PM.pm_note || "N/A"}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={s_global.Container}>
            {items.length === 0 ? (
                <Text style={s_global.EmptyText}>No Payment Methods yet. Tap ➕ to add one.</Text>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.pm_id}
                    renderItem={renderPM}
                />
            )}

            <TouchableOpacity style={[s_global.FABSquare,]}
                onPress={() => {
                    createEmptyPM4New();
                    navigation.navigate('DetailStack', {
                        screen: 'PaymentMethod_Form',
                        params: { mode: 'create_new' }
                    });
                }}
            >
                <Ionicons name="add" size={42} color="white" />
            </TouchableOpacity>

        </View>
    );
};

