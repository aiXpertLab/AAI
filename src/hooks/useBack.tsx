import { useEffect, useRef } from 'react';
import { BackHandler, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Options = {
    hasUnsavedChanges: boolean;
    title?: string;
    message?: string;
    discardText?: string;
    keepEditingText?: string;
};

export const useUnsavedChangesGuard = ({
    hasUnsavedChanges,
    title = 'Unsaved Changes',
    message = 'You have unsaved changes. Are you sure you want to discard them?',
    discardText = 'Discard',
    keepEditingText = 'Keep Editing',
}: Options) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const isFocusedRef = useRef(false);

    // Handle Android hardware back button
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                if (hasUnsavedChanges && isFocusedRef.current) {
                    showAlert();
                    return true; // Prevent default behavior
                }
                return false; // Allow default behavior
            }
        );

        return () => backHandler.remove();
    }, [hasUnsavedChanges]);

    // Track screen focus state
    useFocusEffect(() => {
        isFocusedRef.current = true;

        // Add custom back button listener when screen is focused
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (!hasUnsavedChanges || e.data.action.type !== 'GO_BACK') {
                // Don't prevent navigation if no unsaved changes or not a back action
                return;
            }

            // Prevent default behavior
            e.preventDefault();

            // Show confirmation dialog
            showAlert();
        });

        return () => {
            isFocusedRef.current = false;
            unsubscribe();
        };
    });

    const showAlert = () => {
        Alert.alert(title, message, [
            {
                text: keepEditingText,
                style: 'cancel',
                onPress: () => { },
            },
            {
                text: discardText,
                style: 'destructive',
                onPress: () => navigation.dispatch({ type: 'GO_BACK' }),
            },
        ]);
    };
};