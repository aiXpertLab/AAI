import React from "react";
import { Pressable, View, FlatList, TouchableOpacity, StatusBar } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';

import { useInvStore, useInvItemListStore } from '@/src/stores/InvStore';
import { RootStackPara, InvDB, InvItemDB } from '@/src/types';
import { SummaryCards, FilterTabs, M_HeaderFilter } from "@/src/screens/home";

import { s_global } from "@/src/constants";
import { InvoiceCard } from "@/src/screens/home/InvoiceCard";
import { initNewInv } from "@/src/db/seedDemoInvoices";
import { useInvCrud } from "@/src/firestore/fs_crud_inv";
import { useTabSync } from '@/src/hooks/useTabSync';
import { getInvoiceNumber } from "@/src/utils/genInvNumber";

const HomeScreen: React.FC = () => {
    useTabSync('Invoices');
    const navigation = useNavigation<NativeStackNavigationProp<RootStackPara>>();

    const [selectedFilter, setSelectedFilter] = React.useState<string>("All");
    const [invoices, setInvoices] = React.useState<InvDB[]>([]);
    const { fetchInvs } = useInvCrud();

    const [summaryTotals, setSummaryTotals] = React.useState({ overdue: 0, unpaid: 0 });

    const { setOInv, updateOInv } = useInvStore();  // 🧠 Zustand action
    const { clearOInvItemList, setOInvItemList } = useInvItemListStore();

    const [selectedHeaderFilter, setSelectedHeaderFilter] = React.useState({
        hf_client: "All",
        hf_fromDate: new Date("2001-01-01"),
        hf_toDate: new Date(new Date().setHours(24, 0, 0, 0)),
    });

    const { hf_client, hf_fromDate, hf_toDate } = selectedHeaderFilter;

    const handleSelectInvoice = async (invoice: InvDB) => {
        setOInv(invoice);   // 🧠 Save selected invoice to Zustand
        // console.log(JSON.stringify(invoice, null, 4));

        // try {
        //     const items = await db.getAllAsync<InvItemDB>("SELECT * FROM inv_items WHERE inv_id = ?", [invoice.id]);
        //     setOInvItemList(items); // ✅ Store fetched items
        // } catch (err) {
        //     console.error("Failed to fetch items for invoice", invoice.id, err);
        //     setOInvItemList([]); // Optionally clear on failure
        // }
    };

    const fetchInvoicesFromModule = async () => {
        try {
            const result = await fetchInvs(hf_client, hf_fromDate, hf_toDate);
            const overdue = result.filter(inv => inv.inv_payment_status === 'Overdue')
                .reduce((sum, inv) => sum + (inv.inv_balance_due || 0), 0);

            const unpaid = result.filter(inv => inv.inv_payment_status === 'Unpaid')
                .reduce((sum, inv) => sum + (inv.inv_balance_due || 0), 0);

            setInvoices(result);
            setSummaryTotals({ overdue, unpaid });
        } catch (err) {
            console.error("Failed to load invoices:", err);
        }
    };

    const renderRightActions = (progress: any, dragX: any, invId: string) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [0, 0, 0, 1],
        });

        return (
            <RectButton
                style={s_global.deleteButton}
                onPress={() => handleDelete(invId)}
            >
                <Ionicons name="trash-outline" size={24} color="white" />
            </RectButton>
        );
    };

    const handleDelete = async (itemId: string) => {
        console.log("Deleting invoice with ID:", itemId);
        // try {
        //     await db.runAsync("UPDATE invoices SET is_deleted = 1 WHERE id = ?", [itemId]);
        //     fetchInvoices(); // Refresh the list
        // } catch (err) {
        //     console.error("Failed to delete client:", err);
        // }
    };

    const renderItem = ({ item: invoice }: { item: InvDB }) => (
        <Swipeable
            renderRightActions={(progress, dragX) =>
                renderRightActions(progress, dragX, invoice.inv_id!)
            }
        >

            <Pressable
                onPress={() => {
                    handleSelectInvoice(invoice);
                    navigation.navigate('DetailStack', {
                        screen: 'Inv_Pay',
                        params: { mode: 'modify_existed' },
                    });
                }}
                style={({ pressed }) => ({
                    transform: [{ translateY: pressed ? 1 : 0 }],
                })}
            >
                <InvoiceCard item={invoice} />
            </Pressable>
        </Swipeable>
    );

    React.useEffect(() => {
        fetchInvoicesFromModule();
    }, [selectedHeaderFilter]);

    useFocusEffect(
        React.useCallback(() => {
            fetchInvoicesFromModule();
        }, [])
    );

    // React.useEffect(() => {
    //     const unsubscribe = navigation.addListener("focus", () => {
    //         fetchInvoicesFromModule();
    //     });
    //     return unsubscribe;
    // }, []);

    return (

        <View style={s_global.Container}>            
            <View>

                <SummaryCards overdue={summaryTotals.overdue} unpaid={summaryTotals.unpaid} />


                {/* filter tabs */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                    <FilterTabs selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
                </View>
            </View>

            {/* List Section - takes remaining space */}
            <FlatList<InvDB>
                data={selectedFilter === "All" ? invoices : invoices.filter(inv => inv.inv_payment_status === selectedFilter)}
                keyExtractor={(item) => item.inv_id}

                renderItem={renderItem}
                contentContainerStyle={
                    [
                        invoices.length === 0 && { flex: 1, justifyContent: 'center' }
                    ]}
            />

            <M_HeaderFilter
                selectedHeaderFilter={selectedHeaderFilter}
                setSelectedHeaderFilter={setSelectedHeaderFilter}
            />

            <TouchableOpacity
                style={[s_global.FABSquare]}
                onPress={async () => {
                    const newNumber = await getInvoiceNumber();
                    const newInvoice = await initNewInv(newNumber); // wait for invoice
                    updateOInv(newInvoice); // zustand update

                    clearOInvItemList();

                    navigation.navigate('DetailStack', {
                        screen: 'Inv_Form_New',
                        params: { mode: 'create_new' }
                    });
                }}
            >
                <Ionicons name="add" size={42} color="white" />
            </TouchableOpacity>

        </View >
    );
};

export default HomeScreen;
// console.log(JSON.stringify(oBiz, null, 4));
