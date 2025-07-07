import React from 'react';
import { Text, TextInput } from 'react-native';

const CurrencyInput = ({ oItem, handleChange }) => {
    // Helper function to format as currency ($19,344.99)
    const formatAsCurrency = (value) => {
        if (value === undefined || value === null || value === '') return '';
        
        const num = typeof value === 'string' 
            ? parseFloat(value.replace(/[^0-9.-]/g, '')) 
            : value;
        
        if (isNaN(num)) return '';
        
        // Format with commas and 2 decimal places
        return '$' + num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Remove $ and commas for editing
    const removeCurrencyFormatting = (value) => {
        return value.replace(/[$,]/g, '');
    };

    // Format while typing (allow only numbers and decimal)
    const formatDecimalInput = (text) => {
        // Allow only numbers and single decimal point
        let cleanedText = text.replace(/[^0-9.]/g, '');
        
        // Remove extra decimal points
        const decimalSplit = cleanedText.split('.');
        if (decimalSplit.length > 2) {
            cleanedText = decimalSplit[0] + '.' + decimalSplit.slice(1).join('');
        }
        
        return cleanedText;
    };

    // Final format on blur (round to 2 decimal places)
    const formatDecimalOnBlur = (value) => {
        const num = parseFloat(value);
        if (isNaN(num)) return '';
        return Math.round(num * 100) / 100; // Round to 2 decimal places
    };

    return (
        <>
            <Text style={styles.label}>Unit Price</Text>
            <TextInput
                style={s_global.Input}
                placeholder="$9.99"
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
                value={oItem?.item_rate !== undefined ? formatAsCurrency(String(oItem.item_rate)) : ''}
                onChangeText={(text) => {
                    const cleanedValue = formatDecimalInput(removeCurrencyFormatting(text));
                    handleChange("item_rate", cleanedValue);
                }}
                onFocus={() => {
                    if (oItem?.item_rate !== undefined) {
                        // Show raw number when focused (without formatting)
                        handleChange("item_rate", String(oItem.item_rate));
                    }
                }}
                onBlur={() => {
                    if (oItem?.item_rate !== undefined) {
                        // Format properly when leaving the field
                        const formattedValue = formatDecimalOnBlur(oItem.item_rate);
                        handleChange("item_rate", formattedValue);
                    }
                }}
            />
        </>
    );
};

// Example styles - adjust as needed
const styles = {
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
};

const s_global = {
    Input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
};

export default CurrencyInput;