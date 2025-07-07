// src/hooks/useTabSync.ts
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useTabStore } from '@/src/stores/useTabStore';

export const useTabSync = (tabName: string) => {
    useFocusEffect(
        useCallback(() => {
            useTabStore.getState().setCurrentTab(tabName);
        }, [tabName])
    );
};
