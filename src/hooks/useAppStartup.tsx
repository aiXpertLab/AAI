// src/hooks/useAppStartup.ts
import React from "react";
import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';

import { useSQLiteContext } from "expo-sqlite";
import { useBizStore } from '@/src/stores/useInvStore';
import { checkOverdueInvoices } from "@/src/utils/invoiceUtils"; // Adjust the import path as necessary
import { useBizCrud } from "@/src/firestore/fs_crud_biz"; // Adjust the import path as necessary
import { BE_DB } from "../types";

import { waitForFirebaseUser } from "@/src/utils/getFirebaseUid"; // path as needed
import { useFirebaseUserStore } from '@/src/stores/useUserStore';


export const useAppStartup = () => {
    const db = useSQLiteContext();
    const { setOBiz } = useBizStore();  // 🧠 Zustand action
    const { fetchBiz } = useBizCrud();
    const { setFirebaseUser } = useFirebaseUserStore();

    React.useEffect(() => {
        const init = async () => {
            try {
                // 1. Load business info
                const user = await waitForFirebaseUser();
                if (user) {
                    setFirebaseUser(user);
                    const uid = user.uid;
                    const bizData = await fetchBiz(uid);
                    setOBiz(bizData ?? null);
                }

                // 2. Check overdue invoices
                await checkOverdueInvoices(db);

                // 3. Initialize RevenueCat
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

    }, []);
};

export type PaidStatus = 'Unpaid' | 'Partially Paid' | 'Paid' | 'Overdue';

