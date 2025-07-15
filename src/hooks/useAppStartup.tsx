// src/hooks/useAppStartup.ts
import React from "react";
import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';

import { useSQLiteContext } from "expo-sqlite";
import { useBizStore } from '@/src/stores/useInvStore';
import { checkOverdueInvoices } from "@/src/utils/invoiceUtils"; // Adjust the import path as necessary

export const useAppStartup = () => {
    const db = useSQLiteContext();
    const { setOBiz } = useBizStore();  // 🧠 Zustand action

    React.useEffect(() => {
        const init = async () => {
            try {
                // 1. Load business info
                const i0Biz = await db.getAllAsync<any>(`SELECT * FROM biz WHERE me = 'meme'`);
                if (i0Biz?.[0]) { setOBiz(i0Biz[0]); }

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

