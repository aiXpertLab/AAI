import { getFirestore, setDoc, updateDoc, doc, serverTimestamp, query, collection, where, getDocs } from "firebase/firestore";
import { app } from "@/src/config/firebaseConfig";
import * as Crypto from 'expo-crypto';

import { useFirebaseUserStore } from '@/src/stores/FirebaseUserStore';
import { TaxDB } from '@/src/types';

export const useTaxCrud = () => {
    const db = getFirestore(app);
    const firebaseUser = useFirebaseUserStore((state) => state.FirebaseUser);
    const uid = firebaseUser?.uid;
    if (!uid) throw new Error("Missing UID");

    const updateTax = async (
        tax: Partial<TaxDB>,
        onSuccess: () => void,
        onError: (err: any) => void
    ) => {
        try {
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
            if (!uid) throw new Error('Missing UID');
            const tax_id = 't_' + Crypto.randomUUID().replace(/-/g, '');


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


    const fetchTaxList = async (): Promise<TaxDB[]> => {
        try {
            const itemsRef = collection(db, `aai/be_${uid}/tax_list`);
            const q = query(itemsRef, where("is_deleted", "==", 0),);
            const querySnap = await getDocs(q);

            const tax_list: TaxDB[] = querySnap.docs.map(doc => doc.data() as TaxDB);
            return tax_list;
        } catch (err) {
            console.error("❌ fetchItems error:", err);
            throw err;
        }
    };

    return { insertTax, updateTax, fetchTaxList };
};