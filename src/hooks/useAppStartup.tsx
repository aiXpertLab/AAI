// src/hooks/useAppStartup.ts
import React from "react";
import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';

import { useBizStore } from '@/src/stores/InvStore';
import { useBizCrud } from "@/src/firestore/fs_crud_biz"; // Adjust the import path as necessary

import { useFirebaseUserStore } from '@/src/stores/FirebaseUserStore';


export const useAppStartup = () => {
    const { setOBiz } = useBizStore();  // 🧠 Zustand action
    const { fetchBiz } = useBizCrud();
    const firebaseUser = useFirebaseUserStore((state) => state.FirebaseUser);

    React.useEffect(() => {
        const init = async () => {
            if (!firebaseUser) return;

            try {
                // 1. Load business info
                const bizData = await fetchBiz(firebaseUser.uid);
                setOBiz(bizData ?? null);

                // 2. Initialize RevenueCat
                Purchases.configure({
                    apiKey: Platform.select({
                        android: 'goog_gGLCFVPFhfagEKmYklWjTaZeeoZ',
                    }) || '',
                });

                // Purchases.setDebugLogsEnabled(true); // Optional: for logging in development mode
                // console.log('RevenueCat configured successfully');
            } catch (error) {
                console.error("Startup: Failed to fetch oBiz", error);
            }
        };
        init();
    }, [firebaseUser]); // run whenever firebaseUser changes
};

export type PaidStatus = 'Unpaid' | 'Partially Paid' | 'Paid' | 'Overdue';

