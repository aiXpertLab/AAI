import { getFirestore, setDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { app } from "@/src/config/firebaseConfig";
import * as Crypto from 'expo-crypto';

import { getUserUid } from "@/src/utils/getFirebaseUid";
const db = getFirestore(app);
import { TaxDB } from '@/src/types';


export const useTaxCrud = () => {

    const updateTax = async (
        tax: Partial<TaxDB>,
        onSuccess: () => void,
        onError: (err: any) => void
    ) => {
        try {
            const uid = getUserUid();
            if (!uid || !tax.tax_id) throw new Error("Missing UID or Tax ID");

            const docRef = doc(db, `aai/be_${uid}/tax_list`, tax.tax_id);

            const { tax_id, ...updateFields } = tax; // remove id from payload

            await updateDoc(docRef, {
                ...updateFields,
                updated_at: serverTimestamp(),
            });

            onSuccess();
        } catch (err) {
            console.error("❌ updateTax error:", err);
            onError(err);
        }
    };


    const insertTax = async (
        tax: Partial<TaxDB>,
        onSuccess: () => void,
        onError: (err: any) => void
    ) => {
        try {
            const uid = getUserUid();
            if (!uid) throw new Error('Missing UID');
            const tax_id = Crypto.randomUUID();

            const docRef = doc(db, `aai/be_${uid}/tax_list`, tax_id);

            const newTax: Partial<TaxDB> = {
                ...tax,
                tax_id: tax_id,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
                is_deleted: 0,
            };

            // const docRef = await addDoc(colRef, newPM);
            await setDoc(docRef, newTax);
            console.log("✅ Inserted Tax:", docRef.id);

            onSuccess();
        } catch (err) {
            console.error("❌ insertTax error:", err);
            onError(err);
        }
    };

    return { insertTax, updateTax };
};