import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useTipVisibility(tipKey: string, trigger: boolean, autoHideMs = 3000) {
    const [visible, setVisible] = useState(false);
    const MAX_VIEWS = 125;

    useEffect(() => {
        const checkAndShow = async () => {
            if (!trigger) return;

            const countStr = await AsyncStorage.getItem(tipKey);
            const count = countStr ? parseInt(countStr, 10) : 0;

            if (count < MAX_VIEWS) {
                setVisible(true);
                await AsyncStorage.setItem(tipKey, String(count + 1));
                if (autoHideMs) {
                    setTimeout(() => setVisible(false), autoHideMs);
                }
            }
        };

        checkAndShow();
    }, [trigger]);

    return { visible, setVisible };
}
