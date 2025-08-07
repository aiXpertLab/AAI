import React from "react";

import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ItemDB } from "@/src/types";
import { useInvStore, } from '@/src/stores/InvStore';
import { s_inv } from "@/src/constants";
import ItemPickerModal from "@/src/modals/ItemPickerModal";
import { useItemCrud } from "@/src/firestore/fs_crud_item";

export const Inv3Items: React.FC = () => {
    const { oInv, setIsDirty, updateOInv } = useInvStore();
    const { fetchItems } = useItemCrud()
    const [modalVisible, setModalVisible] = React.useState(false);
    const [itemList, setItemList] = React.useState<ItemDB[]>([]);

    const inv_items = oInv?.inv_items || [];


    const onSelectItem = (newItem: ItemDB) => {
        if (!oInv) return;

        const inv_items = oInv.inv_items || [];
        const existing = inv_items.find(item => item.item_id === newItem.item_id);
        setIsDirty(true);

        let updatedItems;

        if (existing) {
            updatedItems = inv_items.map(item =>
                item.item_id === newItem.item_id
                    ? {
                        ...item,
                        item_quantity: (item.item_quantity ?? 1) + (newItem.item_quantity ?? 1),
                        item_amount: ((item.item_quantity ?? 1) + (newItem.item_quantity ?? 1)) * (item.item_rate ?? 0),
                    }
                    : item
            );
        } else {
            const newLine: Partial<ItemDB> = {
                item_id: newItem.item_id,
                item_number: newItem.item_number,
                item_name: newItem.item_name,
                item_description: newItem.item_description,
                item_quantity: 1,
                item_rate: newItem.item_rate,
                item_amount: newItem.item_rate,
                item_status: newItem.item_status,
            };
            updatedItems = [...inv_items, newLine];
        }

        updateOInv({ inv_items: updatedItems });
        setModalVisible(false);
    };

    return (
        <View style={[s_inv.ItemBox, { alignItems: "flex-start" }]}>
            {inv_items.length > 0 ? (
                inv_items.map((item, index) => (
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
                            <TouchableOpacity onPress={() => {
                                if (!oInv?.inv_items) return;
                                const updatedItems = oInv.inv_items.filter(i => i.item_id !== item.item_id);
                                updateOInv({ inv_items: updatedItems });
                                setIsDirty(true);
                            }}>

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
        </View >
    );
};
