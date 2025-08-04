import React from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useInvStore, useBizStore } from '@/src/stores/InvStore';
import { useBizCrud } from '@/src/firestore/fs_crud_biz'

import { DetailStackPara } from '@/src/types';
import { s_inv } from "@/src/constants/s_inv";

import { pickAndSaveLogo } from '@/src/utils/logoUtils';

export const Inv1Me: React.FC = () => {

    const navigation = useNavigation<NativeStackNavigationProp<DetailStackPara>>();

    const { oInv, updateOInv } = useInvStore();
    const { oBiz, } = useBizStore();  // 🧠 Zustand action
    const { updateBiz } = useBizCrud();

    if (!oInv) return <Text>Loading...</Text>;

    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 5 }}>
            <TouchableOpacity style={[s_inv.LogoBox,]} onPress={() => pickAndSaveLogo(db)}>
                <View style={{ alignItems: 'center' }}>
                    {oBiz?.biz_logo ? (
                        <Image source={{ uri: oBiz.biz_logo }} style={s_inv.LogoBox} resizeMode="cover" />
                    ) : (
                        <View style={s_inv.LogoBox}>
                            <Text style={{ color: "#999" }}>+ Logo here.</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>

            {/* Biz Info */}
            <TouchableOpacity
                onPress={() => navigation.navigate("BizInfo")}
                activeOpacity={0.8}
                style={{ flex: 1 }}
            >
                <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ fontWeight: "bold" }}>{oInv!.biz_name}</Text>
                    <Text style={s_inv.SmallInfoText}>{oInv!.biz_address}</Text>
                    <Text style={s_inv.SmallInfoText}>{oInv!.biz_phone}</Text>
                    <Text style={s_inv.SmallInfoText}>{oInv!.biz_biz_number}</Text>
                </View>
            </TouchableOpacity>
        </View>

    );
};

