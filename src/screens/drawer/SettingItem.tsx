// src/components/SettingItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { s_global, colors } from "@/src/constants";

interface SettingItemProps {
    title: string;
    subtitle?: string;
    toggle?: boolean;
    toggleValue?: boolean;
    onToggle?: (val: boolean) => void;
    onPress?: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
    title,
    subtitle,
    toggle,
    toggleValue = false,
    onToggle,
    onPress,
}) => {
    return (
        <TouchableOpacity style={s_global.SettingsItem} activeOpacity={toggle ? 1 : 0.7} onPress={toggle ? undefined : onPress}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
            {toggle ? (
                <Switch value={toggleValue} onValueChange={onToggle} />
            ) : (
                <Text style={styles.arrow}>›</Text>
            )}
        </TouchableOpacity>
    );
};

export default SettingItem;

const styles = StyleSheet.create({
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        color: '#111827',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    arrow: {
        fontSize: 18,
        color: '#9CA3AF',
        marginLeft: 12,
    },
});
