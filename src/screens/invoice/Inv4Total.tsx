import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { modalStyles, invoiceStyles } from "@/src/constants/styles";
import { s_global } from "@/src/constants/s_global";
import { TaxDB } from "@/src/types";
import {  useInvStore } from '@/src/stores/InvStore';
import DiscountModal from "@/src/modals/DiscountModal";
import M_TaxPicker from "@/src/modals/M_TaxPicker";

export const Inv4Total: React.FC = () => {
    const { oInv, isDirty, setIsDirty, updateOInv } = useInvStore();  // 🧠 Zustand action
    const [discount, setDiscount] = React.useState<{ value: number; type: 'percent' | 'flat' } | null>(null);
    const [oTax, setOTax] = React.useState<TaxDB | null>(null);
    const [discountModalVisible, setDiscountModalVisible] = React.useState(false);
    const [showTaxModal, setShowTaxModal] = React.useState(false);

    const [taxRows, setTaxRows] = React.useState<TaxDB[]>([]);

    if (!oInv!.inv_items) return "loading total..."

    const subtotal = React.useMemo(() => {
        // return oInvItems.reduce((sum, item) => sum + (item.item_quantity ?? 1) * (item.item_rate ?? 0), 0);
        const raw = oInv!.inv_items.reduce((sum, item) =>
            sum + (item.item_quantity ?? 1) * (item.item_rate ?? 0), 0);
        return Math.round(raw * 100) / 100;
    }, [oInv!.inv_items]);


    const discountAmount = React.useMemo(() => {
        if (discount?.value) {
            const value = Number(discount.value);
            if (isNaN(value) || value <= 0) return 0;
            const rawAmount = discount.type === 'percent'
                ? subtotal * (value / 100)
                : value;
            return Math.round(rawAmount * 100) / 100;
        }

        return oInv?.inv_discount ?? 0;
    }, [discount, subtotal, oInv?.inv_discount]);

    const fetchTaxes = async () => {
        try {
            const resultTax = await db.getAllAsync<TaxDB>("SELECT * FROM Tax where is_deleted=0 ");
            console.log(JSON.stringify(resultTax, null, 4));
            setTaxRows(resultTax);
        } catch (err) {
            console.error("Failed to load Taxes:", err);
        }
    };

    const onPressTax = () => {
        fetchTaxes(); // Fetch taxes from the database
        setShowTaxModal(true);
    }

    const onSelectTax = (tax: TaxDB) => {
        setOTax(tax); // tax_rate is already SUM of selected ones
        updateOInv({
            inv_tax_label: tax.tax_name,
            inv_tax_rate: tax.tax_rate,
        });

        // tax_name: combinedName,
        //     tax_rate: combinedRate,

    };

    const taxableAmount = subtotal - discountAmount;

    const taxAmount = React.useMemo(() => {
        if (oTax) {
            return Math.round(taxableAmount * oTax.tax_rate * 100) / 100;
        }

        return oInv?.inv_tax_amount ?? 0;
    }, [oTax, taxableAmount, oInv?.inv_tax_amount]);

    const total = taxableAmount + taxAmount;

    const handleApplyDiscount = (value: number, type: 'percent' | 'flat') => {
        setDiscount({ value, type });
        setDiscountModalVisible(false);
    };

    React.useEffect(() => {
        setIsDirty(true);
        updateOInv({
            inv_subtotal: subtotal,
            inv_discount: discountAmount,
            inv_tax_amount: Math.round(taxAmount * 100) / 100,
            inv_total: Math.round(total * 100) / 100,
            inv_balance_due: Math.round(total * 100) / 100,
        });
    }, [subtotal, discountAmount, taxAmount, total]);

    return (
        <View style={{ padding: 10, borderTopWidth: 1, borderColor: "#ccc", marginTop: 6 }}>
            <View style={invoiceStyles.totalRow}>
                <Text style={s_global.Label}>Subtotal</Text>
                <Text style={invoiceStyles.value}>${subtotal.toFixed(2)}</Text>
            </View>

            {/* Discount */}
            {/* Discount Line */}
            <TouchableOpacity onPress={() => setDiscountModalVisible(true)}>
                <View style={invoiceStyles.totalRow}>
                    <Text style={[s_global.Label, { color: "#007AFF" }]}>
                        {discount ? `Discount${discount.type === "percent" ? ` (${discount.value}%)` : ""}` : "Add a Discount"}
                    </Text>
                    <Text style={invoiceStyles.value}>-${discountAmount.toFixed(2)}</Text>
                </View>
            </TouchableOpacity>

            {/* Tax */}
            <TouchableOpacity onPress={onPressTax}>
                <View style={invoiceStyles.totalRow}>
                    <Text
                        style={[s_global.Label, { color: "#007AFF", flexWrap: "wrap", maxWidth: 150, }]}
                        numberOfLines={2} // or more if needed
                    >
                        {oInv?.inv_tax_label ? oInv?.inv_tax_label : "Select Tax"}
                    </Text>
                    <Text style={invoiceStyles.value}>${taxAmount.toFixed(2)}</Text>
                </View>
            </TouchableOpacity>

            {/* Discount Modal */}
            <DiscountModal
                visible={discountModalVisible}
                onClose={() => setDiscountModalVisible(false)}
                onApply={handleApplyDiscount}
            />

            <M_TaxPicker
                visible={showTaxModal}
                onClose={() => setShowTaxModal(false)}
                onSelectTax={onSelectTax}
                taxRows={taxRows} // TODO: pass your tax rows here
            />


            {/* Total */}
            <View style={[invoiceStyles.totalRow, { borderTopWidth: 1, borderColor: "#ccc", paddingTop: 8, marginTop: 8 },]}>
                <Text style={[s_global.Label, { fontWeight: "bold" }]}>Total</Text>
                <Text style={[invoiceStyles.value, { fontWeight: "bold" }]}>${total.toFixed(2)}</Text>
            </View>

        </View>

    );
};

// export default Inv4Total;
