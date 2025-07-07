import React from "react";
import { View, Text } from "react-native";
import { useFonts, Caveat_400Regular } from '@expo-google-fonts/caveat';

export const TooltipBubble = ({ text }: { text?: string }) => {
    const [fontsLoaded] = useFonts({ Caveat_400Regular, });

    if (!fontsLoaded) { return null; }

    return (
        <View style={{
            position: 'absolute',
            top: "20%",
            left: "20%",
            backgroundColor: '#fff8dc',
            padding: 10,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#ddd',
            maxWidth: 200,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
            elevation: 4,
            transform: [{ rotate: '-2deg' }],
        }}>
            <Text style={{
                fontFamily: 'Caveat_400Regular',
                fontSize: 26,
                color: 'blue',
            }}>
                {text ?? '✨ Tap to edit — anything on screen!'}
            </Text>
        </View>
    );
};
