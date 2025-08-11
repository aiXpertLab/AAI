import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { s_global } from "@/src/constants/s_global";
import { useInvStore } from '@/src/stores/InvStore';

export const Inv5Notes: React.FC = () => {
    const { oInv, updateOInv, setOInv, isDirty, setIsDirty } = useInvStore();


    return (
        <View style={{ padding: 10, borderTopWidth: 1, borderColor: "#ccc", marginTop: 6 }}>
            {/* Notes */}
            <View>
                <Text style={s_global.Label}>Notes:</Text>
                <TextInput
                    style={[s_global.InputUnderline, { fontSize: 12, fontFamily: 'monospace', }]}
                    placeholder="Thank you for your business!"
                    placeholderTextColor="#aaa"
                    multiline
                    value={oInv!.inv_notes}
                    onChangeText={(text) => {
                        updateOInv({ inv_notes: text });
                        setIsDirty(true);
                    }}

                />
            </View>
            <View style={{ height: 20 }} />
            <View>
                <Text style={s_global.Label}>Terms & Conditions:</Text>
                <TextInput
                    style={[s_global.InputUnderline, { fontSize: 12, fontFamily: 'monospace', }]}
                    placeholder="Thank you for your business!"
                    placeholderTextColor="#aaa"
                    multiline
                    value={oInv!.inv_tnc}
                    onChangeText={(text) => {
                        updateOInv({ inv_tnc: text });
                        setIsDirty(true);
                    }}

                />
            </View>
        </View>
    );
};

// export default Inv5Notes;
