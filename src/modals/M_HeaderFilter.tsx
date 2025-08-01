import React from "react";
import { Modal, View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useModalStore } from '@/src/stores/ModalStore';
import { s_modal, s_global } from "@/src/constants";
import M_HeaderClientPicker from "@/src/modals/M_ClientPicker_Header";
import { ClientDB } from "@/src/types";
import { formatDateForUI } from "../utils/dateUtils";

interface FilterModalProps {
    selectedHeaderFilter: {
        hf_client: string;
        hf_fromDate: Date;
        hf_toDate: Date;
    };
    setSelectedHeaderFilter: (val: {
        hf_client: string;
        hf_fromDate: Date;
        hf_toDate: Date;
    }) => void;
}

export function M_HeaderFilter({ selectedHeaderFilter, setSelectedHeaderFilter }: FilterModalProps) {
    const { filterModalVisible, hideFilterModal } = useModalStore();

    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const [selectedFromDate, setSelectedFromDate] = React.useState(oneMonthAgo);
    const [selectedToDate, setSelectedToDate] = React.useState(today);
    const [showFromDate, setShowFromDate] = React.useState(false);
    const [showToDate, setShowToDate] = React.useState(false);

    const [selectedClient, setSelectedClient] = React.useState("All");
    const [isClientModalVisible, setClientModalVisible] = React.useState(false);

    const onClearFilter = () => {
        const defaultFromDate = new Date(2000, 0, 1);
        const defaultToDate = new Date(2222, 0, 1);

        setSelectedHeaderFilter({
            hf_client: "All",
            hf_fromDate: defaultFromDate,
            hf_toDate: defaultToDate,
        });
        hideFilterModal();
    };


    const onPressClientPicker = () => setClientModalVisible(true);

    const handleSelectClient = (client: ClientDB | { client_company_name: string }) => {
        setSelectedClient(client.client_company_name);
        setClientModalVisible(false);
    };

    const onFromDateChange = (event: DateTimePickerEvent, date?: Date) => {
        if (date) {
            setSelectedFromDate(date);
        }
        setShowFromDate(Platform.OS === "ios");
    };

    const onToDateChange = (event: DateTimePickerEvent, date?: Date) => {
        if (date) {
            setSelectedToDate(date);
        }
        setShowToDate(Platform.OS === "ios");
    };

    const onApplyFilter = () => {

        setSelectedHeaderFilter({
            hf_client: selectedClient,
            hf_fromDate: selectedFromDate,
            hf_toDate: selectedToDate
        });
        hideFilterModal();
    };

    return (
        <Modal visible={filterModalVisible} animationType="fade" transparent>
            <View style={s_modal.ModalOverlay}>
                <View style={s_modal.ModalContainer}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <Text style={[s_modal.ModalTitle, { flex: 1 }]}>Filter Invoices</Text>
                        <TouchableOpacity onPress={onClearFilter} style={s_modal.ClearButton}>
                            <Text style={s_modal.ClearButtonText}>Clear Filters</Text>
                        </TouchableOpacity>
                    </View>


                    {/* Client Picker */}
                    <View style={s_modal.ModalSection}>
                        <Text style={s_modal.ModalLabel}>Client</Text>
                        <TouchableOpacity style={s_global.DropdownButton} onPress={onPressClientPicker}>
                            <Text style={s_global.DropdownText}>{selectedClient}</Text>
                            <Ionicons name="chevron-down" size={18} color="gray" />
                        </TouchableOpacity>
                        <M_HeaderClientPicker
                            visible={isClientModalVisible}
                            onClose={() => setClientModalVisible(false)}
                            onSelectClient={handleSelectClient}
                        />
                    </View>

                    {/* Date Range Pickers */}
                    <View style={s_modal.ModalSection}>
                        <Text style={s_modal.ModalLabel}>Date Range</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <TouchableOpacity style={s_global.DatePickerButton} onPress={() => setShowFromDate(true)}>
                                <Text>{formatDateForUI(selectedFromDate.toISOString())}</Text>
                                <Ionicons name="calendar-outline" size={18} color="#888" />
                            </TouchableOpacity>

                            <TouchableOpacity style={s_global.DatePickerButton} onPress={() => setShowToDate(true)}>
                                <Text>{formatDateForUI(selectedToDate.toISOString())}</Text>
                                <Ionicons name="calendar-outline" size={18} color="#888" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {showFromDate && (
                        <DateTimePicker
                            value={selectedFromDate}
                            mode="date"
                            display="default"
                            onChange={onFromDateChange}
                        />
                    )}

                    {showToDate && (
                        <DateTimePicker
                            value={selectedToDate}
                            mode="date"
                            display="default"
                            onChange={onToDateChange}
                        />
                    )}


                    <View style={s_modal.ModalActions}>
                        <TouchableOpacity onPress={hideFilterModal} style={[s_modal.ModalButton, s_modal.ModalButtonCancel]}>
                            <Text style={s_modal.ModalButtonCancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onApplyFilter} style={[s_modal.ModalButton, s_modal.ModalButtonConfirm]}>
                            <Text style={s_modal.ModalButtonConfirmText}>Apply</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
}
