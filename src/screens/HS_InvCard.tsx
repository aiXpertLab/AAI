import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { InvDB } from '@/src/types';
import { s_global } from "@/src/constants/s_global";
import { timestamp2us } from "@/src/utils/dateUtils";

interface Props { item: InvDB; }

const statusColorMap = {
    Overdue: '#D87C7C',
    Unpaid: '#E0E0E0',
    Paid: '#88B88A',
    'Partially Paid': '#E5C07B',
    All: '#E0E0E0',
};

export const InvoiceCard: React.FC<Props> = ({ item }) => {

    return (
        <View style={[
            s_global.Card,
            {
                borderLeftColor: statusColorMap[item.inv_payment_status as keyof typeof statusColorMap] || '#E0E0E0',
                borderLeftWidth: 4
            }
        ]} >
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 6 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', lineHeight: 20 }}>{item.client_company_name}</Text>
                    <Text style={{ color: 'gray', lineHeight: 20 }}>{item.inv_number}</Text>
                    <Text style={{ color: 'gray', lineHeight: 20 }}>{item.inv_reference}</Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontWeight: 'bold' }}>${item.inv_total}</Text>
                    <Text style={{ color: 'gray' }}>{timestamp2us(item.inv_date)}</Text>
                    <Text style={{ color: 'gray' }}>{item.inv_payment_status}</Text>
                </View>
            </View>
        </View>
    );
};

