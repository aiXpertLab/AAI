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
            <View style={s_global.Drawer_Container}>
                <Text style={s_global.drawer_title}>{title}</Text>
                {subtitle && <Text style={s_global.drawer_subtitle}>{subtitle}</Text>}
            </View>
            {toggle ? (
                <Switch value={toggleValue} onValueChange={onToggle} />
            ) : (
                <Text style={s_global.arrow}>›</Text>
            )}
        </TouchableOpacity>
    );
};

export default SettingItem;

