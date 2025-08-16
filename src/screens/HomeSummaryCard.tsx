import React from "react";
import { View, Text, FlatList } from "react-native";
import { s_global } from "@/src/constants/s_global";

interface SummaryCardsProps {
    overdue: number;
    unpaid: number;
}

export const HomeSummaryCards: React.FC<SummaryCardsProps> = ({ overdue, unpaid }) => {
    const summaryCards = [
        { id: '1', label: 'Total Overdue', value: `$${overdue.toFixed(2)}` },
        { id: '2', label: 'Total Unpaid', value: `$${unpaid.toFixed(2)}` },
    ];

    return (
        <View style={{ flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 6, paddingTop: 16, paddingBottom: 18 }}>
            {summaryCards.map((item) => (
                <View key={item.id} style={s_global.ChocolateCard}>
                    <Text style={s_global.SummaryLabel}>{item.label}</Text>
                    <Text
                        style={[
                            s_global.SummaryValue,
                            item.label === 'Total Overdue' && { color: "#c0392b" },
                        ]}
                    >
                        {item.value}
                    </Text>


                </View>
            ))}
        </View>
    );
};