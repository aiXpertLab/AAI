import React from "react";
import { Text, Pressable, View, FlatList, TouchableOpacity, ToastAndroid } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from "@react-navigation/native";

// import { useSQLiteContext } from "expo-sqlite";
import { M_Confirmation, } from "@/src/modals";

import { useInvStore, useBizStore,  } from '@/src/stores/InvStore';
import { RootStackPara, InvDB, InvItemDB } from '@/src/types';
import { RouteType } from "@/src/types";

import { s_global, colors } from "@/src/constants";
import { InvoiceCard } from "@/src/screens/HomeInvCard";
import { useTabSync } from '@/src/hooks/useTabSync';
import { useInvCrud } from "@/src/firestore/fs_crud_inv";

export const RestoreScreen: React.FC = () => {
    useTabSync('Invoices');
    // const db = useSQLiteContext();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackPara>>();

    const mode = useRoute<RouteType<'Restore'>>().params?.mode ?? 'restore_deleted';
    let msg = mode === 'restore_deleted' ? "Deleted Invoices" : "Archived Invoices";

    console.log("RestoreScreen mode:", mode);

    const [selectedFilter, setSelectedFilter] = React.useState<string>("All");
    const [invoices, setInvoices] = React.useState<InvDB[]>([]);
    const { restoreArchived, restoreDeletedInvoice } = useInvoiceCrud();

    const [showConfirm, setShowConfirm] = React.useState(false);

    const { oInv, setOInv } = useInvStore();  // 🧠 Zustand action

    const onRestore = () => {
        setShowConfirm(true);
    };

    const handleConfirmRestore = async () => {
        setShowConfirm(false);
        if (mode === 'restore_archived') {
            const success = await restoreArchived(oInv?.id!, oInv?.inv_number!);
            if (success) fetchInvoices();
        }

        if (mode === 'restore_deleted') {
            const success = await restoreDeletedInvoice(oInv?.id!, oInv?.inv_number!);
            if (success) fetchInvoices();
        }
    };

    const handleSelectInvoice = async (invoice: InvDB) => {
        setOInv(invoice);   // 🧠 Save selected invoice to Zustand
    };


    const fetchInvoices = async () => {
        try {
            if (mode === 'restore_deleted') {
                let query = `SELECT * FROM invoices WHERE is_deleted = 1`;
                const result = await db.getAllAsync<any>(query);
                setInvoices(result);
            } else {
                let query = `SELECT * FROM invoices WHERE is_locked = 1`;
                const result = await db.getAllAsync<any>(query);
                setInvoices(result);
            }
        } catch (err) {
            console.error("Failed to load invoices:", err);
        }
    };

    React.useEffect(() => {
        const unsubscribe = navigation.addListener("focus", fetchInvoices);
        fetchInvoices();
        return unsubscribe;
    }, [navigation]);

    return (
        <View style={s_global.Container}>
            <StatusBar style="light" />
            {/* List Section - takes remaining space */}
            <FlatList
                data={
                    selectedFilter === "All"
                        ? invoices
                        : invoices.filter(inv => inv.inv_payment_status === selectedFilter)
                }
                keyExtractor={(item) => item.id!.toString()}
                renderItem={({ item: invoice }) => (
                    <Pressable
                        onPress={() => {
                            handleSelectInvoice(invoice);
                            onRestore();
                        }}

                        style={({ pressed }) => ({
                            transform: [{ translateY: pressed ? 1 : 0 }], // Moves down 2px when pressed
                        })}
                    >
                        <InvoiceCard item={invoice} />
                    </Pressable>
                )}
                ListEmptyComponent={
                    <View style={{ flex: 1, paddingTop: 30, alignItems: 'center' }}>
                        <Text style={s_global.EmptyText}>
                            No {msg.toLowerCase()} found.
                        </Text>
                    </View>
                }
                contentContainerStyle={[
                    invoices.length === 0 && { flex: 1, justifyContent: 'center' }
                ]}
            />

            <M_Confirmation
                visible={showConfirm}
                title="Confirm Restore"
                message="Are you sure you want to Restore this invoice?"
                confirmText="Restore"
                cancelText="Cancel"
                onConfirm={handleConfirmRestore}
                onCancel={() => setShowConfirm(false)}
                confirmColor="#4CAF50"
            />

        </View>
    );
};

