import React from "react";
import { ToastAndroid, Pressable, View, FlatList, TouchableOpacity, Text } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTabSync } from '@/src/hooks/useTabSync';

import { HomeSummaryCards } from "@/src/screens/HomeSummaryCard";
import { HomeFilterTabs } from "@/src/screens/HomeFilterTabs";
import { InvoiceCard } from "@/src/screens/HomeInvCard";

import { RootStack, InvDB } from '@/src/types';
import { s_global } from "@/src/constants";
import { M_HeaderFilter } from "@/src/modals/M_HeaderFilter";

import { useInvStore, useBizStore } from '@/src/stores';
import { useInvCrud, useBizCrud } from "@/src/firestore";
import { calcOverdue } from "@/src/utils/invoiceUtils";

import { attachClientNames } from "@/src/utils/invoiceUtils";

const HomeScreen: React.FC = () => {
    useTabSync('Invoices');
    const navigation = useNavigation<NativeStackNavigationProp<RootStack>>();
    const { fetchBiz } = useBizCrud();
    const { oBiz, setOBiz, } = useBizStore();

    const [selectedFilter, setSelectedFilter] = React.useState<string>("All");
    const [invoices, setInvoices,] = React.useState<InvDB[]>([]);
    const { updateInv, fetchInvs, } = useInvCrud();
    const firstRun = React.useRef(true);

    const [summaryTotals, setSummaryTotals] = React.useState({ overdue: 0, unpaid: 0 });

    const { setOInv, oInv, updateOInv, createEmptyInv } = useInvStore();  // 🧠 Zustand action

    const [selectedHeaderFilter, setSelectedHeaderFilter] = React.useState({
        hf_client: "All",
        hf_fromDate: new Date("2001-01-01"),
        hf_toDate: new Date("2222-11-11"),
    });

    const { hf_client, hf_fromDate, hf_toDate } = selectedHeaderFilter;

    const handleSelectInvoice = async (invoice: InvDB) => {
        setOInv(invoice);   // 🧠 Save selected invoice to Zustand
    };


    const renderEmptyComponent = () => (
        <TouchableOpacity style={s_global.EmptyInvList} onPress={handleAddNewInvoice}        >
            <Text style={s_global.EmptyText}>Click ➕ to add a new invoice</Text>
        </TouchableOpacity>
    );

    const fetchInvoicesFromModule = async () => {
        try {
            const result_inv = await fetchInvs(hf_client, hf_fromDate, hf_toDate);
            const result_w_overdue = calcOverdue(result_inv);
            // const result_w_overdue = result_inv.map(inv => calcOverdue([inv]));
            // const result_w_overdue = [];
            // console.log("Processing invoices...", result_inv.length);
            // for (let i = 0; i < result_inv.length; i++) {
            //     console.log("Processing invoice:", result_inv[i].inv_number);
            //     const updatedInvoice = calcOverdue([result_inv[i]]);  // Pass the single invoice as an array
            //     result_w_overdue.push(updatedInvoice[0]);  // Add the updated invoice to result_w_overdue
            // }


            const result = await attachClientNames(result_w_overdue);

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
        try {
            await updateInv({ is_deleted: 1 }, itemId);
            await fetchInvoicesFromModule();
            ToastAndroid.show('Succeed!', ToastAndroid.SHORT);
        } catch (err) {
            ToastAndroid.show('Failed!', ToastAndroid.SHORT);
        }
        console.log("Deleting invoice with ID:", itemId);
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
                    navigation.navigate('DetailStack', { screen: 'InvPay' });
                }}
                style={({ pressed }) => ({
                    transform: [{ translateY: pressed ? 1 : 0 }],
                })}
            >
                <InvoiceCard item={invoice} />
            </Pressable>
        </Swipeable >
    );

    React.useEffect(() => {
        fetchInvoicesFromModule();
    }, [selectedHeaderFilter]);


    const fetchBiz1 = async () => {
        try {
            const data = await fetchBiz();
            setOBiz(data || null);
        } catch (err) {
            console.error("Failed to load invoices:", err);
        }
    };


    React.useEffect(() => {
        if (!oBiz) {
            fetchBiz1();
        }
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            if (firstRun.current) {
                firstRun.current = false;
                return; // skip first time, let useEffect handle it
            }
            fetchInvoicesFromModule(); // only runs on re-focus
        }, [selectedHeaderFilter])
    );

    const handleAddNewInvoice = async () => {
        createEmptyInv(oBiz!.be_inv_prefix, oBiz!.be_inv_integer)  //combine to get inv_number in empty
        navigation.navigate('DetailStack', { screen: 'Inv_New', });
    };


    return (
        <View style={s_global.Container}>
            <View>
                <HomeSummaryCards overdue={summaryTotals.overdue} unpaid={summaryTotals.unpaid} />

                {/* filter tabs */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                    <HomeFilterTabs selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
                </View>
            </View>

            {/* List Section - takes remaining space */}
            <FlatList<InvDB>
                data={selectedFilter === "All" ? invoices : invoices.filter(inv => inv.inv_payment_status === selectedFilter)}
                keyExtractor={(item) => item.inv_id}
                extraData={invoices}

                renderItem={renderItem}
                contentContainerStyle={
                    [
                        invoices.length === 0 && { flex: 1, justifyContent: 'center' }
                    ]}
                ListEmptyComponent={renderEmptyComponent}
            />

            <M_HeaderFilter selectedHeaderFilter={selectedHeaderFilter} setSelectedHeaderFilter={setSelectedHeaderFilter} />

            <TouchableOpacity style={[s_global.FABSquare]} onPress={handleAddNewInvoice}            >
                <Ionicons name="add" size={42} color="white" />
            </TouchableOpacity>

        </View >
    );
};

export default HomeScreen;
// console.log(JSON.stringify(oBiz, null, 4));
