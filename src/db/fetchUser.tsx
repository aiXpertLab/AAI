// fetchUserAndbiz.ts

import { SQLiteDatabase } from 'expo-sqlite';

import { User, BizDB } from "@/src/types";

export const fetchBiz = async (
    db: SQLiteDatabase,
    userMe: string = '888',
    bizMe: string = '666'
): Promise<{ user: User | null; biz: BizDB | null }> => {
    try {
        const [userResult, bizResult] = await Promise.all([
            db.getFirstAsync<User>('SELECT * FROM users WHERE user_me = ?', [userMe]),
            db.getFirstAsync<BizDB>('SELECT * FROM biz WHERE biz_me = ?', [bizMe]),
        ]);

        return {
            user: userResult ?? null,
            biz: bizResult ?? null,
        };
    } catch (error) {
        console.error('Error fetching user and biz:', error);
        return {
            user: null,
            biz: null,
        };
    }
};
