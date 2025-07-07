// fetchUserAndbiz.ts

import { SQLiteDatabase } from 'expo-sqlite';

import { BizDB } from "@/src/types";

export const fetchBiz = async (
    db: SQLiteDatabase,
    bizMe: string = '666'
): Promise<{ biz: BizDB | null }> => {
    try {
        const [bizResult] = await Promise.all([
            db.getFirstAsync<BizDB>('SELECT * FROM biz WHERE biz_me = ?', [bizMe]),
        ]);

        return {
            biz: bizResult ?? null,
        };
    } catch (error) {
        console.error('Error fetching user and biz:', error);
        return {
            biz: null,
        };
    }
};
