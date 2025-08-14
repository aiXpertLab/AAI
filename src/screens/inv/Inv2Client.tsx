import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

import { Timestamp } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

import { addDateDays, timestamp2us } from "@/src/utils/dateUtils";

import { ClientDB, InvDB } from "@/src/types";
import { invoiceStyles } from "@/src/constants/styles";
import { s_global } from "@/src/constants/s_global"
import M_ClientPicker from "@/src/modals/M_ClientPicker_Inv";

import { useInvStore, useClientStore } from "@/src/stores";
import { useClientCrud } from "@/src/firestore/fs_crud_client";

export const Inv2Client: React.FC = () => {
    const { oInv, setIsDirty, updateOInv } = useInvStore();
    const { oClient, setOClient, createEmptyClient4New, updateOClient } = useClientStore();  // 🧠 Zustand action
    const [clients, setClients] = React.useState<ClientDB[]>([]);
    const { insertClient, updateClient, fetchClients } = useClientCrud();

    const [isClientModalVisible, setClientModalVisible] = React.useState(false);

    const [showIssueDatePicker, setShowIssueDatePicker] = React.useState(false);
    const [showDueDatePicker, setShowDueDatePicker] = React.useState(false);


    if (!oInv) { return "loading..."; }

    const onPressClientPicker = () => {
        setIsDirty(true); // Trigger a re-render to show the modal
        setClientModalVisible(true);
    };

    const handleSelectClient = (client: ClientDB) => {
        updateOInv({ client_id: client.client_id, });
        setOClient(client); // Update Zustand store with selected client
        setPaymentTerm(String(client.client_payment_term));
        setClientModalVisible(false);
    };

    const setPaymentTerm = (text: string) => {
        if (text === "") {
            updateOInv({ inv_payment_term: 0 });
        } else {
            // Allow "0" by explicitly checking the string isn't empty
            const term = parseInt(text);
            if (!isNaN(term)) {  // This will now properly accept 0
                const issueDate = oInv.inv_date ? oInv.inv_date : new Date();
                const newDueDate = addDateDays(issueDate, term);
                updateOInv({
                    inv_payment_term: term,
                    inv_due_date: newDueDate,
                });
            }
        }
    };


    return (
        <View style={{ marginBottom: 26 }}>
            {/* Top Block: Client + Invoice Metadata */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 16 }}>
                {/* Client Info */}
                <View style={{ flex: 1 }}>
                    <Text style={invoiceStyles.smallText}>Billed to:</Text>
                    <TouchableOpacity
                        onPress={onPressClientPicker}
                        style={[!oClient && invoiceStyles.addClientBox,
                        {
                            flex: 1,
                            paddingVertical: 8,
                            justifyContent: oClient ? "flex-start" : "center",
                            alignItems: oClient ? "flex-start" : "center",
                        },
                        ]}
                    >
                        {oClient ? (
                            <View>
                                <Text style={invoiceStyles.clientName}>{oClient.client_company_name}</Text>
                                <Text style={invoiceStyles.clientDetail}>{oClient.client_contact_name}</Text>
                                {oClient.client_address && <Text style={invoiceStyles.clientDetail}>{oClient.client_address}</Text>}
                                {oClient.client_mainphone && <Text style={invoiceStyles.clientDetail}>{oClient.client_mainphone}</Text>}
                            </View>
                        ) : (
                            <Text style={{ color: "#999", textAlign: "center" }}>+ Add a Client</Text>
                        )}
                    </TouchableOpacity>
                    <M_ClientPicker
                        visible={isClientModalVisible}
                        onClose={() => setClientModalVisible(false)}
                        onSelectClient={handleSelectClient}
                    />
                </View>

                {/* Invoice Metadata */}
                <View style={{ flex: 1, alignItems: "flex-end" }}>

                    {/* Invoice No. & Dates */}
                    <View style={{ marginBottom: 4, width: "100%" }}>
                        <Text style={[s_global.Label, { textAlign: "right", marginBottom: 0 }]}>Invoice No.</Text>
                        <TextInput
                            style={s_global.slimInputRight}
                            value={oInv.inv_number ?? ""}
                            onChangeText={(text) => {
                                setIsDirty(true);
                                updateOInv({ inv_number: text });
                            }}
                        />
                    </View>

                    {/* Invoice Date & Due Date */}
                    <View style={{ marginBottom: 6, width: "100%" }}>
                        <Text style={[s_global.Label, { textAlign: "right", marginBottom: 0 }]}>Date of Issue</Text>
                        <TouchableOpacity
                            onPress={() => setShowIssueDatePicker(true)}
                            style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                            <Text style={s_global.InputRightAAA}>{timestamp2us(oInv.inv_date)}</Text>
                            <Ionicons name="calendar-outline" size={18} color="#888" style={{ marginLeft: 6 }} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginBottom: 6, width: "100%" }}>
                        <Text style={[s_global.Label, { textAlign: "right", marginBottom: 0 }]}>Due Date</Text>
                        <TouchableOpacity
                            onPress={() => setShowDueDatePicker(true)}
                            style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}
                        >
                            <Text style={s_global.InputRightAAA}>{timestamp2us(oInv.inv_due_date)}</Text>
                            <Ionicons name="calendar-outline" size={18} color="#888" style={{ marginLeft: 6 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Bottom Block: Payment Term & Reference */}

            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 16 }}>
                {/* Payment Term */}
                {oClient && (
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={[s_global.Label, { textAlign: "left", marginBottom: 0, fontSize: 14 }]}>Payment Term:</Text>
                            <Text style={{ color: "#222", marginLeft: 4 }}>Net</Text>

                            <TextInput
                                style={{ color: "#aaa", textAlign: "left", width: 60, paddingVertical: 4, paddingHorizontal: 8 }}
                                value={oInv.inv_payment_term !== undefined ? `${oInv.inv_payment_term}` : ""}
                                keyboardType="numeric"
                                onChangeText={setPaymentTerm}
                            />
                        </View>
                    </View>
                )}

                {/* Reference */}
                <View style={{ flex: 1 }}>
                    <Text style={[s_global.Label, { textAlign: "right", marginBottom: 0 }]}>Reference</Text>
                    <TextInput style={s_global.slimInputRight}
                        value={oInv.inv_reference ?? ""}
                        onChangeText={(text) => {
                            updateOInv({ inv_reference: text });
                            setIsDirty(true);
                        }}
                    />
                </View>

            </View>


            {/* Date Pickers */}
            {showIssueDatePicker && (
                <DateTimePicker
                    value={oInv.inv_date ? oInv.inv_date : new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowIssueDatePicker(false);
                        if (selectedDate) {
                            setIsDirty(true);
                            const term = oInv.inv_payment_term ?? 7;
                            // const newDueDate = addDateDays(selectedDate, term);
                            updateOInv({
                                inv_date: selectedDate,
                                // inv_due_date: newDueDate.toISOString(),
                            });
                        }
                    }}

                />
            )}
            {showDueDatePicker && (
                <DateTimePicker
                    value={oInv.inv_due_date ? oInv.inv_due_date : new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDueDatePicker(false);
                        if (selectedDate) {
                            setIsDirty(true);
                            const issueDate = oInv.inv_date ? oInv.inv_date : new Date();
                            const diffMs = selectedDate.getTime() - issueDate.getTime();
                            const term = Math.round(diffMs / (1000 * 60 * 60 * 24));

                            updateOInv({
                                inv_due_date: selectedDate,
                                inv_payment_term: term >= 0 ? term : 0,
                            });
                        }
                    }}

                />
            )}
        </View>
    );
};

// export default Inv2Client;
