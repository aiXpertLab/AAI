import React from "react";

import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { InvItemDB } from "@/src/types";
import { useInvStore, useInvItemListStore } from '@/src/stores/InvStore';
import { s_inv } from "@/src/constants";
import ItemPickerModal from "@/src/modals/ItemPickerModal";
import { useItemCrud } from "@/src/firestore/fs_crud_item";

export const Inv3Items: React.FC = () => {
    const { oInv, setIsDirty, updateOInv } = useInvStore();
    const { oInvItemList, setOInvItemList, removeOInvItemList } = useInvItemListStore();
    const { fetchItems } = useItemCrud()
    const [modalVisible, setModalVisible] = React.useState(false);
    const [itemList, setItemList] = React.useState<InvItemDB[]>([]);


    React.useEffect(() => {
        const fetchData = async () => {
            const result = await fetchItems();
            setItemList(result);
        };

        fetchData();
    }, []);

    const onSelectItem = (newItem: InvItemDB) => {

        const existing = oInvItemList.find(item => item.item_id === newItem.id);
        setIsDirty(true);

        if (existing) {

            const updatedList = oInvItemList.map(item =>
                item.item_id === newItem.id
                    ? {
                        ...item,
                        item_quantity: (item.item_quantity ?? 1) + (newItem.item_quantity ?? 1),
                    }
                    : item
            );

            setOInvItemList(updatedList);
        } else {
            // console.log("[onSelectItem] No match found — adding new item:", newItem);

            const newLine: Partial<InvItemDB> = {
                item_id: newItem.id,
                item_number: newItem.item_number,
                item_name: newItem.item_name,
                item_description: newItem.item_description,
                item_quantity: 1,
                item_rate: newItem.item_rate,
                item_amount: newItem.item_rate * 1,
                item_status: newItem.item_status,
            };
            setOInvItemList([...oInvItemList, newLine]);
        }

        setModalVisible(false);
    };

    return (
        <View style={[s_inv.ItemBox, { alignItems: "flex-start" }]}>
            {oInvItemList.length > 0 ? (
                oInvItemList.map((item, index) => (
                    <View key={index} style={{ marginBottom: 12, width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                        {/* Left Column: Item Info */}
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                                <Text style={{ fontWeight: "bold", flexShrink: 1 }}>{item.item_name}</Text>
                                <Text style={{ fontSize: 12, color: "#888", marginLeft: 8 }}>
                                    {item.item_quantity} x ${(item.item_rate ?? 0).toFixed(2)}
                                </Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 12, color: "#888" }}>{item.item_description ?? ""}</Text>
                                <Text style={{ fontSize: 12, fontWeight: "600" }}>
                                    ${(item!.item_quantity! * (item.item_rate ?? 0)).toFixed(2)}
                                </Text>
                            </View>
                        </View>

                        {/* Right Column: Trash Icon vertically centered */}
                        <View style={{ justifyContent: "center", paddingLeft: 8 }}>
                            <TouchableOpacity onPress={() => removeOInvItemList(item!.id!)}>
                                <Ionicons name="trash-outline" size={14} color="#e74c3c" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            ) : (
                <Text style={{ color: "#aaa" }}>No items or services added yet</Text>
            )}

            {/* Add Item Button */}
            <TouchableOpacity
                onPress={async () => {
                    await fetchItems();            // 🔄 Fetch first
                    setModalVisible(true);         // ✅ Then show modal
                }}
                style={{ flexDirection: "row", alignItems: "center", paddingTop: 8 }}
            >
                <Ionicons name="add-circle" size={20} color="#4CAF50" style={{ marginRight: 6 }} />
                <Text style={[s_inv.addText, { color: "#888" }]}>Add a line</Text>
            </TouchableOpacity>

            {/* Item Picker Modal */}
            <ItemPickerModal
                visible={modalVisible}
                items={itemList}
                onClose={() => setModalVisible(false)}
                onSelectItem={onSelectItem}
            />
        </View>
    );
};
