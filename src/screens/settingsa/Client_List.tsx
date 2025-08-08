// Firestore imports
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { app } from "@/src/config/firebaseConfig";
import { useFirebaseUserStore } from '@/src/stores/'

import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Animated } from "react-native";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Ionicons } from '@expo/vector-icons';
import { s_global } from "@/src/constants";

import { useClientStore, useModalStore } from '@/src/stores';
import { RootStackPara, ClientDB } from '@/src/types';

import { useClientCrud } from "@/src/firestore/fs_crud_client";


const ClientsScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackPara>>();

    const db = getFirestore(app);
    const { FirebaseUser } = useFirebaseUserStore();
    const uid = FirebaseUser?.uid;

    const { filterIcon, showFilterIcon, hideFilterIcon } = useModalStore();
    const { oClient, setOClient, createEmptyClient4New, updateOClient } = useClientStore();  // 🧠 Zustand action

    const [isFocused, setIsFocused] = useState(false);
    const [clients, setClients] = useState<ClientDB[]>([]);
    const { insertClient, updateClient, fetchClients } = useClientCrud();

    const renderRightActions = (progress: any, dragX: any, clientId: string) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [0, 0, 0, 1],
        });

        return (
            <RectButton
                style={s_global.deleteButton}
                onPress={() => handleDelete(clientId)}
            >
                <Ionicons name="trash-outline" size={24} color="white" />
            </RectButton>
        );
    };

    const handleDelete = async (clientId: string) => {
        await updateClient(
            {
                client_id: clientId,
                is_deleted: 1,
            },
            async () => {
                const updatedClients = await fetchClients();
                setClients(updatedClients);  // update state
            },
            (err) => {
                console.error("❌ Failed to delete client:", err);
            }
        );

    };

    React.useLayoutEffect(() => {
        return () => {
            showFilterIcon(); // Hide filter icon when leaving the screen
        };
    }, [navigation]);


    useFocusEffect(
        useCallback(() => {
            hideFilterIcon(); // Hide filter icon when leaving the screen
            setIsFocused(true);
            return () => setIsFocused(false);
        }, [])
    );      // this is for status bar color

    useEffect(() => {
        const unsubscribeFocus = navigation.addListener("focus", async () => {
            try {
                const fetchedClients = await fetchClients();
                setClients(fetchedClients);
            } catch (err) {
                console.error("❌ fetchClients error:", err);
            }
        });

        return unsubscribeFocus;
    }, [navigation]);


    React.useEffect(() => {
        hideFilterIcon();
    }, []);

    const renderLineOfClient = ({ item: line_of_client }: { item: ClientDB }) => (
        <Swipeable
            renderRightActions={(progress, dragX) =>
                renderRightActions(progress, dragX, line_of_client.client_id!)
            }
        >
            <TouchableOpacity style={s_global.Card}
                onPress={() => {
                    setOClient(line_of_client)
                    navigation.navigate('DetailStack', {
                        screen: 'Client_Form',
                        params: { mode: 'modify_existed' }
                    });
                }}
            >
                <Text style={s_global.Label}>{line_of_client.client_company_name}</Text>
                <Text style={s_global.Content}>{line_of_client.client_address || "N/A"}</Text>
                <Text style={s_global.Content}>👤 {line_of_client.client_contact_name || "N/A"}, {line_of_client.client_contact_title || "N/A"}</Text>
                <Text style={s_global.Content}>📧 {line_of_client.client_email || "N/A"} </Text>
                <Text style={s_global.Content}>📞 {line_of_client.client_mainphone || "N/A"}</Text>
                <Text style={s_global.Content}>💱 {line_of_client.client_currency}, {line_of_client.client_payment_term} days</Text>
                <Text style={s_global.Content}>Note: {line_of_client.client_note || "N/A"}</Text>
            </TouchableOpacity>
        </Swipeable>
    );

    return (
        <View style={s_global.Container}>
            {clients.length === 0 ? (
                <Text style={s_global.EmptyText}>No Clients yet. Tap ➕ to add one.</Text>
            ) : (
                <FlatList
                    data={clients}
                    keyExtractor={(item) => item.client_id}
                    renderItem={renderLineOfClient}
                />
            )}

            <TouchableOpacity style={s_global.FABSquare}
                onPress={() => {
                    createEmptyClient4New();
                    navigation.navigate('DetailStack', {
                        screen: 'Client_Form',
                        params: { mode: 'create_new' }
                    });
                }}
            >
                <Ionicons name="add" size={42} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default ClientsScreen;
