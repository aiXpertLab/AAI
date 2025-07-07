import React, { useEffect, useState, useCallback } from "react";
import { Image, View, Text, FlatList, TouchableOpacity } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useModalStore } from '@/src/stores/useModalStore';
import { useInvStore, useBizStore } from '@/src/stores/useInvStore';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system";
import { useSQLiteContext } from "expo-sqlite";
import Toast from "react-native-toast-message";

import { useTaxStore } from '@/src/stores/useInvStore';
import { s_inv, s_global, } from "@/src/constants";

import { RootStackPara, TaxDB } from '@/src/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTabSync } from '@/src/hooks/useTabSync';

export const Biz_Logo: React.FC = () => {
    useTabSync('items');
    const db = useSQLiteContext();
    const { filterIcon, showFilterIcon, hideFilterIcon } = useModalStore();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackPara>>();
    const [isFocused, setIsFocused] = useState(false);
    const [items, setItems] = useState<TaxDB[]>([]);
    const { oTax, setOTax, createEmptyTax4New, clearOTax } = useTaxStore();  // 🧠 Zustand action
    const { oBiz, updateOBiz } = useBizStore();  // 🧠 Zustand action
    const { updateOInv } = useInvStore();  // 🧠 Zustand action

    const fetchItems = async () => {
        try {
            const activeItems = await db.getAllAsync<TaxDB>("SELECT * FROM tax where NOT is_deleted");
            setItems(activeItems);
        } catch (err) { console.error("Failed to load Items:", err); }
    };

    useFocusEffect(
        useCallback(() => {
            setIsFocused(true);
            return () => setIsFocused(false);
        }, [])
    );

    React.useEffect(() => { hideFilterIcon(); }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", fetchItems);
        return unsubscribe;
    }, [navigation]);

    const renderItem = ({ item }: { item: TaxDB }) => (
        <TouchableOpacity
            style={s_global.Card}
            onPress={() => {
                setOTax(item)
                console.log("Selected item:", oTax);
                navigation.navigate('DetailStack', {
                    screen: 'Tax_Form',
                    params: { mode: 'modify_existed' }
                });
            }}
            onLongPress={() => console.log("Long Press - maybe show item options", item.id)}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
                <Text style={s_global.Label_BoldLeft_RegularRight} numberOfLines={1}>{item.tax_name}</Text>
                <Text>{item.tax_rate * 100}%</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
                <Text style={s_global.Content} numberOfLines={1}>{item.tax_note}</Text>
            </View>
        </TouchableOpacity>
    );

    const saveLogoToDB = async (uri: string, uri64: string) => {
        try {
            await db.runAsync('UPDATE biz SET biz_logo = ?, biz_logo64=? WHERE me = ?', [uri, uri64, 'meme']);
            Toast.show({ type: 'success', text1: 'Logo Saved!', text2: "Your logo has been updated." });
        } catch (err) {
            console.error("Error saving logo:", err);
            Toast.show({ type: 'fail', text1: 'Failed to Save Logo', text2: "An error occurred." });
        }
    };

    const handleAddLogo = async () => {
        console.log("handleAddLogo");
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permission to access media library is required!");
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
            base64: false,
        });

        if (!pickerResult.canceled && pickerResult.assets.length > 0) {
            const uri = pickerResult.assets[0].uri;
            try {
                const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64, });
                const mimeType = pickerResult.assets[0].mimeType || "image/jpeg";
                const dataUri64 = `data:${mimeType};base64,${base64}`;

                console.log("dataUri64:", dataUri64);
                
                updateOBiz({ biz_logo: uri, biz_logo64: dataUri64 });
                await saveLogoToDB(uri, dataUri64);
            } catch (error) {
                console.error("Failed to convert logo to base64:", error);
            }
        }
    };

    return (
        <View style={[s_global.Container, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
            <TouchableOpacity style={s_inv.LogoBoxBig} onPress={handleAddLogo}>
                {oBiz?.biz_logo ? (
                    <Image source={{ uri: oBiz.biz_logo }} style={s_inv.LogoBoxBig} resizeMode="cover" />
                ) : (
                    <View style={s_inv.LogoBoxBig}>
                        <Text style={{ color: "#999" }}>+ Logo here.</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

