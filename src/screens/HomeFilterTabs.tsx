import React from "react";
import { ScrollView, Text, TouchableOpacity, ViewStyle } from "react-native";
import { s_global } from "@/src/constants/s_global";

interface Props {
    selectedFilter: string;
    setSelectedFilter: (filter: string) => void;
}

const invoiceFilters = ["All", "Overdue", "Unpaid", "Paid", "Partially Paid"];
const statusColorMap = {
    Overdue: '#D87C7C',
    Unpaid: '#E0E0E0',
    Paid: '#88B88A',
    'Partially Paid': '#E5C07B',
    All: '#E0E0E0',
};


export const HomeFilterTabs: React.FC<Props> = ({ selectedFilter, setSelectedFilter }) => {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
            {invoiceFilters.map((filter) => (
                <TouchableOpacity
                    key={filter}
                    style={[
                        s_global.FilterTab,
                        selectedFilter === filter && s_global.FilterTabSelected,
                        { borderColor: statusColorMap[filter as keyof typeof statusColorMap] || '#E0E0E0' }
                    ]}
                    onPress={() => setSelectedFilter(filter)}
                >
                    <Text style={[
                        s_global.FilterTabText,
                        selectedFilter === filter && s_global.FilterTabTextSelected,
                    ]}>
                        {filter}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

