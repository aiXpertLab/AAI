// Firestore imports
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { app } from "@/src/config/firebaseConfig";

import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

import { useModalStore, useFirebaseUserStore, useTaxStore } from '@/src/stores/'
import { s_global, colors } from "@/src/constants";

import { RootStack, TaxDB } from '@/src/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const Tax_List: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStack>>();

    const db = getFirestore(app);
    const { FirebaseUser } = useFirebaseUserStore();
    const uid = FirebaseUser?.uid;

    const { filterIcon, showFilterIcon, hideFilterIcon } = useModalStore();
    const [isFocused, setIsFocused] = useState(false);
    const [items, setItems] = useState<TaxDB[]>([]);
    const { oTax, setOTax, createEmptyTax4New, clearOTax } = useTaxStore();  // 🧠 Zustand action

    const fetchItems = async () => {
        try {
            const colRef = collection(db, `aai/be_${uid}/tax_list`);
            const q = query(colRef, where("is_deleted", "==", 0));
            const snapshot = await getDocs(q);

            const activeItems: TaxDB[] = snapshot.docs.map(doc => doc.data() as TaxDB);

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

    const renderItem = ({ item }: { item: TaxDB }) => (
        <TouchableOpacity
            style={s_global.Card}
            onPress={() => {
                setOTax(item)
                console.log("Selected item:", oTax);
                navigation.navigate('DetailStack', {
                    screen: 'Tax_Form',
                    params: { mode: 'modify_existed' }
                });
            }}
            onLongPress={() => console.log("Long Press - maybe show item options", item.tax_id)}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
                <Text style={s_global.Label_BoldLeft_RegularRight} numberOfLines={1}>{item.tax_name}</Text>
                <Text>{(item.tax_rate * 100).toFixed(3).replace(/\.?0+$/, '')}%</Text>

            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
                <Text style={s_global.Content} numberOfLines={1}>{item.tax_note}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={s_global.Container}>

            {items.length === 0 ? (
                <Text style={s_global.EmptyText}>No Tax yet. Tap ➕ to add one.</Text>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.tax_id}
                    renderItem={renderItem}
                />
            )}

            <TouchableOpacity style={[s_global.FABSquare,]}
                onPress={() => {
                    createEmptyTax4New();
                    navigation.navigate('DetailStack', {
                        screen: 'Tax_Form',
                        params: { mode: 'create_new' }
                    });
                }}
            >
                <Ionicons name="add" size={42} color="white" />
            </TouchableOpacity>

        </View>
    );
};

