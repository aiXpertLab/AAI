import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { InvItemDB, ItemDB } from "@/src/types";
import { useSQLiteContext } from "expo-sqlite";
import { invoiceStyles } from "@/src/constants/styles";
import ItemPickerModal from "@/src/modals/ItemPickerModal";
import { useNavigation, } from "@react-navigation/native";

const LineItemsList: React.FC = () => {
    const db = useSQLiteContext();
    const [modalVisible, setModalVisible] = React.useState(false);
    const [itemList, setItemList] = React.useState<ItemDB[]>([]);
    const navigation = useNavigation();
    const [initialList, setInitialList] = React.useState<InvItemDB[]>([]);

    React.useEffect(() => {
        // Snapshot the list when the screen is mounted
        setInitialList(JSON.parse(JSON.stringify(oInvItemList)));
    }, []);

    const hasUnsavedChanges = JSON.stringify(oInvItemList) !== JSON.stringify(initialList);

    const resetToInitialState = () => {
        setOInvItemList(initialList);
      };

    React.useEffect(() => {
        const unsubscribe = navigation.addListener("beforeRemove", (e) => {
            if (!hasUnsavedChanges) return;

            e.preventDefault();

            Alert.alert(
                "Discard changes?",
                "You have unsaved changes. Are you sure you want to discard them and leave?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Discard",
                        style: "destructive",
                        onPress: () => {
                            resetToInitialState(); // 👈 Restore original oInvItemList before leaving
                            navigation.dispatch(e.data.action); // Proceed with navigation
                          }
                    },
                ]
            );
        });

        return unsubscribe;
    }, [navigation, hasUnsavedChanges]);

    const fetchItems = async () => {
        try {
            const result = await db.getAllAsync<ItemDB>("SELECT * FROM Items WHERE NOT is_deleted ORDER BY id DESC");
            setItemList(result);
        } catch (err) {
            console.error("Failed to load Items:", err);
        }
    };

    const softDeleteItemInDB = async (id: number) => {
        try {
            await db.runAsync("UPDATE InvItem SET is_deleted = 1 WHERE id = ?", id);
        } catch (err) {
            console.error("Failed to soft-delete item in DB:", err);
        }
    };


    const handleDeleteItem = (id: number) => {
        Alert.alert("Confirm Delete", "Are you sure you want to remove this item?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    removeOInvItemList(id);                    
                },
            },
        ]);
    };


    React.useEffect(() => {
        fetchItems();
    }, []);

    const onSelectItem = (item: InvItemDB) => {
        addOInvItemList(item);
        setModalVisible(false);
    };

    return (
        <View style={[invoiceStyles.sectionBox, { alignItems: "flex-start" }]}>
            {oInvItemList.length > 0 ? (
                oInvItemList.map((item, index) => (
                    <View key={index} style={{ marginBottom: 16, width: "100%", flexDirection: "row" }}>
                        {/* Left: Text Info (flex: 1 to take up space) */}
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ fontWeight: "bold" }}>{item.item_name}</Text>
                                <Text style={{ fontSize: 12, color: "#888" }}>
                                    {item.item_quantity} x ${(item.item_rate ?? 0).toFixed(2)}
                                </Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 12, color: "#888" }}>{item.item_description ?? ""}</Text>
                                <Text style={{ fontSize: 12, fontWeight: "600" }}>
                                    ${(item.item_quantity * (item.item_rate ?? 0)).toFixed(2)}
                                </Text>
                            </View>
                        </View>

                        {/* Right: Trash Icon vertically centered */}
                        <View style={{ justifyContent: "center", paddingLeft: 6 }}>
                            <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
                                <Ionicons name="trash" size={20} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            ) : (
                <Text style={{ color: "#aaa" }}>No items or services added yet</Text>
            )}

            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{ flexDirection: "row", alignItems: "center", paddingTop: 8 }}
            >
                <Ionicons name="add-circle" size={20} color="#4CAF50" style={{ marginRight: 6 }} />
                <Text style={[invoiceStyles.addText, { color: "#888" }]}>Add a line</Text>
            </TouchableOpacity>

            <ItemPickerModal
                visible={modalVisible}
                items={itemList}
                onClose={() => setModalVisible(false)}
                onSelectItem={onSelectItem}
            />
        </View>
    );
};

export default LineItemsList;
