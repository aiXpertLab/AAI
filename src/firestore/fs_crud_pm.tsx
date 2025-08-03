import { getFirestore, setDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { app } from "@/src/config/firebaseConfig";
import * as Crypto from 'expo-crypto';

import { getUserUid } from "@/src/utils/getFirebaseUid";
const db = getFirestore(app);
import { PMDB } from '@/src/types';


export const usePMCrud = () => {

    const updatePM = async (
        pm: Partial<PMDB>,
        onSuccess: () => void,
        onError: (err: any) => void
    ) => {
        try {
            const uid = getUserUid();
            if (!uid || !pm.pm_id) throw new Error("Missing UID or PaymentMethod ID");

            const docRef = doc(db, `aai/be_${uid}/payment_methods`, pm.pm_id);

            const { pm_id, ...updateFields } = pm; // remove id from payload

            await updateDoc(docRef, {
                ...updateFields,
                updated_at: serverTimestamp(),
            });

            onSuccess();
        } catch (err) {
            console.error("❌ updatePM error:", err);
            onError(err);
        }
    };


    const insertPM = async (
        pm: Partial<PMDB>,
        onSuccess: () => void,
        onError: (err: any) => void
    ) => {
        try {
            const uid = getUserUid();
            if (!uid) throw new Error('Missing UID');
            const pm_id = 'p_' + Crypto.randomUUID().replace(/-/g, '');


            // const colRef = collection(db, `aai/be_${uid}/payment_methods`);
            const docRef = doc(db, `aai/be_${uid}/payment_methods`, pm_id);

            const newPM: Partial<PMDB> = {
                ...pm,
                pm_id: pm_id,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
                is_deleted: 0,
            };

            // const docRef = await addDoc(colRef, newPM);
            await setDoc(docRef, newPM);
            console.log("✅ Inserted PM:", docRef.id);

            onSuccess();
        } catch (err) {
            console.error("❌ insertPM error:", err);
            onError(err);
        }
    };

    return { insertPM, updatePM };
};