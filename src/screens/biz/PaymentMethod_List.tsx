import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useModalStore } from '@/src/stores/useModalStore';

import { Ionicons } from '@expo/vector-icons';

import { usePMStore } from '@/src/stores/useInvStore';
import { s_global, colors } from "@/src/constants";

import { RootStackPara, PMDB } from '@/src/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTabSync } from '@/src/hooks/useTabSync';

// Firestore imports
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { app } from "@/src/config/firebaseConfig";

export const PaymentMethod_List: React.FC = () => {
    useTabSync('items');
    const { filterIcon, showFilterIcon, hideFilterIcon } = useModalStore();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackPara>>();
    const [isFocused, setIsFocused] = useState(false);
    const [items, setItems] = useState<PMDB[]>([]);
    const { oPM, setOPM, createEmptyPM4New  } = usePMStore();  // 🧠 Zustand action

    // Firestore fetch
    const fetchItems = async () => {
        try {
            const db = getFirestore(app);
            const colRef = collection(db, "payment_methods");
            const q = query(colRef, where("is_deleted", "==", 0));
            const snapshot = await getDocs(q);
            const activeItems: PMDB[] = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id, // Use Firestore doc ID
            })) as PMDB[];
            setItems(activeItems);
        } catch (err) { console.error("Failed to load Items:", err); }
    };

    useFocusEffect(
        useCallback(() => {
            setIsFocused(true);
            return () => setIsFocused(false);
        }, [])
    );

    React.useEffect(() => { hideFilterIcon(); }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", fetchItems);
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
                    keyExtractor={(item) => item.id!.toString()}
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

