import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ItemDB } from "@/src/types";
import { useInvStore } from "@/src/stores/InvStore";
import { s_inv } from "@/src/constants";
import M_ItemPicker from "@/src/modals/M_ItemPicker";
import { useItemCrud } from "@/src/firestore/fs_crud_item";

export const Inv3Items: React.FC = () => {
    const { oInv, setIsDirty, updateOInv } = useInvStore();
    const { fetchItems } = useItemCrud();
    const [modalVisible, setModalVisible] = useState(false);
    const [itemList, setItemList] = useState<ItemDB[]>([]);

    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const inputRef = useRef<TextInput>(null);

    const inv_items = oInv?.inv_items || [];

    // Focus when entering edit mode
    useEffect(() => {
        if (editingItemId && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingItemId]);

    const onSelectItem = (newItem: ItemDB) => {
        if (!oInv) return;
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
            updatedItems = [...inv_items, newItem];
        }

        updateOInv({ inv_items: updatedItems });
        setModalVisible(false);
    };

    const updateQuantity = (itemId: string, qty: number) => {
        if (!oInv) return;
        const updatedItems = inv_items.map(item =>
            item.item_id === itemId
                ? { ...item, item_quantity: qty, item_amount: qty * (item.item_rate ?? 0) }
                : item
        );
        updateOInv({ inv_items: updatedItems });
        setIsDirty(true);
    };

    return (
        <View style={[s_inv.ItemBox, { alignItems: "flex-start" }]}>
            {inv_items.length > 0 ? (
                inv_items.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.9}
                        style={{
                            marginBottom: 12,
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                        onPress={() => setEditingItemId(item.item_id!)}
                    >
                        {/* Left Column: Item Info */}
                        <View style={{ flex: 1 }}>
                            {/* First Row */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",   // ✅ keeps both vertically aligned
                                    width: "100%",
                                }}
                            >
                                {/* <Text style={{ fontWeight: "bold", flexShrink: 1 }}> */}
                                <Text
                                    style={{ fontWeight: "bold", flex: 1 }}
                                    numberOfLines={3}
                                    ellipsizeMode="tail"
                                >
                                    {item.item_name}
                                </Text>

                                {editingItemId === item.item_id ? (
                                    <View style={{ flexDirection: "row", marginLeft: 8, flexShrink: 0 }}>
                                        <TextInput
                                            ref={inputRef}
                                            value={String(item.item_quantity)}
                                            onChangeText={(text) => {
                                                const numericValue = text.replace(/[^0-9]/g, "");
                                                updateQuantity(item.item_id!, Number(numericValue) || 0);
                                            }}
                                            keyboardType="numeric"
                                            style={{
                                                fontSize: 12,
                                                color: "#888",
                                                borderBottomWidth: 1,
                                                borderBottomColor: "#ccc",
                                                minWidth: 24,
                                                maxWidth: 40,
                                                textAlign: "center",
                                                paddingVertical: 0,
                                            }}
                                            onBlur={() => setEditingItemId(null)}
                                        />
                                        <Text style={{ fontSize: 12, color: "#888" }}>
                                            {" "}x ${(item.item_rate ?? 0).toFixed(2)}
                                        </Text>
                                    </View>
                                ) : (
                                    <Text style={{ fontSize: 12, color: "#888", marginLeft: 8 }}>
                                        {item.item_quantity} x ${(item.item_rate ?? 0).toFixed(2)}
                                    </Text>
                                )}
                            </View>


                            {/* Second Row */}
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 12, color: "#888", maxWidth: 260 }}>
                                    {item.item_description ?? ""}
                                </Text>
                                <Text style={{ fontSize: 12, fontWeight: "600" }}>
                                    ${(item.item_quantity! * (item.item_rate ?? 0)).toFixed(2)}
                                </Text>
                            </View>
                        </View>

                        {/* Right Column: Trash Icon */}
                        <View style={{ justifyContent: "center", paddingLeft: 8 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (!oInv?.inv_items) return;
                                    const updatedItems = oInv.inv_items.filter(i => i.item_id !== item.item_id);
                                    updateOInv({ inv_items: updatedItems });
                                    setIsDirty(true);
                                }}
                            >
                                <Ionicons name="trash-outline" size={14} color="#e74c3c" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={{ color: "#aaa" }}>No items or services added yet</Text>
            )}

            {/* Add Item Button */}
            <TouchableOpacity
                onPress={async () => {
                    const fetchedItems = await fetchItems();
                    setItemList(fetchedItems);
                    setModalVisible(true);
                }}
                style={{ flexDirection: "row", alignItems: "center", paddingTop: 8 }}
            >
                <Ionicons name="add-circle" size={20} color="#4CAF50" style={{ marginRight: 6 }} />
                <Text style={[s_inv.addText, { color: "#888" }]}>Add a line</Text>
            </TouchableOpacity>

            {/* Item Picker Modal */}
            <M_ItemPicker
                visible={modalVisible}
                items={itemList}
                onClose={() => setModalVisible(false)}
                onSelectItem={onSelectItem}
            />
        </View>
    );
};
